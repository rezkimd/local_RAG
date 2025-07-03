# simple_o_web/exams/forms.py
import os
from django import forms
from .models import Exam, EssayQuestion
from django.utils import timezone # Untuk validasi waktu
from django.core.exceptions import ValidationError # Untuk validasi custom
from django.forms import DateTimeInput


class ExamDetailForm(forms.ModelForm):
    class Meta:
        model = Exam
        # Semua field wajib (karena tidak ada blank=True/null=True di model) kecuali description, reference_document, creator
        fields = [
            "title",
            "description",
            "subject",
            "duration_minutes",
            "start_time",
            "end_time",
            "is_active",
            "reference_document",
            'total_essay_questions',
        ]
        widgets = {
            "start_time": forms.DateTimeInput(
                attrs={"type": "datetime-local"}, format="%Y-%m-%dT%H:%M"
            ),
            "end_time": forms.DateTimeInput(
                attrs={"type": "datetime-local"}, format="%Y-%m-%dT%H:%M"
            ),
            "description": forms.Textarea(attrs={"rows": 4}),
            # Tambahkan widget untuk FileField jika diperlukan, meskipun defaultnya sudah input type="file"
        }
        labels = {
            "title": "Judul Ujian",
            "description": "Deskripsi",
            "subject": "Mata Pelajaran",
            "duration_minutes": "Durasi (menit)",
            "start_time": "Waktu Mulai",
            "end_time": "Waktu Berakhir",
            "is_active": "Aktifkan Ujian",
            "reference_document": "Dokumen Referensi (Opsional)",
            'total_essay_questions': 'Jumlah Soal Esai',
        }

    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")
        duration_minutes = cleaned_data.get("duration_minutes")
        total_essay_questions = cleaned_data.get('total_essay_questions')
        
        # Validasi: total_essay_questions harus positif
        if total_essay_questions is not None and total_essay_questions <= 0:
            raise ValidationError("Jumlah soal esai harus lebih dari 0.")

        # Validasi waktu berakhir setelah waktu mulai
        if start_time and end_time and start_time >= end_time:
            self.add_error("end_time", "Waktu berakhir harus setelah waktu mulai.")

        # --- Logika penyesuaian end_time berdasarkan durasi (sesuai permintaan) ---
        # Ini akan dilakukan di sini agar form bisa menampilkan error jika user input salah
        # dan juga bisa di view untuk logika otomatis
        if start_time and end_time and duration_minutes:
            # Hitung durasi sebenarnya dari start_time ke end_time
            actual_window_duration_minutes = (
                end_time - start_time
            ).total_seconds() / 60

            # Jika jendela waktu ujian lebih kecil dari durasi yang diinginkan guru
            if actual_window_duration_minutes < duration_minutes:
                # Sesuaikan end_time menjadi start_time + duration_minutes
                new_end_time = start_time + timezone.timedelta(minutes=duration_minutes)
                # Ini akan menimpa nilai end_time yang diinput jika tidak sesuai
                cleaned_data["end_time"] = new_end_time
                # Anda bisa menambahkan pesan warning/info ke user
                # self.add_error(None, "Waktu berakhir telah disesuaikan agar sesuai dengan durasi ujian.") # Error global

        return cleaned_data


# --- PENAMBAHAN FORM UNTUK SOAL ESAI (TAHAP 2) ---
class EssayQuestionForm(forms.ModelForm):
    class Meta:
        model = EssayQuestion
        # Fields: question_number, question_text, max_points
        fields = ["question_number", "question_text",'answer_text', "max_points", 'is_locked']
        widgets = {
            'question_text': forms.Textarea(attrs={'rows': 8}),
            'answer_text': forms.Textarea(attrs={'rows': 5}),
            # Pastikan is_locked juga HiddenInput()
            'is_locked': forms.HiddenInput(), # <<< TAMBAH WIDGET INI
            'question_number': forms.TextInput(attrs={'readonly': 'readonly'}), # <<< JADIKAN READONLY
        }
        labels = {
            "question_number": "Nomor Soal",
            "question_text": "Teks Soal",
            "answer_text": "Kunci Jawaban Esai",
            "max_points": "Poin Maksimal",
        }
    # Override __init__ untuk menyembunyikan field 'DELETE' bawaan formset
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Menyembunyikan field 'DELETE' dari formset jika ada
        if 'DELETE' in self.fields:
            self.fields['DELETE'].widget = forms.HiddenInput()
            self.fields['DELETE'].required = False # Tidak wajib diisi
        if 'is_locked' in self.fields:
            self.fields['is_locked'].widget = forms.HiddenInput()
        
# --- PENAMBAHAN FORM UNTUK REFERENSI (TAHAP 3) ---
# Ini adalah form terpisah untuk upload file di Tahap 3
class ExamReferenceForm(forms.ModelForm):
    class Meta:
        model = Exam
        fields = ['reference_document']
        labels = {
            'reference_document': 'Dokumen Referensi Ujian (File Word)',
        }

    # Validasi tipe file
    def clean_reference_document(self):
        doc = self.cleaned_data.get('reference_document')
        if doc:
            # Validasi ekstensi file
            ext = os.path.splitext(doc.name)[1]  # [0] is base name, [1] is extension
            valid_extensions = ['.doc', '.docx']
            if not ext.lower() in valid_extensions:
                raise ValidationError('Hanya file Word (.doc, .docx) yang diizinkan.')

            # Validasi ukuran file (misal maksimal 5 MB)
            # if doc.size > 5 * 1024 * 1024:
            #     raise ValidationError('Ukuran dokumen tidak boleh lebih dari 5 MB.')
        return doc
