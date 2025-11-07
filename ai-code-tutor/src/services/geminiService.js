/**
 * Google Gemini AI Service
 * Her seviye için 100 egzersiz oluşturma ve kod değerlendirme
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

class GeminiService {
  constructor() {
    this.cache = new Map(); // Exercise cache
  }

  /**
   * API'ye istek gönder
   */
  async makeRequest(apiKey, prompt) {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
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
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  /**
   * Seviye için 100 egzersiz oluştur
   * Bu fonksiyon toplu olarak egzersizleri oluşturur
   */
  async generateExerciseBatch(apiKey, topic, level, batchSize = 10) {
    const cacheKey = `${topic}-level${level}`;

    // Cache kontrolü
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const exercises = [];
    const totalBatches = Math.ceil(100 / batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
      const batchExercises = await this.generateExercises(apiKey, topic, level, batchSize, batch + 1);
      exercises.push(...batchExercises);
    }

    // Cache'e kaydet
    this.cache.set(cacheKey, exercises);

    return exercises;
  }

  /**
   * Belirli sayıda egzersiz oluştur
   */
  async generateExercises(apiKey, topic, level, count, batchNumber) {
    const topicDesc = topic === 'react' ? 'React ve JSX' : 'JavaScript';
    const difficulty = this.getDifficultyDescription(level);

    const prompt = `Sen bir programlama eğitmenisin. ${topicDesc} konusunda Seviye ${level} (${difficulty}) için ${count} adet kodlama egzersizi oluştur.

KONU: ${topicDesc}
SEVİYE: ${level}/10
ZORLUK: ${difficulty}
BATCH: ${batchNumber}

${this.getLevelGuidelines(topic, level)}

Her egzersiz şu JSON formatında olmalı (SADECE JSON dön, başka açıklama ekleme):

[
  {
    "id": "unique-id-${level}-${batchNumber}-1",
    "title": "Egzersiz Başlığı",
    "description": "Egzersizin açıklaması",
    "requirements": [
      "Gereksinim 1",
      "Gereksinim 2"
    ],
    "hints": [
      "İpucu 1",
      "İpucu 2"
    ],
    "starterCode": "// Başlangıç kodu",
    "solution": "// Çözüm kodu",
    "testCases": [
      {
        "input": "test input",
        "expected": "expected output"
      }
    ],
    "points": ${this.getPointsForLevel(level)},
    "difficulty": "${difficulty}",
    "tags": ["tag1", "tag2"]
  }
]

${count} egzersiz oluştur. Her egzersiz farklı ve benzersiz olmalı.`;

    try {
      const response = await this.makeRequest(apiKey, prompt);

      // JSON'u parse et
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const exercises = JSON.parse(jsonMatch[0]);
        return exercises.map((ex, idx) => ({
          ...ex,
          id: `${topic}-l${level}-b${batchNumber}-${idx + 1}`,
          level,
          topic
        }));
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Exercise generation error:', error);
      // Fallback: manuel egzersizler
      return this.getFallbackExercises(topic, level, count, batchNumber);
    }
  }

  /**
   * Seviye için zorluk açıklaması
   */
  getDifficultyDescription(level) {
    if (level <= 2) return 'Çok Kolay';
    if (level <= 4) return 'Kolay';
    if (level <= 6) return 'Orta';
    if (level <= 8) return 'Zor';
    return 'Çok Zor';
  }

  /**
   * Seviye için puan
   */
  getPointsForLevel(level) {
    if (level <= 3) return 10;
    if (level <= 6) return 20;
    if (level <= 8) return 30;
    return 50;
  }

  /**
   * Seviye için yönergeler
   */
  getLevelGuidelines(topic, level) {
    if (topic === 'javascript') {
      const guidelines = {
        1: '- Değişkenler (let, const, var)\n- Veri tipleri\n- Basit operatörler\n- console.log',
        2: '- Fonksiyonlar (function, arrow functions)\n- If/else koşulları\n- Basit matematiksel işlemler',
        3: '- Döngüler (for, while)\n- Array temel metodlar (push, pop, length)\n- String metodları',
        4: '- Array metodları (map, filter, reduce)\n- Object manipülasyonu\n- Template literals',
        5: '- Higher-order functions\n- Closure\n- Array ve Object destructuring',
        6: '- Async/await\n- Promises\n- Fetch API\n- Error handling',
        7: '- DOM manipülasyonu\n- Event handling\n- LocalStorage\n- JSON işlemleri',
        8: '- Algoritmalar (sorting, searching)\n- Recursion\n- Design patterns\n- Performance optimization',
        9: '- Advanced async patterns\n- Generators\n- Proxies\n- WeakMap/WeakSet',
        10: '- Complex algorithms\n- Data structures\n- Functional programming\n- Advanced patterns'
      };
      return guidelines[level] || guidelines[10];
    } else {
      const guidelines = {
        1: '- JSX syntax\n- Components (functional)\n- Props\n- Basit rendering',
        2: '- useState hook\n- Event handling\n- Conditional rendering\n- Lists ve keys',
        3: '- useEffect hook\n- Component lifecycle\n- Controlled forms\n- Input handling',
        4: '- Multiple state\n- State lifting\n- Composition\n- Children props',
        5: '- useContext\n- Custom hooks\n- useRef\n- useMemo',
        6: '- useReducer\n- Context patterns\n- Performance optimization\n- React.memo',
        7: '- API integration\n- Loading states\n- Error boundaries\n- Async patterns',
        8: '- Advanced hooks\n- Hook patterns\n- Render props\n- HOC patterns',
        9: '- State management (Context + Reducer)\n- Complex forms\n- Optimization techniques\n- Testing patterns',
        10: '- Advanced patterns\n- Micro-frontend concepts\n- Server components concepts\n- Architecture patterns'
      };
      return guidelines[level] || guidelines[10];
    }
  }

  /**
   * Kodu değerlendir
   */
  async evaluateCode(apiKey, exercise, code, consoleOutput, hasError) {
    const prompt = `Sen bir kod eğitmenisin. Öğrencinin yazdığı kodu değerlendir.

**EGZERSİZ:**
${exercise.title}

Gereksinimler:
${exercise.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

**ÖĞRENCİNİN KODU:**
\`\`\`javascript
${code}
\`\`\`

**KONSOL ÇIKTISI:**
${consoleOutput || 'Çıktı yok'}

**HATA DURUMU:**
${hasError ? 'Kod çalıştırılırken hata oluştu' : 'Kod başarıyla çalıştı'}

Lütfen şu formatta değerlendirme yap:

**PUAN:** [0-100 arası sayı]

**✅ BAŞARILAR:**
- [Başarılı olan kısımlar]

**❌ HATALAR VE EKSİKLER:**
- [Hatalı veya eksik kısımlar]

**💡 ÖNERİLER:**
- [Kod iyileştirme önerileri]

**🎯 MOTİVASYON:**
[Motive edici mesaj]

Değerlendirmen objektif ve yapıcı olmalı.`;

    try {
      const feedback = await this.makeRequest(apiKey, prompt);

      // Puanı parse et
      const scoreMatch = feedback.match(/PUAN.*?(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;

      return {
        feedback,
        score
      };
    } catch (error) {
      console.error('Evaluation error:', error);
      return {
        feedback: 'Değerlendirme sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        score: 0
      };
    }
  }

  /**
   * İpucu al
   */
  async getHint(apiKey, exercise, currentCode) {
    const prompt = `Öğrenci şu egzersizi çözmeye çalışıyor:

**EGZERSİZ:** ${exercise.title}
${exercise.description}

**ŞU ANKİ KOD:**
\`\`\`javascript
${currentCode || '// Henüz kod yazılmamış'}
\`\`\`

Öğrenciye yardımcı olacak KISA bir ipucu ver:
- Çözümü doğrudan verme
- Hangi konsepti kullanması gerektiğini söyle
- Küçük bir örnek göster
- 2-3 cümle ile sınırlı kalsın

İpucu:`;

    try {
      const hint = await this.makeRequest(apiKey, prompt);
      return hint;
    } catch (error) {
      console.error('Hint error:', error);
      return exercise.hints[0] || 'İpucu alınamadı. Lütfen egzersiz gereksinimlerini dikkatlice okuyun.';
    }
  }

  /**
   * Fallback egzersizler (API çalışmazsa)
   */
  getFallbackExercises(topic, level, count, batchNumber) {
    const templates = [];
    for (let i = 0; i < count; i++) {
      templates.push({
        id: `${topic}-l${level}-b${batchNumber}-fallback-${i + 1}`,
        title: `${topic} Egzersiz ${level}.${batchNumber}.${i + 1}`,
        description: `Seviye ${level} için bir egzersiz. API'den yüklenemedi, lütfen yeni egzersiz yükleyin.`,
        requirements: [
          'Bu bir placeholder egzersizdir',
          'Lütfen "Yeni Egzersiz Yükle" butonuna tıklayın'
        ],
        hints: ['API bağlantınızı kontrol edin'],
        starterCode: '// Kod buraya',
        solution: '// Çözüm yüklenemedi',
        testCases: [],
        points: this.getPointsForLevel(level),
        difficulty: this.getDifficultyDescription(level),
        tags: [topic, `level-${level}`],
        level,
        topic
      });
    }
    return templates;
  }
}

export default new GeminiService();
