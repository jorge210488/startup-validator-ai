from django.db import models
from django.contrib.auth.models import AbstractUser

# 🟣 Modelo personalizado de usuario (DEBE ir primero si usas AUTH_USER_MODEL)
class User(AbstractUser):
    credits = models.IntegerField(default=3)

# 🟢 Modelo de idea, que referencia al modelo de usuario ya definido arriba
class StartupIdea(models.Model):
    user = models.ForeignKey('core.User', on_delete=models.CASCADE, related_name='ideas')  # <-- referencia por string
    original_text = models.TextField()
    ai_response = models.TextField(blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
