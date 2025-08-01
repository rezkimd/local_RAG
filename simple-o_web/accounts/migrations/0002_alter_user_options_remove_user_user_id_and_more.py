# Generated by Django 5.2.1 on 2025-06-05 00:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="user",
            options={
                "ordering": ["username"],
                "verbose_name": "Pengguna",
                "verbose_name_plural": "Pengguna",
            },
        ),
        migrations.RemoveField(
            model_name="user",
            name="user_id",
        ),
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("student", "Siswa"),
                    ("teacher", "Guru"),
                    ("admin", "Admin Sistem"),
                ],
                default="student",
                max_length=10,
                verbose_name="Peran",
            ),
        ),
    ]
