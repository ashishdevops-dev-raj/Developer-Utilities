// URL Encoder/Decoder Tool
(function() {
    'use strict';

    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const inputInfo = document.getElementById('inputInfo');
    const outputInfo = document.getElementById('outputInfo');

    function init() {
        encodeBtn.addEventListener('click', handleEncode);
        decodeBtn.addEventListener('click', handleDecode);
        clearBtn.addEventListener('click', handleClear);
        copyBtn.addEventListener('click', handleCopy);
    }

    function handleEncode() {
        const text = inputText.value;
        if (!text.trim()) {
            showError('Please enter text to encode');
            return;
        }

        try {
            const encoded = encodeURIComponent(text);
            outputText.value = encoded;
            outputInfo.textContent = `Encoded: ${formatBytes(encoded.length)} characters`;
            inputInfo.textContent = `Input: ${formatBytes(text.length)} characters`;
        } catch (error) {
            showError('Encoding failed: ' + error.message);
        }
    }

    function handleDecode() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter URL-encoded string to decode');
            return;
        }

        try {
            const decoded = decodeURIComponent(text.replace(/\+/g, ' '));
            outputText.value = decoded;
            outputInfo.textContent = `Decoded: ${formatBytes(decoded.length)} characters`;
            inputInfo.textContent = `Input: ${formatBytes(text.length)} characters (URL-encoded)`;
        } catch (error) {
            showError('Decoding failed: ' + error.message);
        }
    }

    function handleClear() {
        inputText.value = '';
        outputText.value = '';
        inputInfo.textContent = '';
        outputInfo.textContent = '';
        inputText.focus();
    }

    async function handleCopy() {
        const text = outputText.value;
        if (!text) {
            showError('No output to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            showSuccess('Copied to clipboard!');
            copyBtn.textContent = '✓';
            setTimeout(() => {
                copyBtn.textContent = '📋';
            }, 2000);
        } catch (error) {
            outputText.select();
            document.execCommand('copy');
            showSuccess('Copied to clipboard!');
        }
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    function showError(message) {
        outputInfo.textContent = '❌ ' + message;
        outputInfo.style.color = 'var(--error)';
    }

    function showSuccess(message) {
        const info = document.createElement('div');
        info.className = 'success-message';
        info.textContent = message;
        info.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--success); color: white; padding: 1rem; border-radius: 8px; z-index: 1000;';
        document.body.appendChild(info);
        setTimeout(() => info.remove(), 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

