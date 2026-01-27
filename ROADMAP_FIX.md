# Backend Roadmap API Düzeltmesi

## Sorun
Roadmap API endpoint'inde 500 (Internal Server Error) hatası alınıyordu.

## Kök Sebep
1. **Google API Key süresi dolmuş**: Kodda hard-coded olarak bulunan Google Gemini API key'i expire olmuştu
2. **node_modules yüklü değildi**: Bağımlılıklar yüklenmemişti
3. **.env dosyası eksikti**: Ortam değişkenleri yapılandırılmamıştı

## Yapılan Düzeltmeler

### 1. Bağımlılıkların Yüklenmesi
```bash
npm install
```

### 2. .env Dosyası Oluşturulması
`.env` dosyası oluşturuldu ve aşağıdaki değişkenler eklendi:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/egitim-platformu
JWT_SECRET=your-secret-key-here-change-in-production
GOOGLE_API_KEY=your-google-api-key-here
```

### 3. API Key Güvenlik İyileştirmesi
- Hard-coded API key kaldırıldı
- API key environment variable'a taşındı
- API key kontrolü eklendi

### 4. Hata Yönetimi İyileştirmesi
- API key yoksa kullanıcıya anlamlı hata mesajı gösteriliyor
- 503 (Service Unavailable) status code'u kullanılıyor

## Yapılması Gerekenler

### ✅ Acil - Google API Key Alma
1. [Google AI Studio](https://aistudio.google.com/app/apikey) adresine git
2. Yeni bir API key oluştur
3. `.env` dosyasında `GOOGLE_API_KEY` değişkenini güncelle:
   ```
   GOOGLE_API_KEY=AIza...
   ```

### ⚠️ Önemli - MongoDB Kurulumu (Opsiyonel)
Eğer MongoDB kullanacaksanız:
1. MongoDB'yi yükleyin ve çalıştırın
2. Ya da `.env` dosyasında MongoDB Atlas connection string kullanın

### 🔄 Server'ı Yeniden Başlatın
```bash
npm start
```

## Test Etme

PowerShell ile test:
```powershell
$body = @{ content = "Backend öğrenmek istiyorum" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/roadmap/generate" -Method POST -Body $body -ContentType "application/json"
```

## Değişen Dosyalar
- ✅ `routes/roadmapRoutes.js` - API key güvenliği ve hata yönetimi
- ✅ `.env` - Ortam değişkenleri yapılandırması
- ✅ `node_modules/` - Bağımlılıklar yüklendi

## Sonraki Adımlar
1. Google API key'i alın ve `.env`'ye ekleyin
2. Server'ı restart edin
3. Frontend'den roadmap özelliğini test edin
