# dashboard/views.py
from django.shortcuts import render


def dashboard_home(request):
    # Ini adalah minimal yang dibutuhkan untuk view ini agar tidak error
    return render(request, "dashboard.html")  # Pastikan path template ini benar!
