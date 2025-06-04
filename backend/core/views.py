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

        if not idea_text:
            return Response({'error': 'Falta el texto de la idea.'}, status=400)

        idea = StartupIdea.objects.create(user=request.user, original_text=idea_text)
        
        print("Llamando a Celery...")
        analyze_startup_idea.delay(idea.id, idea.original_text)

        serializer = StartupIdeaSerializer(idea)
        return Response({
            'message': 'Idea enviada. La IA está analizándola.',
            'idea': serializer.data
        }, status=201)
