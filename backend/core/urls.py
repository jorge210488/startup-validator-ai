from django.urls import path
from .views import SubmitIdeaView, UserIdeasView, RetrieveIdeaView, MeView, UserCreditTransactionsView, AdminRechargeCreditsView, AdminUserListView


urlpatterns = [
    path('submit-idea/', SubmitIdeaView.as_view(), name='submit_idea'),
    path('my-ideas/', UserIdeasView.as_view(), name='my_ideas'),
    path('ideas/<int:idea_id>/', RetrieveIdeaView.as_view(), name='retrieve_idea'),
    path('my-credit-transactions/', UserCreditTransactionsView.as_view(), name='my_credit_transactions'),
    path('admin-recargar-creditos/', AdminRechargeCreditsView.as_view(), name='admin_recharge_credits'),
    path('admin-users/', AdminUserListView.as_view(), name='admin_users'),  # <-- NUEVO
    path('me/', MeView.as_view(), name='me'),
]

