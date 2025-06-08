# dashboard/urls.py
from django.urls import path
from . import views # Mengimpor views dari dashboard/views.py

app_name = 'dashboard' # Ini adalah namespace untuk aplikasi dashboard

urlpatterns = [
    path('', views.dashboard_home, name='home'), # URL untuk halaman utama dashboard
    # Anda bisa tambahkan URL lain yang spesifik untuk dashboard di sini
]