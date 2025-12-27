// JWT Decoder Tool
(function() {
    'use strict';

    const inputText = document.getElementById('inputText');
    const headerText = document.getElementById('headerText');
    const payloadText = document.getElementById('payloadText');
    const copyHeaderBtn = document.getElementById('copyHeaderBtn');
    const copyPayloadBtn = document.getElementById('copyPayloadBtn');

    function init() {
        inputText.addEventListener('input', decodeJWT);
        copyHeaderBtn.addEventListener('click', () => handleCopy(headerText.value, copyHeaderBtn));
        copyPayloadBtn.addEventListener('click', () => handleCopy(payloadText.value, copyPayloadBtn));
    }

    function decodeJWT() {
        const token = inputText.value.trim();
        
        if (!token) {
            headerText.value = '';
            payloadText.value = '';
            return;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            headerText.value = 'Invalid JWT format';
            payloadText.value = 'JWT must have 3 parts separated by dots';
            return;
        }

        try {
            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

            headerText.value = JSON.stringify(header, null, 2);
            payloadText.value = JSON.stringify(payload, null, 2);
        } catch (error) {
            headerText.value = 'Error decoding: ' + error.message;
            payloadText.value = '';
        }
    }

    async function handleCopy(text, button) {
        if (!text || text.startsWith('Error') || text.startsWith('Invalid')) {
            Utils.showError('No valid content to copy');
            return;
        }

        const success = await Utils.copyToClipboard(text);
        if (success) {
            button.textContent = '✓';
            setTimeout(() => {
                button.textContent = '📋';
            }, 2000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

