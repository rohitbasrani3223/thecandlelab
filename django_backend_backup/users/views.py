from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def jwt_login(request):
    """Django REST JWT Login View returning token & user role"""
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)

    # Try authentication by username or email
    user = User.objects.filter(email=email).first()
    if not user:
        user = User.objects.filter(username=email).first()

    if user and user.check_password(password):
        return Response({
            "access": f"jwt_access_token_for_{user.id}",
            "refresh": f"jwt_refresh_token_for_{user.id}",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "role": user.role, # 'ADMIN', 'SELLER', 'CUSTOMER'
                "wallet_balance": float(user.wallet_balance)
            }
        }, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
