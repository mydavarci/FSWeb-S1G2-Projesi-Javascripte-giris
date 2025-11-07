/**
 * AI Kod Öğretmen - Ana Uygulama
 */

class CodeTutorApp {
    constructor() {
        this.editor = null;
        this.totalScore = parseInt(localStorage.getItem('total_score') || '0');
        this.consecutiveCorrect = 0;
        this.consoleOutput = [];
        this.hasError = false;

        this.init();
    }

    /**
     * Uygulamayı başlat
     */
    async init() {
        // API anahtarı kontrolü
        if (!geminiService.hasApiKey()) {
            this.showApiKeyModal();
        }

        // Monaco Editor'ü yükle
        await this.initMonaco();

        // Event listener'ları ekle
        this.setupEventListeners();

        // Kullanıcı istatistiklerini güncelle
        this.updateUserStats();

        // İlk görevi yükle
        if (geminiService.hasApiKey()) {
            await this.loadNewTask();
        }
    }

    /**
     * Monaco Editor'ü başlat
     */
    async initMonaco() {
        return new Promise((resolve) => {
            require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });

            require(['vs/editor/editor.main'], () => {
                this.editor = monaco.editor.create(document.getElementById('editor'), {
                    value: '// Kodunuzu buraya yazın...\n\n',
                    language: 'javascript',
                    theme: 'vs-dark',
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on'
                });

                resolve();
            });
        });
    }

    /**
     * Event listener'ları kur
     */
    setupEventListeners() {
        // Yeni görev al
        document.getElementById('newTaskBtn').addEventListener('click', () => {
            this.loadNewTask();
        });

        // İpucu al
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.getHint();
        });

        // Kodu çalıştır
        document.getElementById('runCodeBtn').addEventListener('click', () => {
            this.runCode();
        });

        // AI'ya gönder
        document.getElementById('submitBtn').addEventListener('click', () => {
            this.submitCode();
        });

        // Editörü temizle
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.editor.setValue('// Kodunuzu buraya yazın...\n\n');
        });

        // Konsolu temizle
        document.getElementById('clearConsoleBtn').addEventListener('click', () => {
            this.clearConsole();
        });

        // Dil değiştir
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            const language = e.target.value === 'react' ? 'javascript' : 'javascript';
            monaco.editor.setModelLanguage(this.editor.getModel(), language);
            geminiService.setTopic(e.target.value);
        });

        // API key modal
        document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
            const apiKey = document.getElementById('apiKeyInput').value.trim();
            if (apiKey) {
                geminiService.setApiKey(apiKey);
                this.hideApiKeyModal();
                this.loadNewTask();
            } else {
                alert('Lütfen geçerli bir API anahtarı girin');
            }
        });
    }

    /**
     * API Key modalını göster
     */
    showApiKeyModal() {
        document.getElementById('apiKeyModal').classList.add('active');
    }

    /**
     * API Key modalını gizle
     */
    hideApiKeyModal() {
        document.getElementById('apiKeyModal').classList.remove('active');
    }

    /**
     * Yeni görev yükle
     */
    async loadNewTask() {
        if (!geminiService.hasApiKey()) {
            this.showApiKeyModal();
            return;
        }

        const taskContent = document.getElementById('taskContent');
        const newTaskBtn = document.getElementById('newTaskBtn');

        try {
            // Loading göster
            taskContent.innerHTML = `
                <div class="loading">
                    <i class="fas fa-circle-notch fa-spin"></i>
                    <p>AI görev hazırlıyor...</p>
                </div>
            `;
            newTaskBtn.disabled = true;

            // Zorluk seviyesini belirle (skora göre otomatik artır)
            const recommendedDifficulty = geminiService.getRecommendedDifficulty(this.totalScore);
            geminiService.setDifficulty(recommendedDifficulty);

            // Görevi oluştur
            const task = await geminiService.generateTask();

            // Görevi göster
            taskContent.innerHTML = `
                <div class="task-description">
                    ${this.formatMarkdown(task.description)}
                </div>
            `;

            // Zorluk badge'ini güncelle
            const diffInfo = geminiService.getDifficultyLabel();
            const diffBadge = document.getElementById('difficultyBadge');
            diffBadge.className = `difficulty-badge ${diffInfo.class}`;
            document.getElementById('difficultyLevel').textContent = diffInfo.label;
            document.getElementById('difficultyPoints').textContent = `+${task.points} puan`;

            // Konsolu temizle
            this.clearConsole();
            this.addConsoleLog('Yeni görev yüklendi! Başarılar!', 'success');

        } catch (error) {
            taskContent.innerHTML = `
                <div class="loading">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p style="color: var(--danger-color);">Hata: ${error.message}</p>
                    <p style="font-size: 12px; margin-top: 10px;">API anahtarınızı kontrol edin veya internet bağlantınızı kontrol edin.</p>
                </div>
            `;
            console.error('Görev yükleme hatası:', error);
        } finally {
            newTaskBtn.disabled = false;
        }
    }

    /**
     * İpucu al
     */
    async getHint() {
        if (!geminiService.currentTask) {
            alert('Önce bir görev yüklemelisiniz!');
            return;
        }

        const hintBtn = document.getElementById('hintBtn');

        try {
            hintBtn.disabled = true;
            hintBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> İpucu alınıyor...';

            const hint = await geminiService.getHint();

            this.addConsoleLog('💡 İpucu: ' + hint, 'warning');

            // İpucu için puan düş
            this.updateScore(-2);

        } catch (error) {
            this.addConsoleLog('İpucu alınırken hata oluştu: ' + error.message, 'error');
        } finally {
            hintBtn.disabled = false;
            hintBtn.innerHTML = '<i class="fas fa-lightbulb"></i> İpucu (-2 puan)';
        }
    }

    /**
     * Kodu çalıştır
     */
    runCode() {
        const code = this.editor.getValue();

        if (!code || code.trim() === '// Kodunuzu buraya yazın...') {
            this.addConsoleLog('Lütfen önce kod yazın!', 'warning');
            return;
        }

        this.clearConsole();
        this.consoleOutput = [];
        this.hasError = false;

        // console.log'u yakala
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
            const message = args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch {
                        return String(arg);
                    }
                }
                return String(arg);
            }).join(' ');

            this.consoleOutput.push(message);
            this.addConsoleLog(message, 'log');
            originalLog.apply(console, args);
        };

        console.error = (...args) => {
            const message = args.join(' ');
            this.consoleOutput.push('ERROR: ' + message);
            this.addConsoleLog('ERROR: ' + message, 'error');
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            const message = args.join(' ');
            this.consoleOutput.push('WARNING: ' + message);
            this.addConsoleLog('WARNING: ' + message, 'warning');
            originalWarn.apply(console, args);
        };

        try {
            // Kodu güvenli bir şekilde çalıştır
            const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            const func = new AsyncFunction(code);
            func();

            if (this.consoleOutput.length === 0) {
                this.addConsoleLog('Kod başarıyla çalıştırıldı (çıktı yok)', 'success');
            }

        } catch (error) {
            this.hasError = true;
            this.addConsoleLog(`Hata: ${error.message}`, 'error');
            this.consoleOutput.push('ERROR: ' + error.message);
        } finally {
            // console.log'u eski haline döndür
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        }
    }

    /**
     * Kodu AI'ya gönder ve değerlendirme al
     */
    async submitCode() {
        if (!geminiService.currentTask) {
            alert('Önce bir görev yüklemelisiniz!');
            return;
        }

        const code = this.editor.getValue();

        if (!code || code.trim() === '// Kodunuzu buraya yazın...') {
            this.addConsoleLog('Lütfen önce kod yazın!', 'warning');
            return;
        }

        const submitBtn = document.getElementById('submitBtn');

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> AI değerlendiriyor...';

            this.addConsoleLog('AI kodunuzu değerlendiriyor...', 'log');

            const consoleText = this.consoleOutput.join('\n');
            const feedback = await geminiService.evaluateCode(code, consoleText, this.hasError);

            // Feedback'i göster
            this.addConsoleLog(feedback, 'ai-feedback');

            // Başarılı ise puan ekle
            if (feedback.includes('✅') || feedback.toLowerCase().includes('başarılı')) {
                const points = geminiService.currentTask.points;
                this.updateScore(points);
                this.consecutiveCorrect++;

                // Bonus puan (3 görev üst üste doğru)
                if (this.consecutiveCorrect >= 3) {
                    this.updateScore(10);
                    this.addConsoleLog('🎉 Bonus: 3 görev üst üste doğru! +10 puan', 'success');
                    this.consecutiveCorrect = 0;
                }
            } else {
                this.consecutiveCorrect = 0;
            }

        } catch (error) {
            this.addConsoleLog('Değerlendirme hatası: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> AI\'ya Gönder';
        }
    }

    /**
     * Konsola log ekle
     */
    addConsoleLog(message, type = 'log') {
        const consoleContainer = document.getElementById('consoleOutput');

        // İlk mesaj ise welcome mesajını kaldır
        const welcome = consoleContainer.querySelector('.console-welcome');
        if (welcome) {
            welcome.remove();
        }

        const timestamp = new Date().toLocaleTimeString('tr-TR');
        const logLine = document.createElement('div');
        logLine.className = `console-line ${type}`;
        logLine.innerHTML = `<span class="timestamp">[${timestamp}]</span>${this.escapeHtml(message)}`;

        consoleContainer.appendChild(logLine);
        consoleContainer.scrollTop = consoleContainer.scrollHeight;
    }

    /**
     * Konsolu temizle
     */
    clearConsole() {
        const consoleContainer = document.getElementById('consoleOutput');
        consoleContainer.innerHTML = '';
        this.consoleOutput = [];
    }

    /**
     * Puanı güncelle
     */
    updateScore(points) {
        this.totalScore += points;
        if (this.totalScore < 0) this.totalScore = 0;

        localStorage.setItem('total_score', this.totalScore.toString());

        const scoreElement = document.getElementById('totalScore');
        scoreElement.textContent = this.totalScore;
        scoreElement.classList.add('score-animation');

        setTimeout(() => {
            scoreElement.classList.remove('score-animation');
        }, 500);

        this.updateUserStats();
    }

    /**
     * Kullanıcı istatistiklerini güncelle
     */
    updateUserStats() {
        const level = geminiService.calculateLevel(this.totalScore);
        document.getElementById('currentLevel').textContent = level;
        document.getElementById('totalScore').textContent = this.totalScore;
    }

    /**
     * Markdown formatla (basit)
     */
    formatMarkdown(text) {
        return text
            .replace(/###\s+(.*)/g, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n/g, '<br>');
    }

    /**
     * HTML escape
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Uygulamayı başlat
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new CodeTutorApp();
});
