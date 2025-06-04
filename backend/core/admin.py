from django.contrib import admin
from .models import StartupIdea

@admin.register(StartupIdea)
class StartupIdeaAdmin(admin.ModelAdmin):
    list_display = ('user', 'original_text', 'created_at')
    readonly_fields = ('ai_response',)
