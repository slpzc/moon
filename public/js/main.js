new Vue({
    el: '#app',
    data: {
        inMove: false,
        inMoveDelay: 400,
        activeSection: 0,
        offsets: [],
        touchStartY: 0,
        services: [
            {
                name: 'Разработка сайтов',
                description: 'Корпоративные сайты, промо-сайты, landing pages, интернет-магазины'
            },
            {
                name: 'Продвижение',
                description: 'Контекстная реклама, SEO, SMM-продвижение, реклама в социальных сетях'
            },
            {
                name: 'Брендинг',
                description: 'Платформа бренда, нейминг, логотип и фирменный стиль, упаковка, key visual'
            },
            {
                name: 'Приложения',
                description: 'Мобильные приложения разных типов: ритейл, сервисы, развлечения'
            },
            {
                name: 'Маркетинг',
                description: 'Аудит бизнеса, маркетинговая стратегия, позиционирование, проверка франшизы'
            },
            {
                name: 'Автоматизация',
                description: 'Внедрение CRM Битрикс24, визуализация данных, оптимизация бизнес-процессов'
            }
        ],
        inputs: {
            name: false,
            email: false,
            phone: false,
            project: false
        },
        brief: {
            name: '',
            email: '',
            phone: '',
            project: ''
        },
        cases: [
            {
                title: 'ЖК «Академический»',
                work: 'Создание сайта, Продвижение',
                image: 'https://i.imgur.com/5x66D8u.png'
            },
            {
                title: 'Строительная компания «Пик»',
                work: 'Создание сайта, Продвижение',
                image: 'https://0.db-estate.cdn.pik-service.ru/attachment_pikru/8909000/8909899f-0bf5-11e8-ac2a-001ec9d8c6a2/dsc021521-1_37f98aa2df9b4f18bc69802c52104845.jpg'
            },
            {
                title: 'Самокат',
                work: 'Создание сайта, Брендинг',
                image: 'https://spb-samokat.ru/wp-content/uploads/2021/05/samokat-spb-glavnaya.jpg'
            },
            {
                title: 'РЖД',
                work: 'Создание приложения, продвижение',
                image: 'https://psysocwork.ru/wp-content/uploads/2022/07/maxresdefault.jpg'
            },
            {
                title: 'Aviasales',
                work: 'Создание приложения, Маркетинг',
                image: 'https://tourpedia.ru/wp-content/uploads/2019/10/aviasales-avia1-1.jpg'
            }

        ],
        currentCase: 0,
        minutesInterval: 0,
        hoursInterval: 0,
        hours: 8,
        minutes: 59
    },
    watch: {
        minutes(val) {
            if (val === -1) {
                this.minutes = 59
                this.hours--
            }
        }
    },
    methods: {
        setTime() {
            this.minutesInterval = setInterval(() => {
                this.minutes--
            }, 60000)
        },
        inputActivate(name) {
            for (const i in this.inputs) {
                this.inputs[i] = false
            }
            console.log(this.inputs)
            this.inputs[name] = true
            console.log(this.inputs)
        },
        /**
         * Calcaulates the absolute offsets of each section on the page and pushs it into the offsets array
         */
        calculateSectionOffsets() {
            let sections = document.getElementsByTagName('section');
            let length = sections.length;

            for (let i = 0; i < length; i++) {
                let sectionOffset = sections[i].offsetTop;
                this.offsets.push(sectionOffset);
            }

        },
        /**
         * Handle the 'mousewheel' event for other browsers
         */
        handleMouseWheel: function (e) {

            if (e.wheelDelta < 30 && !this.inMove) {
                this.moveUp();
            } else if (e.wheelDelta > 30 && !this.inMove) {
                this.moveDown();
            }

            e.preventDefault();
            return false;
        },
        /**
         * Handle the 'DOMMouseScroll' event for Firefox
         */
        handleMouseWheelDOM: function (e) {

            if (e.detail > 0 && !this.inMove) {
                this.moveUp();
            } else if (e.detail < 0 && !this.inMove) {
                this.moveDown();
            }

            return false;
        },
        moveDown() {
            this.inMove = true;
            this.activeSection--;

            if (this.activeSection < 0) this.activeSection = this.offsets.length - 1;

            this.scrollToSection(this.activeSection, true);
        },
        moveUp() {
            this.inMove = true;
            this.activeSection++;

            if (this.activeSection > this.offsets.length - 1) this.activeSection = 0;

            this.scrollToSection(this.activeSection, true);
        },
        scrollToSection(id, force = false) {
            if (this.inMove && !force) return false;

            this.activeSection = id;
            this.inMove = true;

            // get section and scroll into view if it exists
            let section = document.getElementsByTagName('section')[id];
            if (section) {
                document.getElementsByTagName('section')[id].scrollIntoView({behavior: 'smooth'});
            }

            setTimeout(() => {
                this.inMove = false;
            }, this.inMoveDelay);

        },
        touchStart(e) {
            e.preventDefault();

            this.touchStartY = e.touches[0].clientY;
        },
        touchMove(e) {
            if (this.inMove) return false;
            e.preventDefault();

            const currentY = e.touches[0].clientY;

            if (this.touchStartY < currentY) {
                this.moveDown();
            } else {
                this.moveUp();
            }

            this.touchStartY = 0;
            return false;
        }
    },
    mounted() {
        this.setTime()
        this.calculateSectionOffsets();

        window.addEventListener('DOMMouseScroll', this.handleMouseWheelDOM);  // Mozilla Firefox
        window.addEventListener('mousewheel', this.handleMouseWheel, {passive: false}); // Other browsers

        window.addEventListener('touchstart', this.touchStart, {passive: false}); // mobile devices
        window.addEventListener('touchmove', this.touchMove, {passive: false}); // mobile devices
    },
    destroyed() {
        window.removeEventListener('DOMMouseScroll', this.handleMouseWheelDOM); // Mozilla Firefox
        window.removeEventListener('mousewheel', this.handleMouseWheel, {passive: false});  // Other browsers

        window.removeEventListener('touchstart', this.touchStart); // mobile devices
        window.removeEventListener('touchmove', this.touchMove); // mobile devices
    }
});