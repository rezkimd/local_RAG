# simple_o_web/accounts/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Siswa'),
        ('teacher', 'Guru'),
        ('admin', 'Admin Sistem'),
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='student',
        verbose_name="Peran"
    )

    # Override method save untuk mengatur is_staff berdasarkan role
    def save(self, *args, **kwargs):
        # Jika role adalah 'admin', set is_staff menjadi True
        if self.role == 'admin':
            self.is_staff = True
        # Jika role bukan 'admin' (siswa atau guru), set is_staff menjadi False
        else:
            self.is_staff = False

        # Panggil method save asli dari AbstractUser
        super().save(*args, **kwargs)
        
        