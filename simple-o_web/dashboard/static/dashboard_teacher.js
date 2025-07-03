// simple_o_web/dashboard/static/dashboard_teacher.js

document.addEventListener('DOMContentLoaded', () => {
    let profileLink = document.getElementById("profile-link");
    let classesLink = document.getElementById("classes-link");
    let manageExamsLink = document.getElementById("manage-exams-link");

    let profileContent = document.getElementById("profile-content");
    let classesContent = document.getElementById("classes-content");
    let manageExamsTeacherArea = document.getElementById("manage-exams-teacher-area");

    let contentTitle = document.getElementById("content-title");
    let addExamButton = document.getElementById("add-exam-button");

    // Fungsi untuk menyembunyikan semua konten dan mengaktifkan link yang dipilih
    function showContent(contentToShow, linkToActivate, title) {
        // Definisikan SEMUA KONTENER KONTEN UTAMA yang ada di dashboard GURU
        const allContentContainers = [
            profileContent,
            classesContent,
            manageExamsTeacherArea
        ];

        // Sembunyikan semua kontainer
        allContentContainers.forEach(el => {
            if (el) { // Cek jika elemen ditemukan (tidak null)
                el.classList.add('hidden');
            }
        });

        // Hapus 'active' dari semua link sidebar di dashboard GURU
        const allSidebarLinks = [
            profileLink,
            classesLink,
            manageExamsLink
        ];
        allSidebarLinks.forEach(el => {
            if (el) { // Cek jika elemen ditemukan
                el.classList.remove('active');
            }
        });

        // Tampilkan konten yang dipilih dan aktifkan link yang sesuai
        if (contentToShow) contentToShow.classList.remove('hidden');
        if (linkToActivate) linkToActivate.classList.add('active');
        if (title) contentTitle.textContent = title;
    }

    // Event Listeners untuk Sidebar Navigation (hanya untuk elemen yang ada di template guru)
    if (profileLink) {
        profileLink.addEventListener("click", (e) => {
            e.preventDefault();
            const userRoleText = profileLink.textContent.trim().replace('Profil ', '');
            showContent(profileContent, profileLink, `Profil ${userRoleText}`);
        });
    }

    if (classesLink) {
        classesLink.addEventListener("click", (e) => {
            e.preventDefault();
            showContent(classesContent, classesLink, "Daftar Kelas");
        });
    }

    if (manageExamsLink) {
        manageExamsLink.addEventListener("click", (e) => {
            e.preventDefault();
            showContent(manageExamsTeacherArea, manageExamsLink, "Kelola Ujian");
        });
    }

    // Tombol "Tambahkan Ujian Baru" (onclick di HTML)
    if (addExamButton) {
        addExamButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Ini akan di-override oleh onclick di HTML jika ada
            // window.location.href='{% url "exams:add_exam" %}?step=1'; 
            console.log("Tambahkan Ujian Baru diklik!");
        });
    }

    // Event Delegation untuk tombol "Edit Ujian", "Hapus" (di Kelola Ujian)
    document.addEventListener('click', (e) => {
        // Tombol "Tambahkan Ujian Baru" sudah punya onclick di HTML
        // Tombol "Mulai Ujian" dan "Lihat Hasil" tidak ada di dashboard guru
        if (e.target.classList.contains('btn-hasil')) { // Untuk tombol "Edit Ujian"
            e.preventDefault();
            const examId = e.target.dataset.examId;
            if (examId) {
                // TODO: Redirect ke halaman edit ujian
                alert(`Edit Ujian ID: ${examId}`);
            }
        } else if (e.target.classList.contains('btn-danger')) { // Untuk tombol "Hapus"
            e.preventDefault();
            const examId = e.target.dataset.examId;
            if (confirm(`Anda yakin ingin menghapus ujian ID: ${examId}?`)) {
                // TODO: Kirim request POST untuk menghapus ujian
                alert(`Menghapus ujian ID: ${examId}`);
            }
        }
    });

    // Inisialisasi tampilan awal saat dashboard dimuat untuk GURU:
    // Cek link yang seharusnya aktif saat load
    const currentActiveLink = document.querySelector('.sidebar ul li a.active');
    if (currentActiveLink) {
        const linkId = currentActiveLink.id;
        switch(linkId) {
            case 'profile-link':
                if (profileLink) profileLink.click();
                break;
            case 'manage-exams-link':
                if (manageExamsLink) manageExamsLink.click();
                break;
            case 'classes-link':
                if (classesLink) classesLink.click();
                break;
            default:
                // Fallback jika active link tidak terdaftar di sini (atau null)
                if (profileLink) profileLink.click();
                else if (manageExamsLink) manageExamsLink.click();
                else if (classesLink) classesLink.click();
        }
    } else {
        // Jika tidak ada link aktif default, set salah satu sebagai default
        if (profileLink) profileLink.click();
        else if (manageExamsLink) manageExamsLink.click();
        else if (classesLink) classesLink.click();
    }
});