# simpleosite/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView # Tambahkan import ini

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('exams/', include('exams.urls')),

    # --- TAMBAHKAN BARIS INI UNTUK HOMEPAGE ---
    # Ini akan mengarahkan permintaan root URL ('/') ke halaman login Anda
    path('', RedirectView.as_view(url='/exams/login/', permanent=False), name='homepage'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)