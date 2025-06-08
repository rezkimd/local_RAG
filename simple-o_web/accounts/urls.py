# accounts/urls.py
from django.urls import path
from . import views # Mengimpor views dari accounts/views.py

app_name = 'accounts' # Ini adalah namespace untuk aplikasi accounts

urlpatterns = [
    # Contoh URL untuk akun (Anda bisa tambahkan atau sesuaikan nanti)
    # path('register/', views.register_user, name='register'),
    # path('profile/', views.user_profile, name='profile'),
    # path('settings/', views.account_settings, name='settings'),
]