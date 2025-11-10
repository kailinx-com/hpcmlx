from django.contrib.auth import logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

"""
Checks if user is logged in via Django admin session
"""
@api_view(['GET'])
@permission_classes([AllowAny])
def current_user_view(request):
    if request.user.is_authenticated:
        return Response({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'is_superuser': request.user.is_superuser,
            }
        })
    else:
        return Response({
            'authenticated': False,
            'user': None
        })

"""
Logs out user via Django admin session
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'success': True})

