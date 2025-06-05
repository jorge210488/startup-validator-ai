from rest_framework import serializers
from django.contrib.auth import get_user_model  
from .models import StartupIdea

User = get_user_model()

class StartupIdeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartupIdea
        fields = '__all__'
        read_only_fields = ['user', 'ai_response', 'created_at', 'logo_url']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'credits']
