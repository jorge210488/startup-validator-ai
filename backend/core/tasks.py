from celery import shared_task
from openai import OpenAI
from decouple import config
from .models import StartupIdea

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

    # 🟢 Intentar extraer el nombre sugerido (corregido)
    nombre_sugerido = "Startup"
    try:
        for line in result.split('\n'):
            if "2." in line and "nombre" in line.lower():
                # Intentar extraer después de ":"
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

    idea.save()

    return f"Idea {idea_id} analizada correctamente"
