from django.urls import path
from .views import (
    RegisterView, LoginView, ProfileView, ChangePasswordView,
    AdminUserListView, AdminUserDetailView, AdminToggleUserView,
    DashboardStatsView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    # Admin
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("admin/users/<int:pk>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("admin/users/<int:pk>/toggle/", AdminToggleUserView.as_view(), name="admin-toggle-user"),
    path("admin/dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
]
