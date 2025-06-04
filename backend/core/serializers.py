from rest_framework import serializers
from .models import StartupIdea

class StartupIdeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartupIdea
        fields = '__all__'
        read_only_fields = ['ai_response', 'created_at', 'user']
