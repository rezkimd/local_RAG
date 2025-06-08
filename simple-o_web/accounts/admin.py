# simple_o_web/accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin  # Penting: Impor UserAdmin bawaan
from .models import User  # Impor model User kustom Anda


# Kita perlu membuat custom Admin untuk User agar field 'role' bisa dimanipulasi
# dan juga agar tidak merusak fungsionalitas UserAdmin bawaan Django.
class CustomUserAdmin(UserAdmin):
    # Tambahkan field 'role' ke fieldsets dan list_display
    fieldsets = UserAdmin.fieldsets + (
        ("Role", {"fields": ("role",)}),  # Menambahkan fieldset baru untuk Role
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Role",
            {"fields": ("role",)},
        ),  # Menambahkan fieldset untuk formulir tambah user
    )
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "role",
    )  # Tambahkan 'role'


# Daftarkan model User kustom Anda dengan CustomUserAdmin
admin.site.register(User, CustomUserAdmin)
