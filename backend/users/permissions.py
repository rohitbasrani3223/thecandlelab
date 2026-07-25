from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    """
    Custom DRF permission ensuring request user is authenticated and has ADMIN role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (getattr(request.user, 'role', '') == 'ADMIN' or request.user.is_staff or request.user.is_superuser)
        )

class IsSellerRole(BasePermission):
    """
    Custom DRF permission ensuring request user is authenticated and has SELLER role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (getattr(request.user, 'role', '') in ['SELLER', 'ADMIN'] or request.user.is_staff)
        )
