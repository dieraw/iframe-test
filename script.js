document.addEventListener('DOMContentLoaded', () => {
    const allControls = document.querySelectorAll('.controls input, .controls select, .controls textarea');

    // Функция Debounce
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    function generateAndApply() {
        // Сбор данных
        const src = document.getElementById('src').value;
        const name = document.getElementById('name').value;
        const width = document.getElementById('width').value;
        const height = document.getElementById('height').value;
        const title = document.getElementById('title').value;
        const permissions = document.getElementById('permissions').value;
        const referrerpolicy = document.getElementById('referrerpolicy').value;
        const loading = document.getElementById('loading').value;
        const fetchpriority = document.getElementById('fetchpriority').value;

        const sandboxValues = [];
        if (document.getElementById('allow-forms').checked) sandboxValues.push('allow-forms');
        if (document.getElementById('allow-same-origin').checked) sandboxValues.push('allow-same-origin');
        if (document.getElementById('allow-scripts').checked) sandboxValues.push('allow-scripts');
        if (document.getElementById('allow-downloads').checked) sandboxValues.push('allow-downloads');
        if (document.getElementById('allow-modals').checked) sandboxValues.push('allow-modals');
        const sandbox = sandboxValues.join(' ');

        // Формируем URL с параметрами для страницы-обертки
        const params = new URLSearchParams();
        params.set('src', src);
        params.set('name', name);
        params.set('title', title);
        params.set('sandbox', sandbox);
        params.set('allow', permissions);
        params.set('referrerpolicy', referrerpolicy);
        params.set('loading', loading);
        params.set('fetchpriority', fetchpriority);

        // ВАЖНО: размеры теперь передаются как параметры самой обертке
        params.set('width', width);
        params.set('height', height);

        const standalonePageUrl = `iframe_content_standalone.html?${params.toString()}`;

        // Обновляем UI
        const linkOutput = document.getElementById('link-output');
        linkOutput.textContent = standalonePageUrl;
        document.getElementById('open-link-btn').href = standalonePageUrl;

        // Обновляем превью
        const container = document.getElementById('iframe-container');
        let previewIframe = container.querySelector('iframe');
        if (!previewIframe) {
            previewIframe = document.createElement('iframe');
            container.appendChild(previewIframe);
        }
        // Устанавливаем src обертки
        previewIframe.src = standalonePageUrl;
        // Устанавливаем размеры для контейнера превью
        previewIframe.style.width = width;
        previewIframe.style.height = height;

        // Обновляем мобильную заглушку
        const fallbackHeader = document.getElementById('fallback-header').value;
        const fallbackDesc = document.getElementById('fallback-desc').value;
        const fallbackButtonText = document.getElementById('fallback-button').value;

        document.getElementById('mobile-header-output').textContent = fallbackHeader;
        document.getElementById('mobile-desc-output').textContent = fallbackDesc;
        const mobileButton = document.getElementById('mobile-button-output');
        mobileButton.textContent = fallbackButtonText || 'Открыть';
        mobileButton.href = standalonePageUrl; // Заглушка тоже ведет на страницу-обертку
    }

    // Создаем "обезвреженную" версию функции
    const debouncedGenerate = debounce(generateAndApply, 300);

    // Вешаем слушатели на все контролы
    allControls.forEach(control => {
        control.addEventListener('input', debouncedGenerate);
    });

    // --- Логика ресайзера (без изменений, она работает хорошо) ---
    const resizer = document.getElementById('resizer');
    const previewWrapper = document.querySelector('.preview-wrapper');
    const widthDisplay = document.querySelector('#width-display span');

    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });

    function handleMouseMove(e) {
        if (!isResizing) return;
        const containerRect = previewWrapper.parentElement.getBoundingClientRect();
        let newWidth = e.clientX - containerRect.left;
        const maxWidth = previewWrapper.parentElement.clientWidth * 0.98;
        if (newWidth < 100) newWidth = 100;
        if (newWidth > maxWidth) newWidth = maxWidth;

        previewWrapper.style.width = `${newWidth}px`;
        widthDisplay.textContent = `${Math.round(newWidth)}px`;
    }

    function handleMouseUp() {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    // Первоначальный запуск
    generateAndApply();
});