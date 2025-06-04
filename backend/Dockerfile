# backend/Dockerfile

FROM python:3.11-slim

# Evitar buffering en logs de Python
ENV PYTHONUNBUFFERED 1

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY . /app

# Instalar dependencias
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Comando por defecto (override con docker-compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
