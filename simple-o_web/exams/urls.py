# exams/urls.py
from django.urls import path
from . import views # Mengimpor views dari exams/views.py

app_name = 'exams' # Ini adalah namespace untuk aplikasi exams

urlpatterns = [
    path('login/', views.login_view, name='login'),      # URL untuk halaman login
    path('start/', views.exam_view, name='start_exam'), # URL untuk halaman ujian esai
    # Anda bisa tambahkan URL lain yang terkait dengan ujian di sini,
    # misalnya path('submit/', views.submit_exam, name='submit_exam'),
    # path('results/<int:exam_id>/', views.exam_results, name='results'),
]