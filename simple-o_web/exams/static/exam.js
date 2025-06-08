document.addEventListener("DOMContentLoaded", () => {
  const countdownTimer = document.getElementById("countdown-timer");
  const questionList = document.getElementById("question-list");
  const currentQuestionNumberSpan = document.getElementById(
    "current-question-number"
  );
  const totalQuestionsSpan = document.getElementById("total-questions");
  const questionText = document.getElementById("question-text");
  const answerInput = document.getElementById("answer-input");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const finishButton = document.getElementById("finish-button");

  // --- Data Ujian (Simulasi) ---
  // Di aplikasi nyata, data ini akan diambil dari server
  const questions = [
    {
      id: 1,
      question:
        "Jelaskan secara singkat bagaimana peran Proklamasi Kemerdekaan Indonesia pada tanggal 17 Agustus 1945 dalam pembentukan identitas nasional.",
      answer: "",
    },
    {
      id: 2,
      question:
        "Apa saja faktor-faktor internal dan eksternal yang mendorong pergerakan nasional Indonesia menuju kemerdekaan?",
      answer: "",
    },
    {
      id: 3,
      question:
        "Bagaimana dampak Konferensi Meja Bundar bagi kedaulatan dan pemerintahan Indonesia?",
      answer: "",
    },
    {
      id: 4,
      question:
        "Uraikan peran pemuda dalam peristiwa Sumpah Pemuda 1928 dan signifikansinya bagi persatuan bangsa.",
      answer: "",
    },
    {
      id: 5,
      question:
        "Analisis bagaimana Pancasila menjadi dasar negara dan ideologi dalam kehidupan berbangsa dan bernegara di Indonesia.",
      answer: "",
    },
    {
      id: 6,
      question:
        "Sebutkan dan jelaskan tiga tokoh penting yang berkontribusi besar dalam perjuangan kemerdekaan Indonesia selain Soekarno dan Hatta.",
      answer: "",
    },
    {
      id: 7,
      question:
        "Bagaimana pendidikan formal dan non-formal berperan dalam menumbuhkan semangat nasionalisme di kalangan rakyat Indonesia sebelum kemerdekaan?",
      answer: "",
    },
  ];

  const totalQuestions = questions.length;
  let currentQuestionIndex = 0; // Mulai dari soal pertama (indeks 0)
  let timeLeft = 30 * 60; // 30 menit dalam detik (Anda bisa sesuaikan)
  let timerInterval;

  // --- Inisialisasi Ujian ---
  function initExam() {
    totalQuestionsSpan.textContent = totalQuestions;
    renderQuestionList();
    loadQuestion(currentQuestionIndex);
    startTimer();
  }

  // --- Fungsi Waktu Mundur (Countdown Timer) ---
  function startTimer() {
    timerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      countdownTimer.textContent = `${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        countdownTimer.textContent = "Waktu Habis!";
        alert("Waktu ujian telah habis! Ujian akan diselesaikan.");
        finishExam();
      } else if (timeLeft <= 60 && timeLeft > 0) {
        // Beri peringatan 1 menit terakhir
        countdownTimer.style.color = varToRgb("--danger-color"); // Merah
      }
      timeLeft--;
    }, 1000);
  }

  // Fungsi helper untuk mendapatkan nilai RGB dari CSS variable
  function varToRgb(variableName) {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue(variableName).trim();
  }

  // --- Render Daftar Soal di Sidebar ---
  function renderQuestionList() {
    questionList.innerHTML = ""; // Kosongkan daftar yang sudah ada
    questions.forEach((q, index) => {
      const li = document.createElement("li");
      li.classList.add("question-item");
      li.dataset.question = q.id;
      li.textContent = q.id;

      // Tandai soal yang aktif
      if (index === currentQuestionIndex) {
        li.classList.add("active");
      }
      // Tandai soal yang sudah diisi
      if (q.answer.trim() !== "") {
        li.classList.add("answered");
      }

      li.addEventListener("click", () => {
        // Simpan jawaban saat ini sebelum beralih
        saveCurrentAnswer();
        loadQuestion(index);
      });
      questionList.appendChild(li);
    });
  }

  // --- Memuat Soal ke Area Konten Utama ---
  function loadQuestion(index) {
    if (index >= 0 && index < totalQuestions) {
      currentQuestionIndex = index;
      const question = questions[currentQuestionIndex];

      currentQuestionNumberSpan.textContent = question.id;
      questionText.textContent = question.question;
      answerInput.value = question.answer; // Muat jawaban yang tersimpan

      updateNavigationButtons();
      updateActiveQuestionInSidebar();
    }
  }

  // --- Menyimpan Jawaban Saat Ini ---
  function saveCurrentAnswer() {
    questions[currentQuestionIndex].answer = answerInput.value;
    // Setelah menyimpan, perbarui status 'answered' di sidebar
    updateActiveQuestionInSidebar();
  }

  // --- Memperbarui Tombol Navigasi ---
  function updateNavigationButtons() {
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === totalQuestions - 1;

    // Tampilkan tombol "Selesai Ujian" hanya di soal terakhir
    if (currentQuestionIndex === totalQuestions - 1) {
      finishButton.classList.remove("hidden");
    } else {
      finishButton.classList.add("hidden");
    }
  }

  // --- Memperbarui Status Aktif di Sidebar ---
  function updateActiveQuestionInSidebar() {
    const allQuestionItems = document.querySelectorAll(".question-item");
    allQuestionItems.forEach((item, index) => {
      item.classList.remove("active");
      // Tambahkan kelas 'answered' jika soal ini sudah ada jawabannya
      if (questions[index].answer.trim() !== "") {
        item.classList.add("answered");
      } else {
        item.classList.remove("answered"); // Hapus jika jawaban dikosongkan
      }
    });
    // Aktifkan item soal yang sedang dibuka
    questionList.children[currentQuestionIndex].classList.add("active");
  }

  // --- Event Listener untuk Navigasi Soal ---
  prevButton.addEventListener("click", () => {
    saveCurrentAnswer(); // Simpan sebelum pindah
    loadQuestion(currentQuestionIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    saveCurrentAnswer(); // Simpan sebelum pindah
    loadQuestion(currentQuestionIndex + 1);
  });

  // --- Event Listener untuk Tombol Selesai Ujian ---
  finishButton.addEventListener("click", () => {
    saveCurrentAnswer(); // Simpan jawaban terakhir
    const confirmFinish = confirm(
      "Apakah Anda yakin ingin menyelesaikan ujian?"
    );
    if (confirmFinish) {
      finishExam();
    }
  });

  function finishExam() {
    clearInterval(timerInterval);
    alert("Ujian selesai! Jawaban Anda telah disimpan.");
    // Di sini Anda akan mengirim semua data jawaban (questions array) ke server.
    // Untuk simulasi, kita bisa mengarahkan kembali ke dashboard atau halaman hasil.
    console.log("Jawaban yang terkumpul:", questions);

    // Contoh: Redirect ke dashboard setelah ujian selesai
    window.location.href = "index.html";
  }

  // Inisialisasi Ujian saat halaman dimuat
  initExam();
});
