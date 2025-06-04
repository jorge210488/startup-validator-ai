from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StartupIdea
from .serializers import StartupIdeaSerializer
from .tasks import analyze_startup_idea

class SubmitIdeaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        idea_text = request.data.get('original_text')
        idea = StartupIdea.objects.create(user=request.user, original_text=idea_text)  # ✔️ correcto}
        print("Llamando a Celery...")
        analyze_startup_idea.delay(idea.id, idea.original_text)
        return Response({'message': 'Idea enviada. La IA está analizándola.'})

