// simple_o_web/dashboard/static/dashboard/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // JavaScript sederhana untuk simulasi ganti konten (tanpa refresh halaman)
    const profileLink = document.getElementById("profile-link");
    const examsLink = document.getElementById("exams-link");
    const profileContent = document.getElementById("profile-content");
    const examsContent = document.getElementById("exams-content");
    const contentTitle = document.getElementById("content-title");

    profileLink.addEventListener("click", (e) => {
        e.preventDefault();
        profileContent.classList.remove("hidden");
        examsContent.classList.add("hidden");
        profileLink.classList.add("active");
        examsLink.classList.remove("active");
        contentTitle.textContent = "Profil Siswa";
    });

    examsLink.addEventListener("click", (e) => {
        e.preventDefault();
        examsContent.classList.remove("hidden");
        profileContent.classList.add("hidden");
        examsLink.classList.add("active");
        profileLink.classList.remove("active");
        contentTitle.textContent = "Daftar Exam";
    });

    // Tambahan: Tambahkan event listener untuk tombol "Mulai Ujian"
    // Ini akan mengarahkan ke halaman ujian
    document.querySelectorAll('.btn-mulai').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Arahkan ke URL halaman ujian yang sudah kita definisikan
            // Misalnya: http://127.0.0.1:8000/exams/start/
            // Gunakan path URL absolut di sini untuk memastikan pengalihan yang benar
            window.location.href = '/exams/start/';
        });
    });
});