from django.urls import path
from .views import SubmitIdeaView

urlpatterns = [
    path('submit-idea/', SubmitIdeaView.as_view(), name='submit_idea'),
]
