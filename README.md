# 🤖 AI Kod Öğretmen - React + JavaScript

**Profesyonel AI destekli interaktif kod öğrenme platformu**

Her seviye için 100 egzersiz ile JavaScript ve React öğrenin!

## ✨ Ana Özellikler

- 🎯 **Her seviye için 100 egzersiz** - Google Gemini AI
- 🏆 **10 zorluk seviyesi** - Otomatik ilerler
- 💻 **Monaco Editor** - VS Code editörü
- 🤖 **AI değerlendirme** - Detaylı feedback
- 📊 **Puanlama & İstatistikler** - Seri, seviye, başarı
- 🔄 **Cache sistemi** - Hızlı yükleme

## 🚀 Hızlı Başlangıç

### 1. API Anahtarı

[Google AI Studio](https://makersuite.google.com/app/apikey) → "Create API Key"

### 2. Çalıştır

```bash
npm run dev
```

Tarayıcıda aç: **http://localhost:5173**

### 3. Kullan

1. API key gir
2. "Yeni Egzersiz" tıkla
3. Kodunu yaz
4. "Çalıştır" ile test et
5. "AI'ya Gönder" ile değerlendir
6. Puan kazan!

## 📋 Proje Yapısı

```
src/
├── components/          # React componentler
│   ├── Header.jsx      # Başlık, puan, seviye
│   ├── TaskPanel.jsx   # Egzersiz paneli
│   ├── CodeEditor.jsx  # Monaco editor
│   ├── ConsolePanel.jsx # Konsol & butonlar
│   ├── ApiKeyModal.jsx # API key modal
│   └── LoadingOverlay.jsx
├── services/
│   └── geminiService.js # AI servis
├── store/
│   └── useStore.js     # Zustand state
├── App.jsx
└── main.jsx
```

## 🎯 Seviye Sistemi

| Seviye | Puan | Zorluk | Egzersiz Puanı |
|--------|------|--------|----------------|
| 1-2 | 0-199 | Çok Kolay | +10 |
| 3-4 | 200-399 | Kolay | +10-20 |
| 5-6 | 400-599 | Orta | +20 |
| 7-8 | 600-799 | Zor | +30 |
| 9-10 | 800+ | Çok Zor | +50 |

## 💡 Özellikler

### JavaScript Konuları
- **Seviye 1-3**: Değişkenler, fonksiyonlar, döngüler
- **Seviye 4-6**: Array/Object metodları, async/await
- **Seviye 7-10**: Algoritmalar, design patterns

### React Konuları
- **Seviye 1-3**: JSX, components, useState, useEffect
- **Seviye 4-6**: useContext, custom hooks, useReducer
- **Seviye 7-10**: Advanced patterns, optimization

## 🛠️ Teknolojiler

- React 19 + Vite 7
- Zustand (state management)
- Monaco Editor
- Google Gemini AI
- React Icons

## 📦 Komutlar

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint check
```

## 🐛 Sorun Giderme

**API Hatası?** → API key'i kontrol et
**Monaco yüklenmiyor?** → İnternet bağlantısı kontrol et
**Kod çalışmıyor?** → Console'da hata mesajını oku

## 📄 Lisans

Eğitim amaçlı, özgürce kullanılabilir.

---

**Mutlu Kodlamalar!** 🚀✨
