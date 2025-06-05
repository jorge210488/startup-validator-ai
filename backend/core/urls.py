from django.urls import path
from .views import SubmitIdeaView, UserIdeasView, MeView

urlpatterns = [
    path('submit-idea/', SubmitIdeaView.as_view(), name='submit_idea'),
    path('my-ideas/', UserIdeasView.as_view(), name='my_ideas'),
    path('me/', MeView.as_view(), name='me'),

]
