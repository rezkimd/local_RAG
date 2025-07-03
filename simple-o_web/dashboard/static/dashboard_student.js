// simple_o_web/dashboard/static/dashboard_student.js

document.addEventListener('DOMContentLoaded', () => {
    let profileLink = document.getElementById("profile-link");
    // let classesLink = document.getElementById("classes-link"); // Hapus ini
    // let manageExamsLink = document.getElementById("manage-exams-link"); // Hapus ini
    let availableExamsLink = document.getElementById("available-exams-link");

    let profileContent = document.getElementById("profile-content");
    // let classesContent = document.getElementById("classes-content"); // Hapus ini
    // let manageExamsContent = document.getElementById("manage-exams-content"); // Hapus ini
    let availableExamsContent = document.getElementById("available-exams-content");

    let contentTitle = document.getElementById("content-title");
    // let addExamButton = document.getElementById("add-exam-button"); // Hapus ini

    function showContent(contentToShow, linkToActivate, title) {
        [profileContent, availableExamsContent].forEach(el => { // Sesuaikan daftar elemen
            if (el) el.classList.add('hidden');
        });
        [profileLink, availableExamsLink].forEach(el => { // Sesuaikan daftar elemen
            if (el) el.classList.remove('active');
        });
        if (contentToShow) contentToShow.classList.remove('hidden');
        if (linkToActivate) linkToActivate.classList.add('active');
        if (title) contentTitle.textContent = title;
    }

    if (profileLink) {
        profileLink.addEventListener("click", (e) => {
            e.preventDefault();
            const userRoleText = profileLink.textContent.trim().replace('Profil ', '');
            showContent(profileContent, profileLink, `Profil ${userRoleText}`);
        });
    }

    // if (classesLink) { ... } // Hapus ini
    // if (manageExamsLink) { ... } // Hapus ini

    if (availableExamsLink) {
        availableExamsLink.addEventListener("click", (e) => {
            e.preventDefault();
            showContent(availableExamsContent, availableExamsLink, "Daftar Ujian");
        });
    }

    // if (addExamButton) { ... } // Hapus ini

    // Event Delegation untuk tombol "Mulai Ujian" dan "Lihat Hasil"
    document.addEventListener('click', (e) => {
        // Logika untuk btn-mulai dan btn-hasil akan tetap sama di sini
        if (e.target.classList.contains('btn-mulai') && !e.target.disabled) { // Tidak perlu check id 'add-exam-button'
            e.preventDefault();
            const examId = e.target.dataset.examId;
            if (examId) {
                window.location.href = `/exams/start/?exam_id=${examId}`;
            }
        } else if (e.target.classList.contains('btn-hasil')) {
            e.preventDefault();
            const examId = e.target.dataset.examId;
            if (examId) {
                window.location.href = `/exams/results/${examId}/`;
            }
        }
        // Tombol btn-danger tidak ada di tampilan siswa, jadi tidak perlu else if untuk itu
    });

    // Inisialisasi tampilan awal saat dashboard dimuat untuk siswa
    if (profileLink && profileLink.classList.contains('active')) {
        profileLink.click();
    } else if (availableExamsLink && availableExamsLink.classList.contains('active')) {
        availableExamsLink.click();
    } else if (profileLink) { // Fallback
        profileLink.click();
    } else if (availableExamsLink) { // Fallback
        availableExamsLink.click();
    }
});