from django.contrib import admin
from .models import StartupIdea, CreditTransaction

@admin.register(StartupIdea)
class StartupIdeaAdmin(admin.ModelAdmin):
    list_display = ('user', 'original_text', 'created_at')
    readonly_fields = ('ai_response',)

@admin.register(CreditTransaction)
class CreditTransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'reason', 'created_at')
    readonly_fields = ('created_at',)
