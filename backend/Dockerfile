# Optimized Backend Dockerfile for minimal resource usage
# Multi-stage build to reduce final image size
FROM python:3.12-alpine AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install build dependencies only
RUN apk add --no-cache --virtual .build-deps \
    gcc \
    musl-dev \
    postgresql-dev \
    && pip install --upgrade pip

# Install Python dependencies
COPY . .
RUN pip install --no-cache-dir \
    psycopg2-binary \
    "Django>=4.2,<4.3" \
    "djangorestframework>=3.14.0" \
    gunicorn

# Production stage - minimal runtime image
FROM python:3.12-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# Install only runtime dependencies (minimal)
RUN apk add --no-cache \
    libpq \
    && rm -rf /var/cache/apk/*

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Remove unnecessary files to reduce image size
RUN find /usr/local/lib/python3.12/site-packages -type d -name "__pycache__" -exec rm -r {} + 2>/dev/null || true && \
    find /usr/local/lib/python3.12/site-packages -name "*.pyc" -delete && \
    find /usr/local/lib/python3.12/site-packages -name "*.pyo" -delete

EXPOSE 8000

# Optimized Gunicorn: 1 worker, 2 threads for 1 CPU
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "1", "--threads", "2", "--timeout", "120", "--max-requests", "1000", "--max-requests-jitter", "50", "--preload", "hpcmlx.wsgi:application"]

