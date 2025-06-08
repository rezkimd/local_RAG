# simple_o_web/exams/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone

# Model Ujian
class Exam(models.Model):
    title = models.CharField(max_length=200, verbose_name="Judul Ujian", default="Ujian Baru") # Tambahkan default
    description = models.TextField(blank=True, verbose_name="Deskripsi", default="") # Default string kosong
    subject = models.CharField(max_length=100, verbose_name="Mata Pelajaran", default="Umum") # Tambahkan default
    duration_minutes = models.IntegerField(verbose_name="Durasi (menit)", default=60) # **TAMBAHKAN DEFAULT INI**
    start_time = models.DateTimeField(default=timezone.now, verbose_name="Waktu Mulai") # Sudah ada default
    # end_time: Ini adalah field yang tidak bisa punya default otomatis yang universal (misalnya, harus 1 jam setelah start_time)
    # Jika end_time tidak diisi saat membuat objek, ia akan error jika tidak ada null=True
    # Untuk tujuan ini, kita biarkan tidak ada default otomatis, atau Anda bisa membuatnya nullable jika tidak selalu ada
    end_time = models.DateTimeField(verbose_name="Waktu Berakhir", null=True) # Biarkan seperti ini atau tambahkan null=True

    is_active = models.BooleanField(default=True, verbose_name="Aktif") # Sudah ada default
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='created_exams',
        null=True, blank=True, # Sudah bisa null
        verbose_name="Pembuat Ujian"
    )

    def __str__(self):
        return f"{self.title} ({self.subject})"

    class Meta:
        verbose_name = "Ujian"
        verbose_name_plural = "Ujian"
        ordering = ['start_time', 'title']


# Model Soal Esai
class EssayQuestion(models.Model):
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name='essay_questions',
        verbose_name="Ujian Terkait"
    )
    question_number = models.PositiveSmallIntegerField(verbose_name="Nomor Soal", default=1) # Tambahkan default
    question_text = models.TextField(verbose_name="Teks Soal", default="Jelaskan...") # Tambahkan default
    max_points = models.PositiveSmallIntegerField(default=10, verbose_name="Poin Maksimal") # Sudah ada default

    def __str__(self):
        return f"Soal {self.question_number} - {self.exam.title[:30]}..."

    class Meta:
        verbose_name = "Soal Esai"
        verbose_name_plural = "Soal Esai"
        unique_together = ('exam', 'question_number')
        ordering = ['exam', 'question_number']


# Model Jawaban Siswa
class StudentAnswer(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_answers',
        verbose_name="Siswa"
    )
    question = models.ForeignKey(
        EssayQuestion,
        on_delete=models.CASCADE,
        related_name='answers',
        verbose_name="Soal"
    )
    answer_text = models.TextField(verbose_name="Teks Jawaban", default="") # Tambahkan default string kosong
    submitted_at = models.DateTimeField(auto_now_add=True, verbose_name="Waktu Dijawab") # Sudah ada default (auto_now_add)
    score = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="Nilai", default=0.00 # Tambahkan default atau biarkan null
    )
    is_graded = models.BooleanField(default=False, verbose_name="Sudah Dinilai") # Sudah ada default

    def __str__(self):
        return f"Jawaban {self.student.username} untuk Soal {self.question.question_number} ({self.question.exam.title})"

    class Meta:
        verbose_name = "Jawaban Siswa"
        verbose_name_plural = "Jawaban Siswa"
        unique_together = ('student', 'question')
        ordering = ['-submitted_at']