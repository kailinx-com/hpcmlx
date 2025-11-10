from django.http import HttpResponse
from django.conf import settings
from pathlib import Path
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from .models import Experiment, Tag
from .serializers import ExperimentSerializer, TagSerializer

def get_frontend_dir(file: str) -> Path:
    return Path(settings.BASE_DIR).parent / 'frontend' / file

def home(request):
    index_path = get_frontend_dir('dist/index.html')

    # for development, serve the index.html file
    if not index_path.exists():
        index_path = get_frontend_dir('index.html')
    
    with open(index_path, 'r', encoding='utf-8') as f:
        return HttpResponse(f.read(), content_type='text/html')

class ExperimentViewSet(viewsets.ModelViewSet):
    queryset = Experiment.objects.all()
    serializer_class = ExperimentSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title', 'description']
    
    """Check if user is authenticated"""
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        tag_param = self.request.query_params.get('tag', None)
        if tag_param:
            tag_names = [name.strip() for name in tag_param.split(',') if name.strip()]
            if tag_names:
                for tag_name in tag_names:
                    queryset = queryset.filter(tags__name__icontains=tag_name)
        return queryset.distinct()
    
    def create(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            from rest_framework.response import Response
            from rest_framework import status
            return Response(
                {'error': 'Only superusers can create experiments'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            from rest_framework.response import Response
            from rest_framework import status
            return Response(
                {'error': 'Only superusers can update experiments'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            from rest_framework.response import Response
            from rest_framework import status
            return Response(
                {'error': 'Only superusers can update experiments'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            from rest_framework.response import Response
            from rest_framework import status
            return Response(
                {'error': 'Only superusers can delete experiments'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            from rest_framework.response import Response
            from rest_framework import status
            return Response(
                {'error': 'Only superusers can create tags'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            from rest_framework.response import Response
            from rest_framework import status
            return Response(
                {'error': 'Only superusers can update tags'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            from rest_framework.response import Response
            from rest_framework import status
            return Response(
                {'error': 'Only superusers can delete tags'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)