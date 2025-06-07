from django.urls import path
from .views import SubmitIdeaView, UserIdeasView, RetrieveIdeaView, MeView  # <-- Agregamos RetrieveIdeaView

urlpatterns = [
    path('submit-idea/', SubmitIdeaView.as_view(), name='submit_idea'),
    path('my-ideas/', UserIdeasView.as_view(), name='my_ideas'),
    path('ideas/<int:idea_id>/', RetrieveIdeaView.as_view(), name='retrieve_idea'),  # <-- Nueva URL
    path('me/', MeView.as_view(), name='me'),
]
