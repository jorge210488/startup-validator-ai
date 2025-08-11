# tasks.py
import logging
from celery import shared_task
from openai import OpenAI
from decouple import config
from .models import StartupIdea
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings

logger = logging.getLogger(__name__)

client = OpenAI(api_key=config('OPENAI_API_KEY'))

@shared_task
def analyze_startup_idea(idea_id, idea_text):
    prompt = f"""
    Tengo una idea de startup: {idea_text}
    1. Devuelve una descripción mejorada.
    2. Sugiere un nombre atractivo.
    3. Sugiere un público objetivo.
    4. Sugiere tecnologías clave.
    5. Haz un análisis FODA (SWOT).
    """

    idea = StartupIdea.objects.get(id=idea_id)

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        result = response.choices[0].message.content
        idea.ai_response = result
        idea.status = 'completed'
        logger.info("✅ OpenAI response saved for idea_id=%s", idea_id)
    except Exception as e:
        result = f"Error al procesar la idea: {str(e)}"
        idea.ai_response = result
        idea.status = 'error'
        logger.exception("❌ OpenAI error for idea_id=%s", idea_id)

    # Extract suggested name (best-effort)
    nombre_sugerido = "Startup"
    try:
        for line in result.split('\n'):
            if "2." in line and "nombre" in line.lower():
                parts = line.split(":")
                nombre_sugerido = parts[1].strip() if len(parts) > 1 else "Startup"
                break
    except Exception:
        logger.warning("⚠️ Could not extract suggested name for idea_id=%s", idea_id)

    # Generate logo (best-effort)
    try:
        logo_prompt = f"""
        Logo minimalista y profesional para la marca "{nombre_sugerido}".
        Características:
        - Estilo flat o vectorial
        - Sin texto en la imagen (solo símbolo gráfico)
        - Fondo blanco
        - Colores elegantes
        """
        image_response = client.images.generate(
            prompt=logo_prompt,
            n=1,
            size="512x512"
        )
        logo_url = image_response.data[0].url
        idea.logo_url = logo_url
        logger.info("🖼️ Logo generated for idea_id=%s", idea_id)
    except Exception:
        idea.logo_url = None
        logger.exception("❌ Logo generation failed for idea_id=%s", idea_id)

    idea.save()

    # Send email (CON LOGGING)
    try:
        user_email = idea.user.email
        send_mail(
            subject='Tu análisis de Startup está listo 🚀',
            message=f'Hola! Tu análisis de la idea "{idea_text}" ya fue procesado. Puedes verlo en la plataforma.',
            from_email=settings.DEFAULT_FROM_EMAIL,  # usa el remitente correcto
            recipient_list=[user_email],
            fail_silently=False,  # importante para ver errores en logs
        )
        logger.info("📧 Email sent to %s for idea_id=%s", user_email, idea_id)
    except Exception:
        logger.exception("❌ Email sending failed for idea_id=%s", idea_id)

    # WebSocket notification
    try:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{idea.user.id}",
            {"type": "send_notification", "message": f"Tu idea '{idea_text}' ya fue procesada 🎉"}
        )
        logger.info("🔔 WebSocket notification sent for idea_id=%s", idea_id)
    except Exception:
        logger.exception("❌ WebSocket notification failed for idea_id=%s", idea_id)

    return f"Idea {idea_id} analizada correctamente"
