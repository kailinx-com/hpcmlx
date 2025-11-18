"""hpcmlx URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.static import serve
from django.conf import settings
from rest_framework.routers import DefaultRouter
from experiments.views import home, ExperimentViewSet, TagViewSet
from experiments.auth_views import current_user_view, logout_view, csrf_token_view

router = DefaultRouter()
router.register(r'experiments', ExperimentViewSet, basename='experiment')
router.register(r'tags', TagViewSet, basename='tag')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/auth/current-user/', current_user_view, name='auth-current-user'),
    path('api/auth/csrf-token/', csrf_token_view, name='auth-csrf-token'),
    path('api/auth/logout/', logout_view, name='auth-logout'),
    
    # Serve static files (for admin and DRF)
    re_path(r'^static/(?P<path>.*)$', serve, {
        'document_root': settings.STATIC_ROOT,
    }),
    
    # Vue frontend assets
    re_path(r'^assets/(?P<path>.*)$', serve, {
        'document_root': str(settings.BASE_DIR.parent / 'frontend' / 'dist' / 'assets'),
    }),
    path('', home, name="home"),

    path('api/', include(router.urls)),

    re_path(r'^(?!api|admin|assets|static).*', home),
]
