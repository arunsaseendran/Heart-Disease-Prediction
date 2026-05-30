"""
Custom DRF permission classes for HeartCare.

IsAdminRole: grants access to users with role == 'admin' OR is_staff == True.
             This is needed because Django's built-in IsAdminUser only checks
             is_staff, but this project uses a custom 'role' field.
"""

from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """
    Allow access only to users with role='admin' OR is_staff=True.
    """
    message = "Only administrators can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (getattr(request.user, "role", None) == "admin" or request.user.is_staff)
        )


class IsAdminOrDoctor(BasePermission):
    """
    Allow access to users with role='admin', role='doctor', or is_staff=True.
    """
    message = "Only doctors or administrators can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                getattr(request.user, "role", None) in ("admin", "doctor")
                or request.user.is_staff
            )
        )
