# Backend Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip && \
    pip install psycopg2-binary && \
    pip install "Django>=4.2,<4.3" && \
    pip install "djangorestframework>=3.14.0" && \
    pip install gunicorn

COPY . .

RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "hpcmlx.wsgi:application"]

