document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');

    function generateIframe() {
        // --- Сбор данных из формы ---
        const src = document.getElementById('src').value;
        const name = document.getElementById('name').value;
        const width = document.getElementById('width').value;
        const height = document.getElementById('height').value;
        const title = document.getElementById('title').value;
        const permissions = document.getElementById('permissions').value;
        const referrerpolicy = document.getElementById('referrerpolicy').value;
        const loading = document.getElementById('loading').value;
        const fetchpriority = document.getElementById('fetchpriority').value;

        // Собираем значения для sandbox
        const sandboxValues = [];
        if (document.getElementById('allow-forms').checked) sandboxValues.push('allow-forms');
        if (document.getElementById('allow-same-origin').checked) sandboxValues.push('allow-same-origin');
        if (document.getElementById('allow-scripts').checked) sandboxValues.push('allow-scripts');
        if (document.getElementById('allow-downloads').checked) sandboxValues.push('allow-downloads');
        const sandbox = sandboxValues.join(' ');

        // --- Создание iFrame ---
        const iframe = document.createElement('iframe');
        iframe.src = src;
        if (name) iframe.name = name;
        if (title) iframe.title = title;
        if (sandbox) iframe.sandbox = sandbox;
        if (permissions) iframe.allow = permissions;
        if (referrerpolicy) iframe.referrerPolicy = referrerpolicy;
        if (loading) iframe.loading = loading;
        if (fetchpriority) iframe.setAttribute('fetchpriority', fetchpriority);

        iframe.style.width = width;
        iframe.style.height = height;

        // --- Обновление DOM ---
        const container = document.getElementById('iframe-container');
        container.innerHTML = ''; // Очищаем старый iframe
        container.appendChild(iframe);

        // --- Вывод сгенерированного кода ---
        const codeOutput = document.getElementById('code-output');
        // Форматируем outerHTML для лучшей читаемости
        let formattedHtml = iframe.outerHTML
            .replace(/><\/iframe>/, ' />') // для самозакрывающегося вида
            .replace(/ /g, '\n  ')
            .replace('src', '\n  src')
            .replace('<iframe', '<iframe');

        codeOutput.textContent = formattedHtml;

        // --- Обновление мобильной заглушки ---
        const fallbackHeader = document.getElementById('fallback-header').value;
        const fallbackDesc = document.getElementById('fallback-desc').value;
        const fallbackButton = document.getElementById('fallback-button').value;

        document.getElementById('mobile-header-output').textContent = fallbackHeader;
        document.getElementById('mobile-desc-output').textContent = fallbackDesc;
        const buttonEl = document.getElementById('mobile-button-output');
        buttonEl.textContent = fallbackButton || 'Открыть';
        buttonEl.href = src; // Кнопка ведет на тот же URL
    }

    generateBtn.addEventListener('click', generateIframe);

    // Сгенерировать iframe при первой загрузке страницы с настройками по умолчанию
    generateIframe();
});