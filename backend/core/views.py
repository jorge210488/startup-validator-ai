from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StartupIdea
from .serializers import StartupIdeaSerializer, UserSerializer  # <-- No olvides importar UserSerializer
from .tasks import analyze_startup_idea
from openai import OpenAI
from decouple import config

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

        # ✅ Generar logo
        try:
            image_response = client.images.generate(
                prompt=f"Logo minimalista para una startup llamada basada en: {idea_text[:50]}",
                n=1,
                size="512x512"
            )
            logo_url = image_response.data[0].url
            idea.logo_url = logo_url
        except Exception as e:
            logo_url = None  # Puedes registrar el error
            idea.logo_url = None

        # ✅ Llamar a Celery
        analyze_startup_idea.delay(idea.id, idea.original_text)

        # ✅ Restar crédito
        request.user.credits -= 1
        request.user.save()

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


class RetrieveIdeaView(APIView):  # 🚀 NUEVA VIEW
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
