# 🤖 AI Kod Öğretmen - JavaScript & React

İnteraktif AI destekli kod öğrenme platformu. Google Gemini AI ile JavaScript ve React öğrenin!

## 🌟 Özellikler

- ✨ **AI Destekli Görevler**: Zorluk seviyeniz arttıkça otomatik olarak zorluk artar
- 💻 **Monaco Editor**: VS Code kullandığı profesyonel kod editörü
- 🎯 **Puanlama Sistemi**: Her başarılı görev için puan kazanın
- 📊 **Seviye Sistemi**: Başlangıç'tan Master'a kadar ilerleyin
- 🔄 **Canlı Feedback**: AI kodunuzu değerlendirir ve öneriler sunar
- 💡 **İpucu Sistemi**: Takıldığınızda AI'dan ipucu alabilirsiniz
- 🎨 **Modern Arayüz**: 3 panel layout (Görev - Kod - Konsol)

## 🚀 Kurulum

### 1. Google Gemini API Anahtarı Alın

1. [Google AI Studio](https://makersuite.google.com/app/apikey) sayfasına gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. API anahtarınızı kopyalayın

### 2. Uygulamayı Çalıştırın

```bash
# Tarayıcınızda index.html dosyasını açın
# veya
# Python ile basit bir server başlatın
cd ai-tutor
python -m http.server 8000

# veya Node.js ile
npx http-server
```

Tarayıcınızda açın: `http://localhost:8000`

### 3. API Anahtarını Ayarlayın

İlk açılışta API anahtarınızı girin. Anahtarınız tarayıcınızda güvenli bir şekilde saklanır.

## 📖 Kullanım

### Temel İş Akışı

1. **Yeni Görev Al**: AI size seviyenize uygun bir görev verir
2. **Kodu Yaz**: Monaco editörde kodunuzu yazın
3. **Kodu Çalıştır**: Kodunuzu test edin, konsol çıktısını görün
4. **AI'ya Gönder**: AI kodunuzu değerlendirir ve feedback verir
5. **Puan Kazan**: Başarılı oldukça puan kazanın ve seviye atlayın

### Puanlama Sistemi

| Zorluk | Puan | Açıklama |
|--------|------|----------|
| Kolay (1-3) | +10 | Temel JavaScript kavramları |
| Orta (4-6) | +20 | Array/Object metodları, DOM, Async |
| Zor (7-10) | +30 | Algoritmalar, Design Patterns, Advanced React |

**Bonuslar:**
- 🎯 3 görev üst üste doğru: +10 puan
- 💡 İpucu alma: -2 puan

### Seviye Sistemi

| Seviye | Toplam Puan |
|--------|-------------|
| Başlangıç | 0-49 |
| Gelişen | 50-149 |
| Orta | 150-299 |
| İleri | 300-499 |
| Uzman | 500-799 |
| Master | 800+ |

## 🎮 Özellikler Detaylı

### 1. Otomatik Zorluk Ayarlama

Sistem, toplam puanınıza göre otomatik olarak görev zorluğunu ayarlar:
- 0-49 puan: Seviye 1 (Değişkenler, Fonksiyonlar)
- 50-99 puan: Seviye 2 (Koşullar, Döngüler)
- 100-149 puan: Seviye 3 (Array metodları)
- 150+ puan: Seviye 4-10 (Gelişmiş konular)

### 2. AI Feedback

AI kodunuzu değerlendirir ve şu kriterlere göre feedback verir:
- ✅ Doğruluk
- 🎨 Kod kalitesi
- 📝 Best practices
- 💡 İyileştirme önerileri

### 3. Konsol Çıktısı

Kodunuzu çalıştırdığınızda:
- `console.log()` çıktıları gösterilir
- Hatalar renkli gösterilir
- Zaman damgası eklenir

### 4. Dil Seçimi

- **JavaScript**: Vanilla JavaScript görevleri
- **React (JSX)**: React component görevleri

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler

- **Monaco Editor**: VS Code'un kullandığı editör
- **Google Gemini AI**: AI görev oluşturma ve feedback
- **Vanilla JavaScript**: Framework'süz, saf JavaScript
- **LocalStorage**: Puan ve API anahtarı saklama
- **CSS Grid/Flexbox**: Responsive layout

### Proje Yapısı

```
ai-tutor/
├── index.html          # Ana HTML dosyası
├── style.css           # Stiller ve tema
├── app.js              # Ana uygulama logic
├── gemini-service.js   # Gemini API entegrasyonu
└── README.md           # Dokümantasyon
```

## 🔒 Güvenlik

- API anahtarınız sadece tarayıcınızda (localStorage) saklanır
- Kod tarayıcıda güvenli bir şekilde çalıştırılır
- Sunucu tarafı gereksinimi yoktur

## 💡 İpuçları

1. **Görevleri Atlayın**: Çok zor gelirse "Yeni Görev Al" ile farklı görev alabilirsiniz
2. **İpucu Kullanın**: Takılırsanız -2 puan karşılığında ipucu alın
3. **Önce Test Edin**: "Kodu Çalıştır" ile test edin, sonra "AI'ya Gönder"
4. **Konsolu İnceleyin**: Hataları konsol çıktısından takip edin
5. **Kod Temizliğine Dikkat**: AI kod kalitesini de değerlendirir

## 🎯 Örnek Görevler

### Seviye 1 (Kolay)
```javascript
// Görev: İki sayıyı toplayan bir fonksiyon yazın
function topla(a, b) {
  return a + b;
}

console.log(topla(5, 3)); // 8
```

### Seviye 5 (Orta)
```javascript
// Görev: Array'deki çift sayıları filtreleyin ve ikiye katlayın
const sayilar = [1, 2, 3, 4, 5, 6];
const sonuc = sayilar
  .filter(sayi => sayi % 2 === 0)
  .map(sayi => sayi * 2);

console.log(sonuc); // [4, 8, 12]
```

### Seviye 9 (Zor)
```javascript
// Görev: Debounce fonksiyonu implementasyonu
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
```

## 🐛 Sorun Giderme

### API Hatası Alıyorum
- API anahtarınızın doğru olduğundan emin olun
- [Google AI Studio](https://makersuite.google.com/app/apikey) üzerinden yeni anahtar oluşturun
- İnternet bağlantınızı kontrol edin

### Monaco Editor Yüklenmiyor
- İnternet bağlantınızı kontrol edin (CDN'den yüklenir)
- Tarayıcı konsolunda hata var mı kontrol edin

### Kod Çalışmıyor
- Syntax hatası var mı kontrol edin
- Console'da hata mesajını okuyun
- İpucu alarak yardım isteyin

## 📝 Lisans

Bu proje eğitim amaçlıdır ve özgürce kullanılabilir.

## 🤝 Katkıda Bulunma

Önerileriniz ve katkılarınız için pull request açabilirsiniz!

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**Mutlu Kodlamalar!** 🚀✨
