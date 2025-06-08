# exams/views.py
from django.shortcuts import render


# simple_o_web/exams/views.py

from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import authenticate, login # Impor ini
from django.http import JsonResponse # Opsional, untuk respons AJAX

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username') # Atau 'email' jika Anda ingin login pakai email
        password = request.POST.get('password')

        # Melakukan otentikasi pengguna
        # authenticate() akan memeriksa kredensial terhadap AUTH_USER_MODEL Anda
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Jika otentikasi berhasil, login pengguna
            login(request, user)
            
            # --- Logika Redirect berdasarkan role (opsional tapi bagus) ---
            if user.role == 'admin':
                # Redirect admin ke halaman admin Django
                return JsonResponse({'success': True, 'redirect_url': reverse('admin:index')})
            elif user.role == 'teacher':
                # Redirect guru ke dashboard atau halaman khusus guru
                return JsonResponse({'success': True, 'redirect_url': reverse('dashboard:home')})
            elif user.role == 'student':
                # Redirect siswa ke dashboard atau halaman khusus siswa
                return JsonResponse({'success': True, 'redirect_url': reverse('dashboard:home')})
            else:
                # Default redirect jika role tidak dikenali atau belum ada
                return JsonResponse({'success': True, 'redirect_url': reverse('dashboard:home')})
        else:
            # Jika otentikasi gagal
            # Untuk AJAX, kirim respons JSON error
            return JsonResponse({'success': False, 'message': 'Username atau kata sandi salah.'}, status=401)
            # Jika tidak menggunakan AJAX, bisa render ulang form dengan pesan error:
            # return render(request, 'login.html', {'error_message': 'Username atau kata sandi salah.'})
    
    # Render halaman login untuk GET request
    return render(request, 'login.html')


def exam_view(request):
    return render(request, "exams.html")
