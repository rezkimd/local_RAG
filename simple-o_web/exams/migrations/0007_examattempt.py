# Generated by Django 5.2.1 on 2025-06-15 20:28

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("exams", "0006_studentanswer_evaluation_text"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ExamAttempt",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "start_time",
                    models.DateTimeField(verbose_name="Waktu Mulai Pengerjaan"),
                ),
                (
                    "end_time",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="Waktu Selesai Pengerjaan"
                    ),
                ),
                (
                    "is_completed",
                    models.BooleanField(default=False, verbose_name="Sudah Selesai"),
                ),
                (
                    "last_question_index",
                    models.PositiveSmallIntegerField(
                        default=0, verbose_name="Indeks Soal Terakhir"
                    ),
                ),
                (
                    "exam",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="attempts",
                        to="exams.exam",
                        verbose_name="Ujian",
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="exam_attempts",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Siswa",
                    ),
                ),
            ],
            options={
                "verbose_name": "Upaya Ujian",
                "verbose_name_plural": "Upaya Ujian",
                "ordering": ["-start_time"],
                "unique_together": {("student", "exam")},
            },
        ),
    ]
