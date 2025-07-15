from rest_framework import serializers
from django.contrib.auth import get_user_model  
from .models import StartupIdea
from .models import CreditTransaction

User = get_user_model()

class StartupIdeaSerializer(serializers.ModelSerializer):
    logo_ready = serializers.SerializerMethodField()

    class Meta:
        model = StartupIdea
        fields = '__all__'
        read_only_fields = ['user', 'ai_response', 'created_at', 'logo_url', 'status']

    def get_logo_ready(self, obj):
        return bool(obj.logo_url)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'credits']

class CreditTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTransaction
        fields = ['amount', 'reason', 'created_at']
        
# serializers.py

class CheckoutSessionSerializer(serializers.Serializer):
    credits = serializers.ChoiceField(choices=[5, 10, 20, 50, 100])

class ConfirmSessionSerializer(serializers.Serializer):
    session_id = serializers.CharField()
