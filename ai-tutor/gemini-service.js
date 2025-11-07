/**
 * Google Gemini API Servisi
 * AI görev oluşturma, kod değerlendirme ve feedback
 */

class GeminiService {
    constructor() {
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.currentTask = null;
        this.difficulty = 1; // 1-10 arası zorluk seviyesi
        this.topic = 'javascript'; // javascript veya react
    }

    /**
     * API anahtarını ayarla
     */
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('gemini_api_key', key);
    }

    /**
     * API anahtarı var mı kontrol et
     */
    hasApiKey() {
        return this.apiKey && this.apiKey.length > 0;
    }

    /**
     * Zorluk seviyesini ayarla (1-10)
     */
    setDifficulty(level) {
        this.difficulty = Math.max(1, Math.min(10, level));
    }

    /**
     * Konuyu ayarla (javascript veya react)
     */
    setTopic(topic) {
        this.topic = topic;
    }

    /**
     * Zorluk seviyesine göre puan hesapla
     */
    calculatePoints() {
        if (this.difficulty <= 3) return 10;
        if (this.difficulty <= 6) return 20;
        return 30;
    }

    /**
     * Zorluk seviyesine göre kategori
     */
    getDifficultyLabel() {
        if (this.difficulty <= 3) return { label: 'Kolay', class: 'easy' };
        if (this.difficulty <= 6) return { label: 'Orta', class: 'medium' };
        return { label: 'Zor', class: 'hard' };
    }

    /**
     * Gemini API'ye istek gönder
     */
    async makeRequest(prompt) {
        if (!this.hasApiKey()) {
            throw new Error('API anahtarı ayarlanmamış');
        }

        const url = `${this.baseUrl}?key=${this.apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API isteği başarısız');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    /**
     * Yeni görev oluştur
     */
    async generateTask() {
        const topicDesc = this.topic === 'react' ? 'React ve JSX' : 'JavaScript';
        const difficultyDesc = this.getDifficultyLabel().label.toLowerCase();

        const prompt = `Sen bir programlama öğretmenisin. ${topicDesc} konusunda ${difficultyDesc} seviyede (1-10 skalasında ${this.difficulty}) bir kodlama görevi oluştur.

KONU: ${topicDesc}
ZORLUK: ${this.difficulty}/10 (${difficultyDesc})

Görev şu formatta olmalı:

### Görev Başlığı

**Açıklama:**
Görevin ne olduğunu açıkla (2-3 cümle)

**Gereksinimler:**
- Gereksinim 1
- Gereksinim 2
- Gereksinim 3

**Örnek Kullanım:**
\`\`\`
// Örnek kod veya beklenen çıktı
\`\`\`

**İpuçları:**
- İpucu 1
- İpucu 2

Zorluk seviyesi ${this.difficulty} olduğu için:
${this.difficulty <= 3 ? '- Temel kavramlar (değişkenler, fonksiyonlar, koşullar, döngüler)\n- Basit algoritmalar' : ''}
${this.difficulty > 3 && this.difficulty <= 6 ? '- Array/Object metodları\n- DOM manipülasyonu\n- Asenkron işlemler (Promise, async/await)' : ''}
${this.difficulty > 6 ? '- Karmaşık algoritmalar\n- Design patterns\n- Performance optimizasyonu\n- Advanced React hooks ve state management' : ''}

Görev açık, ölçülebilir ve öğretici olmalı.`;

        try {
            const taskText = await this.makeRequest(prompt);
            this.currentTask = {
                description: taskText,
                difficulty: this.difficulty,
                points: this.calculatePoints(),
                topic: this.topic,
                createdAt: new Date()
            };
            return this.currentTask;
        } catch (error) {
            console.error('Görev oluşturma hatası:', error);
            throw error;
        }
    }

    /**
     * Kodu değerlendir ve feedback ver
     */
    async evaluateCode(code, consoleOutput, hasError) {
        if (!this.currentTask) {
            throw new Error('Aktif görev yok');
        }

        const prompt = `Sen bir kod öğretmenisin. Öğrencinin yazdığı kodu değerlendir.

**GÖREV:**
${this.currentTask.description}

**ÖĞRENCİNİN KODU:**
\`\`\`javascript
${code}
\`\`\`

**KONSOL ÇIKTISI:**
${consoleOutput || 'Çıktı yok'}

**HATA DURUMU:**
${hasError ? 'Kod çalıştırılırken hata oluştu' : 'Kod başarıyla çalıştı'}

Lütfen şu kriterlere göre değerlendirme yap:

1. **Doğruluk:** Görev gereksinimlerini karşılıyor mu?
2. **Kod Kalitesi:** Temiz ve okunabilir mi?
3. **Best Practices:** JavaScript/React best practices'lere uygun mu?
4. **Hatalar:** Varsa hataları açıkla

Feedback formatı:

✅ **Başarılı:** [Başarılı olan kısımlar]
❌ **İyileştirilmesi Gerekenler:** [Eksik veya hatalı kısımlar]
💡 **Öneriler:** [Kod iyileştirme önerileri]

Sonunda bir puan ver (0-100 arası) ve öğrenciye motive edici bir mesaj ekle.`;

        try {
            const feedback = await this.makeRequest(prompt);
            return feedback;
        } catch (error) {
            console.error('Kod değerlendirme hatası:', error);
            throw error;
        }
    }

    /**
     * İpucu al
     */
    async getHint() {
        if (!this.currentTask) {
            throw new Error('Aktif görev yok');
        }

        const prompt = `Şu görev için öğrenciye yardımcı olacak bir ipucu ver:

**GÖREV:**
${this.currentTask.description}

İpucu:
- Çözümü doğrudan verme
- Öğrenciyi doğru yöne yönlendir
- Hangi JavaScript konseptini kullanması gerektiğini söyle
- Küçük bir örnek kod parçası göster
- 2-3 cümle ile sınırlı kalsın

İpucu:`;

        try {
            const hint = await this.makeRequest(prompt);
            return hint;
        } catch (error) {
            console.error('İpucu alma hatası:', error);
            throw error;
        }
    }

    /**
     * Kullanıcı seviyesini hesapla (toplam puana göre)
     */
    calculateLevel(totalScore) {
        if (totalScore < 50) return 'Başlangıç';
        if (totalScore < 150) return 'Gelişen';
        if (totalScore < 300) return 'Orta';
        if (totalScore < 500) return 'İleri';
        if (totalScore < 800) return 'Uzman';
        return 'Master';
    }

    /**
     * Önerilen zorluk seviyesini hesapla (seviyeye göre)
     */
    getRecommendedDifficulty(totalScore) {
        if (totalScore < 50) return 1;
        if (totalScore < 100) return 2;
        if (totalScore < 150) return 3;
        if (totalScore < 250) return 4;
        if (totalScore < 350) return 5;
        if (totalScore < 450) return 6;
        if (totalScore < 600) return 7;
        if (totalScore < 750) return 8;
        if (totalScore < 900) return 9;
        return 10;
    }
}

// Global instance
const geminiService = new GeminiService();
