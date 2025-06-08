// simple_o_web/exams/static/login.js (lokasi file sesuai tatanan Anda)

// Fungsi untuk toggle password visibility
function togglePasswordVisibility() {
  const passwordField = document.getElementById("password");
  const toggleIcon = document.querySelector("#togglePassword i");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    passwordField.type = "password";
    toggleIcon.classList.replace("fa-eye", "fa-eye-slash");
  }
}

// Handler untuk form submission
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Mencegah form untuk refresh halaman

    const username = document.getElementById("username").value; // Ambil nilai dari input username (sebelumnya email)
    const password = document.getElementById("password").value;
    const csrfToken = document.querySelector(
      '[name="csrfmiddlewaretoken"]'
    ).value; // Ambil CSRF token dari elemen tersembunyi

    // Buat objek FormData untuk mengirim data ke backend Django
    const formData = new FormData();
    formData.append("username", username); // Kirim username
    formData.append("password", password);
    formData.append("csrfmiddlewaretoken", csrfToken); // Sangat penting untuk Django

    try {
      // Kirim permintaan POST ke URL login Django
      const response = await fetch("/exams/login/", {
        // Pastikan URL ini sesuai dengan exams/urls.py
        method: "POST",
        body: formData, // Kirim FormData
        // Headers seperti 'Content-Type' tidak perlu disetel manual jika pakai FormData,
        // browser akan otomatis menyetel 'multipart/form-data'
      });

      // Periksa status respons
      if (response.ok) {
        // Jika respons 2xx (misal 200 OK)
        const data = await response.json(); // Asumsikan backend merespons dengan JSON

        if (data.success) {
          alert("Login berhasil! Mengarahkan...");
          window.location.href = data.redirect_url; // Redirect ke URL yang diberikan backend
        } else {
          // Ini seharusnya tidak terjadi jika backend selalu mengembalikan success:true pada status 200
          // Tapi baik untuk penanganan error umum
          alert(data.message || "Login gagal. Silakan coba lagi.");
        }
      } else {
        // Jika respons bukan 2xx (misal 401 Unauthorized, 403 Forbidden, 500 Internal Server Error)
        const errorData = await response.json(); // Coba parse respons error dari backend
        alert(
          errorData.message ||
            `Login gagal. Status: ${response.status}. Silakan coba lagi.`
        );
        console.error("Login failed:", response.status, errorData);
      }
    } catch (error) {
      // Tangani error jaringan atau error JavaScript lainnya
      console.error("Error during login fetch:", error);
      alert("Terjadi kesalahan jaringan atau server. Silakan coba lagi.");
    }
  });

// Menambahkan interaktivitas ke input fields (highlight saat fokus)
document.querySelectorAll(".input-field").forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentNode.querySelector(".input-highlight").style.width = "100%";
  });

  input.addEventListener("blur", function () {
    if (!this.value) {
      this.parentNode.querySelector(".input-highlight").style.width = "0";
    }
  });
});
