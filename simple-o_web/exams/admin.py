# simple_o_web/exams/admin.py

from django.contrib import admin
from .models import Exam, EssayQuestion, StudentAnswer # Impor model Anda

# Daftarkan model Anda di sini
admin.site.register(Exam)
admin.site.register(EssayQuestion)
admin.site.register(StudentAnswer)