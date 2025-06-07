from celery import shared_task
from openai import OpenAI
from decouple import config
from .models import StartupIdea

# Crea el cliente de OpenAI con la API key
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

    idea = StartupIdea.objects.get(id=idea_id)  # Mover esto arriba

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

    idea.save()

    return f"Idea {idea_id} analizada correctamente"
