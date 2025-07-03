// simple_o_web/exams/static/create_exam_wizard.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("create_exam_wizard.js loaded.");

    // --- Elemen Umum Wizard ---
    const currentStepInput = document.querySelector('input[name="current_step_input"]');
    const formContainer = document.querySelector('.form-container'); // Container utama form wizard
    const globalErrorList = document.querySelector('.global-errorlist'); // Untuk menampilkan error global
    const buttonGroup = document.querySelector('.button-group');

    // --- Tombol Navigasi Umum ---
    const cancelButton = document.querySelector('button[name="cancel_button"]');
    const previousButton = document.querySelector('button[name="previous_button"]');
    const nextButton = document.querySelector('button[name="next_button"]'); // Tombol 'Selanjutnya' atau 'Finish'
    const finishButton = document.querySelector('button[name="finish_button"]'); // Hanya tombol 'Selesai Ujian'

    // Dapatkan nomor tahap saat ini
    const currentStep = parseInt(currentStepInput ? currentStepInput.value : 1);

    // --- Logika Khusus Per Tahap ---

    // === Tahap 1: Detail Ujian ===
    if (currentStep === 1) {
        console.log("Rendering Step 1 JS logic.");
        // Anda bisa menambahkan logika JS spesifik untuk Tahap 1 di sini.
        // Misalnya, validasi frontend real-time (optional, karena backend sudah validasi)
    }

    // === Tahap 2: Menambahkan Soal Ujian ===
    else if (currentStep === 2) {
        console.log("Rendering Step 2 JS logic.");

        const questionNavList = document.getElementById('question-nav-list');
        const questionsContainer = document.getElementById('questions-container');
        const totalFormsInput = document.querySelector('input[name="questions-TOTAL_FORMS"]');
        
        let currentActiveQuestionIndex = 0; // Mengikuti soal yang sedang aktif

        // --- Fungsi untuk update navigasi soal di sidebar ---
        function updateQuestionNav() {
            questionNavList.innerHTML = ''; // Bersihkan daftar yang lama
            const forms = questionsContainer.querySelectorAll('.question-form-item');
            
            forms.forEach((formDiv, i) => {
                // Pastikan formDiv belum ditandai DELETE
                const deleteInput = formDiv.querySelector(`input[name="questions-${i}-DELETE"]`);
                if (deleteInput && deleteInput.value === 'true') {
                    return; // Lewati form yang dihapus
                }

                const li = document.createElement('li');
                // Nomor soal bisa diambil dari input atau urutan
                const questionNumberInput = formDiv.querySelector(`input[name="questions-${i}-question_number"]`);
                li.textContent = questionNumberInput ? questionNumberInput.value : (i + 1);
                li.dataset.formIndex = i;
                li.addEventListener('click', function() {
                    showQuestionForm(i);
                });
                
                const isLockedInput = formDiv.querySelector(`input[name="questions-${i}-is_locked"]`);
                const isLocked = isLockedInput ? isLockedInput.value === 'true' : false;
                
                if (isLocked) {
                    li.classList.add('locked');
                }
                questionNavList.appendChild(li);
            });
            
            // Setelah update navigasi, pastikan soal aktif yang benar disorot
            const visibleForms = questionsContainer.querySelectorAll('.question-form-item:not([style*="display: none"])');
            if (visibleForms.length > 0) {
                // Periksa apakah currentActiveQuestionIndex masih valid (misal, tidak dihapus)
                let activeFormStillExists = false;
                for(let i=0; i < visibleForms.length; i++) {
                    if(parseInt(visibleForms[i].id.replace('question-form-', '')) === currentActiveQuestionIndex) {
                        activeFormStillExists = true;
                        break;
                    }
                }
                if (!activeFormStillExists) {
                    // Jika soal aktif saat ini tidak ada, pindah ke soal pertama yang terlihat
                    currentActiveQuestionIndex = parseInt(visibleForms[0].id.replace('question-form-', ''));
                }
                showQuestionForm(currentActiveQuestionIndex);
            } else {
                // Jika tidak ada form yang tersisa (semua dihapus)
                questionNavList.innerHTML = ''; // Kosongkan navigasi
                nextButton.disabled = true; // Nonaktifkan tombol selanjutnya
            }
        }

        // --- Fungsi untuk menampilkan/menyembunyikan form soal tertentu ---
        function showQuestionForm(index) {
            const forms = questionsContainer.querySelectorAll('.question-form-item');
            forms.forEach((form, i) => {
                const formIndex = parseInt(form.id.replace('question-form-', ''));
                form.style.display = (formIndex === index) ? 'block' : 'none';
            });

            const navItems = questionNavList.querySelectorAll('li');
            navItems.forEach((item) => {
                item.classList.remove('active');
                if (parseInt(item.dataset.formIndex) === index) {
                    item.classList.add('active');
                }
            });
            currentActiveQuestionIndex = index;
        }

        // --- Fungsi untuk check apakah semua soal sudah diisi dan terkunci ---
        function checkAllQuestionsFilledAndLocked() {
            let allFilledAndLocked = true;
            const forms = questionsContainer.querySelectorAll('.question-form-item');
            
            // Periksa apakah ada form yang tidak dihapus
            let hasVisibleForms = false;

            for (let i = 0; i < forms.length; i++) {
                const formDiv = forms[i];
                const deleteInput = formDiv.querySelector(`input[name="questions-${i}-DELETE"]`);
                
                if (deleteInput && deleteInput.value === 'true') {
                    continue; // Lewati form yang dihapus
                }
                hasVisibleForms = true; // Ada setidaknya satu form yang tidak dihapus

                const questionTextarea = formDiv.querySelector(`textarea[name="questions-${i}-question_text"]`);
                const questionNumberInput = formDiv.querySelector(`input[name="questions-${i}-question_number"]`);
                const maxPointsInput = formDiv.querySelector(`input[name="questions-${i}-max_points"]`);
                const isLockedInput = formDiv.querySelector(`input[name="questions-${i}-is_locked"]`);

                // Pastikan semua field wajib terisi untuk form yang tidak dihapus
                if (!questionTextarea || questionTextarea.value.trim() === '' ||
                    !questionNumberInput || questionNumberInput.value.trim() === '' ||
                    !maxPointsInput || maxPointsInput.value.trim() === '') {
                    allFilledAndLocked = false;
                    break;
                }
                // Pastikan juga sudah terkunci
                if (isLockedInput && isLockedInput.value !== 'true') {
                     allFilledAndLocked = false;
                     break;
                }
            }
            
            // Tombol Next/Selanjutnya hanya aktif jika semua terisi, terkunci, DAN ada setidaknya satu soal yang tidak dihapus
            nextButton.disabled = !(allFilledAndLocked && hasVisibleForms);
        }

        // --- Handler untuk tombol Kunci Soal dan Hapus Soal ---
        questionsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('lock-btn')) {
                e.preventDefault();
                const index = e.target.dataset.formIndex;
                const questionTextarea = document.getElementById(`id_questions-${index}-question_text`);
                const questionNumberInput = document.getElementById(`id_questions-${index}-question_number`);
                const maxPointsInput = document.getElementById(`id_questions-${index}-max_points`);

                if (!questionTextarea || questionTextarea.value.trim() === '' ||
                    !questionNumberInput || questionNumberInput.value.trim() === '' ||
                    !maxPointsInput || maxPointsInput.value.trim() === '') {
                    alert("Nomor soal, teks soal, dan poin maksimal tidak boleh kosong sebelum dikunci.");
                    return;
                }
                
                const lockHiddenInput = document.getElementById(`id_questions-${index}-is_locked`);
                const navItem = questionNavList.querySelector(`li[data-form-index="${index}"]`);
                
                if (lockHiddenInput.value === 'true') {
                    // Buka kunci
                    lockHiddenInput.value = 'false';
                    e.target.textContent = 'Kunci Soal';
                    if (navItem) navItem.classList.remove('locked');
                    questionTextarea.readOnly = false;
                    questionNumberInput.readOnly = false;
                    maxPointsInput.readOnly = false;
                    alert(`Soal ${parseInt(index)+1} telah dibuka.`);
                } else {
                    // Kunci
                    lockHiddenInput.value = 'true';
                    e.target.textContent = 'Buka Kunci';
                    if (navItem) navItem.classList.add('locked');
                    questionTextarea.readOnly = true;
                    questionNumberInput.readOnly = true;
                    maxPointsInput.readOnly = true;
                    alert(`Soal ${parseInt(index)+1} telah dikunci.`);
                }
                checkAllQuestionsFilledAndLocked(); // Panggil untuk update tombol Next
            } else if (e.target.classList.contains('delete-btn')) {
                e.preventDefault();
                const index = e.target.dataset.formIndex;
                const formDiv = document.getElementById(`question-form-${index}`);
                const deleteHiddenInput = document.getElementById(`id_questions-${index}-DELETE`);
                if (confirm(`Anda yakin ingin menghapus soal ${parseInt(index)+1}?`)) {
                    if (formDiv) {
                        formDiv.style.display = 'none'; // Sembunyikan form
                        if (deleteHiddenInput) deleteHiddenInput.value = 'true'; // Tandai untuk dihapus di backend
                        updateQuestionNav(); // Perbarui navigasi
                        checkAllQuestionsFilledAndLocked(); // Panggil untuk update tombol Next
                        
                        // Pindah ke soal lain jika yang aktif dihapus
                        if (currentActiveQuestionIndex === index) {
                            const remainingForms = questionsContainer.querySelectorAll('.question-form-item:not([style*="display: none"])');
                            if (remainingForms.length > 0) {
                                showQuestionForm(parseInt(remainingForms[0].id.replace('question-form-', '')));
                            } else {
                                // Jika tidak ada soal tersisa, nonaktifkan tombol next
                                nextButton.disabled = true;
                            }
                        }
                    }
                }
            }
        });

        // Inisialisasi awal formset soal (setelah DOM dimuat dan form dirender oleh Django)
        // Setel nomor soal untuk form yang baru dirender (jika kosong) dan status readOnly
        const initialForms = questionsContainer.querySelectorAll('.question-form-item');
        initialForms.forEach((formDiv, i) => {
            const questionNumberInput = formDiv.querySelector(`input[name="questions-${i}-question_number"]`);
            if (questionNumberInput && questionNumberInput.value.trim() === '') {
                questionNumberInput.value = i + 1; // Atur nomor soal jika kosong
            }
            // Atur status readOnly berdasarkan is_locked saat inisialisasi
            const questionTextarea = formDiv.querySelector(`textarea[name="questions-${i}-question_text"]`);
            const maxPointsInput = formDiv.querySelector(`input[name="questions-${i}-max_points"]`);
            const isLockedInput = formDiv.querySelector(`input[name="questions-${i}-is_locked"]`);
            if (isLockedInput && isLockedInput.value === 'true') {
                if (questionTextarea) questionTextarea.readOnly = true;
                if (questionNumberInput) questionNumberInput.readOnly = true;
                if (maxPointsInput) maxPointsInput.readOnly = true;
            }
        });
        
        // Panggil updateNav dan checkAllQuestionsFilledAndLocked untuk formset yang sudah dirender Django
        updateQuestionNav();
        checkAllQuestionsFilledAndLocked();
        // Tampilkan soal pertama secara default jika ada form yang terlihat
        if (initialForms.length > 0) {
            const firstVisibleForm = questionsContainer.querySelector('.question-form-item:not([style*="display: none"])');
            if(firstVisibleForm) {
                showQuestionForm(parseInt(firstVisibleForm.id.replace('question-form-', '')));
            }
        }
    }

    // === Tahap 3: Konfirmasi Ujian ===
    else if (currentStep === 3) {
        console.log("Rendering Step 3 JS logic.");
        // Tidak banyak JS di sini karena data konfirmasi diambil langsung oleh Django template
        // Dan form reference_document adalah form Django standar.
        
        // Contoh: Cek apakah file upload sudah dipilih (opsional)
        const referenceDocumentInput = document.getElementById('id_reference_document');
        if (nextButton) { // nextButton di Tahap 3 adalah tombol finish
            function checkReferenceDocSelected() {
                if (referenceDocumentInput && referenceDocumentInput.files.length > 0) {
                    nextButton.disabled = false;
                } else {
                    nextButton.disabled = false; // Jika field ini nullable, tidak perlu disabled
                }
            }
            referenceDocumentInput.addEventListener('change', checkReferenceDocSelected);
            checkReferenceDocSelected(); // Initial check
        }
    }
});