from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StartupIdea, CreditTransaction
from .serializers import StartupIdeaSerializer, UserSerializer, CreditTransactionSerializer
from .tasks import analyze_startup_idea
from .permissions import IsAdminUser
from django.contrib.auth import get_user_model
from rest_framework import status
from openai import OpenAI
from decouple import config

User = get_user_model()

client = OpenAI(api_key=config("OPENAI_API_KEY"))

class SubmitIdeaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        idea_text = request.data.get('original_text')

        if not idea_text:
            return Response({'error': 'Falta el texto de la idea.'}, status=400)

        if request.user.credits <= 0:
            return Response({'error': 'No tienes créditos disponibles.'}, status=403)

        # ✅ Crear idea
        idea = StartupIdea.objects.create(user=request.user, original_text=idea_text)

        # ✅ Llamar a Celery → solo análisis + logo en segundo plano
        analyze_startup_idea.delay(idea.id, idea.original_text)

        # ✅ Restar crédito
        request.user.credits -= 1
        request.user.save()

        # Registrar transacción de créditos
        CreditTransaction.objects.create(
            user=request.user,
            amount=-1,
            reason=f'Envio de idea #{idea.id}'
        )

        idea.save()

        serializer = StartupIdeaSerializer(idea)
        return Response({
            'message': 'Idea enviada. La IA está analizándola.',
            'idea': serializer.data
        }, status=201)


class UserIdeasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ideas = StartupIdea.objects.filter(user=request.user).order_by('-created_at')
        serializer = StartupIdeaSerializer(ideas, many=True)
        return Response(serializer.data)


class RetrieveIdeaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, idea_id):
        try:
            idea = StartupIdea.objects.get(id=idea_id, user=request.user)
        except StartupIdea.DoesNotExist:
            return Response({'error': 'Idea no encontrada.'}, status=404)

        serializer = StartupIdeaSerializer(idea)
        return Response(serializer.data)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserCreditTransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = CreditTransaction.objects.filter(user=request.user).order_by('-created_at')
        serializer = CreditTransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class AdminRechargeCreditsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        user_id = request.data.get('user_id')
        amount = request.data.get('amount')
        reason = request.data.get('reason', 'Recarga manual de créditos')

        if not user_id or not amount:
            return Response({'error': 'Faltan parámetros.'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=404)

        # Actualizar créditos
        user.credits += int(amount)
        user.save()

        # Registrar transacción
        CreditTransaction.objects.create(
            user=user,
            amount=int(amount),
            reason=reason
        )

        return Response({
            'message': f'Se recargaron {amount} créditos al usuario {user.username}.',
            'new_credits': user.credits
        }, status=200)


class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = User.objects.all().order_by('id')
        data = [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'credits': user.credits
            }
            for user in users
        ]
        return Response(data)

class PublicIdeasView(APIView):
    def get(self, request):
        ideas = StartupIdea.objects.filter(is_public=True, status='completed').order_by('-created_at')
        serializer = StartupIdeaSerializer(ideas, many=True)
        return Response(serializer.data)

class MakeIdeaPublicView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, idea_id):
        try:
            idea = StartupIdea.objects.get(id=idea_id, user=request.user)
        except StartupIdea.DoesNotExist:
            return Response({'error': 'Idea no encontrada.'}, status=404)

        idea.is_public = True
        idea.save()

        return Response({'message': 'La idea ahora es pública.', 'is_public': idea.is_public}, status=200)
