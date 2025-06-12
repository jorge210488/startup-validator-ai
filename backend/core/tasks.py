from celery import shared_task
from openai import OpenAI
from decouple import config
from .models import StartupIdea
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

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
    except Exception as e:
        result = f"Error al procesar la idea: {str(e)}"
        idea.ai_response = result
        idea.status = 'error'

    # 🟢 Intentar extraer el nombre sugerido
    nombre_sugerido = "Startup"
    try:
        for line in result.split('\n'):
            if "2." in line and "nombre" in line.lower():
                parts = line.split(":")
                if len(parts) > 1:
                    nombre_sugerido = parts[1].strip()
                else:
                    nombre_sugerido = "Startup"
                break
    except Exception as e:
        nombre_sugerido = "Startup"

    # 🟢 Generar logo
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
    except Exception as e:
        idea.logo_url = None

    # Guardar cambios en la idea
    idea.save()

    # 🟢 Enviar email al usuario
    User = get_user_model()
    user_email = idea.user.email  # asumiendo que StartupIdea tiene FK a User con campo user

    send_mail(
        subject='Tu análisis de Startup está listo 🚀',
        message=f'Hola! Tu análisis de la idea "{idea_text}" ya fue procesado. Puedes verlo en la plataforma.',
        from_email=None,  # usará DEFAULT_FROM_EMAIL
        recipient_list=[user_email],
        fail_silently=True,
    )

    # 🟢 Emitir WebSocket notification
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{idea.user.id}",
        {
            "type": "send_notification",
            "message": f"Tu idea '{idea_text}' ya fue procesada 🎉",
        }
    )

    return f"Idea {idea_id} analizada correctamente"
