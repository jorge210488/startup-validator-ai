from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StartupIdea, CreditTransaction
from .serializers import StartupIdeaSerializer, UserSerializer, CreditTransactionSerializer, CheckoutSessionSerializer, ConfirmSessionSerializer
from .tasks import analyze_startup_idea
from .permissions import IsAdminUser
from django.contrib.auth import get_user_model
from rest_framework import status
from openai import OpenAI
from decouple import config
import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import json
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_framework_simplejwt.tokens import RefreshToken 


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
                'credits': user.credits,
                'is_active': user.is_active
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

stripe.api_key = settings.STRIPE_SECRET_KEY

# Endpoint 1 - Crear sesión de Stripe Checkout
class CreateStripePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        credits = serializer.validated_data["credits"]

        PRICE_MAP = {
            5: settings.STRIPE_PRICE_5,
            10: settings.STRIPE_PRICE_10,
            20: settings.STRIPE_PRICE_20,
            50: settings.STRIPE_PRICE_50,
            100: settings.STRIPE_PRICE_100,
        }

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="payment",
                line_items=[{
                    "price": PRICE_MAP[credits],
                    "quantity": 1,
                }],
                success_url=f"{settings.STRIPE_SUCCESS_URL}?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=settings.STRIPE_CANCEL_URL,
                metadata={
                    "user_id": request.user.id,
                    "credits": credits
                },
                customer_email=request.user.email,
            )

            return Response({
                "checkout_url": checkout_session.url
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class ConfirmPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ConfirmSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session_id = serializer.validated_data["session_id"]

        try:
            session = stripe.checkout.Session.retrieve(session_id)

            if session.payment_status != "paid":
                return Response({"error": "Pago no completado"}, status=400)

            # Obtener créditos de metadata
            credits = int(session.metadata.get("credits", 0))

            if credits not in [5, 10, 20, 50, 100]:
                return Response({"error": "Cantidad inválida de créditos"}, status=400)

            # Añadir créditos al usuario
            request.user.credits += credits
            request.user.save()

            # Registrar la transacción
            CreditTransaction.objects.create(
                user=request.user,
                amount=credits,
                reason="Compra de créditos vía Stripe Checkout"
            )

            return Response({"message": "Créditos añadidos correctamente."})

        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

@csrf_exempt
def stripe_webhook(request):
    print("🌐 Webhook recibido")
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        print("❌ Error de payload:", e)
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        print("❌ Error de firma:", e)
        return HttpResponse(status=400)

    print("✅ Evento verificado:", event["type"])

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Extraer metadatos de la sesión de Stripe
        credits = int(session.get('metadata', {}).get('credits', 0))
        user_id = session.get('metadata', {}).get('user_id')
        if not user_id or not credits:
            print("⚠️ Metadatos incompletos en la sesión:", session.get('metadata'))
            return HttpResponse(status=200)
        try:
            user = User.objects.get(id=user_id)
            user.credits += credits
            user.save()
            # Registrar transacción de crédito opcional
            CreditTransaction.objects.create(user=user, amount=credits,
                                            reason="Compra Stripe")
            print(f"🟢 Créditos (+{credits}) actualizados para usuario {user.email}")
        except User.DoesNotExist:
            print(f"❌ Usuario con ID {user_id} no encontrado")
        except Exception as e:
            print("🔥 Error al actualizar créditos:", e)


    return HttpResponse(status=200)

class AdminSuspendUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        user_id = request.data.get('user_id')
        reason = request.data.get('reason', '')

        if not user_id:
            return Response({'error': 'Falta el ID del usuario.'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=404)

        if not user.is_active:
            return Response({'message': 'El usuario ya está suspendido.'}, status=200)

        user.is_active = False
        user.save()

        # Podrías guardar el motivo de suspensión en un modelo aparte si deseas
        return Response({'message': f'El usuario {user.username} ha sido suspendido.'}, status=200)

class AdminEnableUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({'error': 'Falta el ID del usuario.'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=404)

        if user.is_active:
            return Response({'message': 'El usuario ya está habilitado.'}, status=200)

        user.is_active = True
        user.save()

        return Response({'message': f'El usuario {user.username} ha sido habilitado.'}, status=200)

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

    # Este método lo llama dj-rest-auth cuando el login social fue exitoso.
    # Sobrescribimos para retornar JWT {access, refresh}.
    def get_response(self):
        user = self.user  # ya autenticado por dj-rest-auth/allauth
        if not user or not user.is_authenticated:
            # fallback por si algo raro pasó
            return super().get_response()

        refresh = RefreshToken.for_user(user)
        data = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
        return Response(data, status=status.HTTP_200_OK)

    # (opcional) deja el print para debug mientras tanto
    def post(self, request, *args, **kwargs):
        print("[/dj-rest-auth/google] data:", request.data)
        return super().post(request, *args, **kwargs)