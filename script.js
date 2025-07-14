document.addEventListener('DOMContentLoaded', () => {
    const allControls = document.querySelectorAll('.controls input, .controls select, .controls textarea');

    function generateAndApply() {
        // ... (вся функция generateAndApply остается БЕЗ ИЗМЕНЕНИЙ) ...
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
        const sandbox = sandboxValues.join(' ');

        const params = new URLSearchParams();
        params.set('src', src);
        params.set('name', name);
        params.set('width', width);
        params.set('height', height);
        params.set('title', title);
        params.set('sandbox', sandbox);
        params.set('allow', permissions);
        params.set('referrerpolicy', referrerpolicy);
        params.set('loading', loading);
        params.set('fetchpriority', fetchpriority);

        const standalonePageUrl = `iframe_content_standalone.html?${params.toString()}`;

        const linkOutput = document.getElementById('link-output');
        linkOutput.textContent = standalonePageUrl;

        const openLinkBtn = document.getElementById('open-link-btn');
        openLinkBtn.href = standalonePageUrl;

        const container = document.getElementById('iframe-container');
        // Обновляем только src iframe, не пересоздавая его, чтобы изменение ширины не вызывало перезагрузку
        let previewIframe = container.querySelector('iframe');
        if (!previewIframe) {
            previewIframe = document.createElement('iframe');
            container.appendChild(previewIframe);
        }
        previewIframe.src = standalonePageUrl;

        const fallbackHeader = document.getElementById('fallback-header').value;
        const fallbackDesc = document.getElementById('fallback-desc').value;
        const fallbackButtonText = document.getElementById('fallback-button').value;

        document.getElementById('mobile-header-output').textContent = fallbackHeader;
        document.getElementById('mobile-desc-output').textContent = fallbackDesc;
        const mobileButton = document.getElementById('mobile-button-output');
        mobileButton.textContent = fallbackButtonText || 'Открыть';
        mobileButton.href = standalonePageUrl;
    }

    // Добавляем слушатель для мгновенного обновления
    allControls.forEach(control => {
        control.addEventListener('input', generateAndApply);
    });

    // --- НОВЫЙ КОД ДЛЯ ИЗМЕНЕНИЯ ШИРИНЫ ---
    const resizer = document.getElementById('resizer');
    const iframeContainer = document.getElementById('iframe-container');
    const widthDisplay = document.querySelector('#width-display span');

    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        // Добавляем слушатели на весь документ, чтобы можно было двигать мышь за пределы ползунка
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });

    function handleMouseMove(e) {
        if (!isResizing) return;

        // Вычисляем новую ширину
        const containerRect = iframeContainer.parentElement.getBoundingClientRect();
        let newWidth = e.clientX - containerRect.left;

        // Ограничения по ширине (например, от 100px до 90% родителя)
        const maxWidth = iframeContainer.parentElement.clientWidth * 0.95;
        if (newWidth < 100) newWidth = 100;
        if (newWidth > maxWidth) newWidth = maxWidth;

        // Применяем новую ширину
        iframeContainer.style.width = `${newWidth}px`;
        // Обновляем отображение ширины
        widthDisplay.textContent = `${Math.round(newWidth)}px`;
    }

    function handleMouseUp() {
        isResizing = false;
        // Важно: удаляем слушатели, чтобы они не работали после отпускания мыши
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    generateAndApply();
});