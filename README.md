# 🎓 Eğitim Platformu (Udemy Klonu)

Bu proje, modern web teknolojilerini kullanarak geliştirilmiş kapsamlı bir eğitim platformudur. Kullanıcılara güvenli bir ortamda kurslara erişim, içerik yönetimi ve kişiselleştirilmiş öğrenme yol haritaları sunar.

---

## 🔗 Bağlantılar

* **Canlı Site:** ([https://www.nurullahmencik.com](https://portfolio-udemy-frontend.vercel.app/))
* **LinkedIn:** (https://www.linkedin.com/in/nurullah-mencik-6b692a216)
* **Portfolio:** (https://www.nurullahmencik.com/)
* **E-posta:** nurullahmencik42@gmail.com

---

## ✨ Özellikler

* **Güvenli Kullanıcı Kimlik Doğrulaması:** JWT (JSON Web Tokens) ile güvenli kayıt ve giriş sistemi.
* **Kurs İnceleme ve Detayları:** Detaylı inceleme, puanlama ve yorum yapabilme.
* **Sepete Ekleme ve Satın Alma:** Kursları sepete ekleme ve satın alma simülasyonu.
* **Admin Paneli:** Kurs, kullanıcı ve platform ayarları yönetimi.
* **İçerik Yönetimi:** Yeni kurs ekleme, güncelleme ve silme (CRUD).
* **Mobil Uyumlu Tasarım:** Responsive (duyarlı) tasarım.
* **Yapay Zeka Destekli Yol Haritası:** Kişiselleştirilmiş kurs önerileri simülasyonu.

---

## 🚀 Teknolojiler


### Backend (Server)
Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Multer, CORS

---

## 📂 Proje Yapısı

```text
├── server/                     # Backend Uygulaması (Node.js, Express, MongoDB)
│   ├── config/                 # Yapılandırma dosyaları
│   │   └── database.js
│   ├── controllers/            # API kontrolcüleri
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── profileController.js
│   │   ├── purchaseController.js
│   │   └── userController.js
│   ├── middleware/             # Express middleware'ları
│   │   └── verifyToken.js
│   ├── models/                 # Mongoose modelleri
│   │   ├── authModel.js
│   │   └── courseModel.js
│   ├── public/                 # Statik dosyalar
│   │   └── uploads/            # Yüklenen resimler
│   ├── routes/                 # API rotaları
│   │   ├── authRoute.js
│   │   ├── courseRoute.js
│   │   ├── profileRoute.js
│   │   └── purchaseRoute.js
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js                # Sunucu giriş noktası
│   ├── package-lock.json
│   └── package.json
├── .gitignore                  # Kök dizin git yoksayma
└── README.md                   # Ana README dosyası
