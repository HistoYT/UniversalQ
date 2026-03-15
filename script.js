function universalQ() {
    return {
        isScrolled: false,
        currentLang: 'es',
        isMenuOpen: false,
        currentSlide: 0,
        slideInterval: null,
        slideDirection: 'next',
        isChatOpen: false,
        chatStep: 0,
        isBotTyping: false,
        isSending: false,
        chatMessages: [],
        chatQuote: { topic: '', quantity: '', port: '' },
        chatInput: '',
        
        // Datos de los slides con imágenes de alta calidad
        slides: [
            {
                title: 'AZUCAR',
                titleAccent: 'INCUMSA',
                desc: 'Suministro ininterrumpido de azúcar refinada y fertilizantes de alta pureza con estándares internacionales.',
                image: 'Gemini_Generated_Image_awu88xawu88xawu8.png',
                accent: 'Liderazgo en Agro',
                zoomType: 'in'
            },
            {
                title: 'Energía e',
                titleAccent: 'Infraestructura',
                desc: 'Soluciones energéticas robustas para la infraestructura de las naciones en crecimiento.',
                image: 'Gemini_Generated_Image_n7tkqqn7tkqqn7tk.png',
                accent: 'Energía Confiable',
                zoomType: 'out'
            },
            {
                title: 'Minería',
                titleAccent: 'Estratégica',
                desc: 'Extracción y comercialización de minerales críticos para la tecnología del mañana.',
                image: 'Gemini_Generated_Image_rdsbyordsbyordsb.png',
                accent: 'Recursos Críticos',
                zoomType: 'in'
            }
        ],

        // Inicialización
        init() {
            this.startAutoSlide();
            this.setupScrollAnimations();
            this.setupCardGlow();
        },

        // Helper para la hora
        getCurrentTime() {
            return new Date().toLocaleTimeString('es-ES', { hour: 'numeric', minute: 'numeric' });
        },

        // Lógica de navegación
        nextSlide() {
            this.slideDirection = 'next';
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        },

        prevSlide() {
            this.slideDirection = 'prev';
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            // Reiniciamos el temporizador si el usuario interactúa manualmente
            this.resetAutoSlide(); 
        },

        // Control de la animación automática
        startAutoSlide() {
            // Limpiar intervalo existente si lo hay
            if (this.slideInterval) clearInterval(this.slideInterval);
            
            this.slideInterval = setInterval(() => {
                this.nextSlide();
            }, 6000); // Cambia cada 6 segundos
        },

        stopAutoSlide() {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        },

        resetAutoSlide() {
            this.stopAutoSlide();
            this.startAutoSlide();
        },

        // Lógica del Chatbot WhatsApp
        toggleChat() {
            this.isChatOpen = !this.isChatOpen;
            if (this.isChatOpen && this.chatMessages.length === 0) {
                this.startChat();
            }
        },

        startChat() {
            this.chatStep = 0;
            this.chatQuote = { topic: '', quantity: '', port: '' };
            this.chatMessages = [];
            setTimeout(() => { // Pequeño delay para que la ventana aparezca primero
                // Separador de día como en WhatsApp
                this.chatMessages.push({ type: 'day' });
                // Secuencia de saludo más humana
                this.chatMessages.push({ from: 'bot', time: this.getCurrentTime(), text: 'Hola 👋, bienvenido a UniversalQ.' });
                this.isBotTyping = true;
                setTimeout(() => {
                    this.isBotTyping = false;
                    this.chatMessages.push({ from: 'bot', time: this.getCurrentTime(), text: 'Soy tu asistente. ¿Sobre qué recurso estratégico deseas recibir información hoy?', options: [
                        { text: 'Cotizar Azúcar', value: 'Azúcar ICUMSA 45' },
                        { text: 'Minerales (Hierro/Litio)', value: 'Minerales y Metales' },
                        { text: 'Energía y Logística', value: 'Logística y Energía' }
                    ]});
                }, 1200);
            }, 500);
        },

        selectChatOption(option) {
            if (this.isBotTyping) return; // Prevenir clicks múltiples mientras el bot "escribe"
            
            // Ocultar opciones del mensaje anterior para que no se puedan volver a clickear
            const lastMessageWithOptions = this.chatMessages.findLast(m => m.options && m.options.length > 0);
            if (lastMessageWithOptions) {
                lastMessageWithOptions.options = [];
            }

            this.chatMessages.push({ from: 'user', time: this.getCurrentTime(), text: option.text });

            this.isBotTyping = true;
            setTimeout(() => {
                this.isBotTyping = false;
                switch(this.chatStep) {
                    case 0: // Topic selected
                        this.chatQuote.topic = option.value;
                        this.chatStep = 1;
                        this.chatMessages.push({ from: 'bot', time: this.getCurrentTime(), text: `Entendido. Para cotizar ${this.chatQuote.topic}, ¿qué volumen aproximado necesitas?`, options: [
                            { text: '1.000 - 10.000 MT', value: '1.000 - 10.000 MT' },
                            { text: '10.001 - 25.000 MT', value: '10.001 - 25.000 MT' },
                            { text: '25.001 - 50.000 MT', value: '25.001 - 50.000 MT' },
                            { text: 'Más de 50.000 MT', value: 'Más de 50.000 MT' }
                        ]});
                        break;
                    case 1: // Quantity selected
                        this.chatQuote.quantity = option.value;
                        this.chatStep = 2;
                        this.chatMessages.push({ from: 'bot', time: this.getCurrentTime(), text: 'Perfecto. Por favor, indícanos el puerto de destino (Ej: Rotterdam, Shanghai).', input: true });
                        break;
                }
            }, 1200); // Delay para simular escritura
        },

        submitChatInput() {
            if (!this.chatInput.trim() || this.isSending || this.isBotTyping) return;
            
            this.isSending = true;
            this.chatMessages[this.chatMessages.length - 1].input = false;
            this.chatMessages.push({ from: 'user', time: this.getCurrentTime(), text: this.chatInput });
            this.chatQuote.port = this.chatInput;
            this.chatInput = '';
            this.chatStep = 3;

            // Reset sending animation
            setTimeout(() => { this.isSending = false; }, 400);

            this.isBotTyping = true;
            setTimeout(() => {
                this.isBotTyping = false;
                this.chatMessages.push({ from: 'bot', time: this.getCurrentTime(), text: `¡Gracias! Para finalizar y recibir la cotización de un ejecutivo, por favor contáctanos por WhatsApp.`, options: [
                    { text: 'Contactar por WhatsApp', action: 'send' }
                ]});
            }, 1500); // Delay para simular escritura
        },

        sendToWhatsapp() {
            const phone = "1234567890"; // Reemplaza con tu número real
            const text = encodeURIComponent(
                `Hola UniversalQ, solicito una cotización con los siguientes detalles:\n` +
                `Producto: ${this.chatQuote.topic}\n` +
                `Volumen: ${this.chatQuote.quantity}\n` +
                `Puerto de Destino: ${this.chatQuote.port}`
            );
            window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
            this.isChatOpen = false;
        },

        setupCardGlow() {
           // Espera a que el DOM esté listo
            setTimeout(() => {
                document.querySelectorAll('.glow-card').forEach(card => {
                    card.addEventListener('mousemove', e => {
                        const rect = card.getBoundingClientRect();
                        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                    });
                });
            }, 100);
        },

        // Animaciones de entrada al hacer scroll
        setupScrollAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.25 });

            setTimeout(() => {
                document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
            }, 100);
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        const missionCard = document.querySelector('.mission-card');
        const visionCard = document.querySelector('.vision-card');
        const objectiveCards = document.querySelectorAll('.objective-card');

       // Add event listeners for hover effects
        if (missionCard) {
            missionCard.addEventListener('mouseenter', () => missionCard.classList.add('scale-105'));
            missionCard.addEventListener('mouseleave', () => missionCard.classList.remove('scale-105'));
        }
        if (visionCard) {
            visionCard.addEventListener('mouseenter', () => visionCard.classList.add('scale-105'));
            visionCard.addEventListener('mouseleave', () => visionCard.classList.remove('scale-105'));
        }
        objectiveCards.forEach(card => {
            card.addEventListener('mouseenter', () => card.classList.add('scale-105'));
            card.addEventListener('mouseleave', () => card.classList.remove('scale-105'));        });    });
}