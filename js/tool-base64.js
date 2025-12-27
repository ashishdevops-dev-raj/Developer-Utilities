// Base64 Encoder/Decoder Tool
(function() {
    'use strict';

    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const fileInput = document.getElementById('fileInput');
    const inputInfo = document.getElementById('inputInfo');
    const outputInfo = document.getElementById('outputInfo');

    function init() {
        encodeBtn.addEventListener('click', handleEncode);
        decodeBtn.addEventListener('click', handleDecode);
        clearBtn.addEventListener('click', handleClear);
        copyBtn.addEventListener('click', handleCopy);
        fileInput.addEventListener('change', handleFileLoad);

        // Auto-detect and process on paste
        inputText.addEventListener('paste', () => {
            setTimeout(() => {
                const text = inputText.value.trim();
                if (isBase64(text)) {
                    handleDecode();
                }
            }, 100);
        });

        // Update info on input
        inputText.addEventListener('input', updateInputInfo);
    }

    function handleEncode() {
        const text = inputText.value;
        if (!text.trim()) {
            showError('Please enter text to encode');
            return;
        }

        try {
            const encoded = btoa(unescape(encodeURIComponent(text)));
            outputText.value = encoded;
            outputInfo.textContent = `Encoded: ${formatBytes(encoded.length)}`;
            inputInfo.textContent = `Input: ${formatBytes(text.length)}`;
        } catch (error) {
            showError('Encoding failed: ' + error.message);
        }
    }

    function handleDecode() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter Base64 string to decode');
            return;
        }

        if (!isBase64(text)) {
            showError('Invalid Base64 string');
            return;
        }

        try {
            const decoded = decodeURIComponent(escape(atob(text)));
            outputText.value = decoded;
            outputInfo.textContent = `Decoded: ${formatBytes(decoded.length)}`;
            inputInfo.textContent = `Input: ${formatBytes(text.length)} (Base64)`;
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

        const success = await Utils.copyToClipboard(text);
        if (success) {
            copyBtn.textContent = '✓ Copied';
            setTimeout(() => {
                copyBtn.textContent = '📋';
            }, 2000);
        }
    }

    function handleFileLoad(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            const base64 = arrayBufferToBase64(arrayBuffer);
            inputText.value = base64;
            inputInfo.textContent = `File: ${file.name} (${formatBytes(file.size)})`;
            handleDecode();
        };
        reader.readAsArrayBuffer(file);
    }

    function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function isBase64(str) {
        try {
            return btoa(atob(str)) === str;
        } catch (err) {
            return false;
        }
    }

    function updateInputInfo() {
        const text = inputText.value;
        if (!text) {
            inputInfo.textContent = '';
            return;
        }
        inputInfo.textContent = `Input: ${formatBytes(text.length)} characters`;
    }

    function formatBytes(bytes) {
        return Utils.formatBytes(bytes);
    }

    function showError(message) {
        outputInfo.textContent = '❌ ' + message;
        outputInfo.style.color = 'var(--error)';
        setTimeout(() => {
            outputInfo.style.color = '';
        }, 3000);
    }

    function showSuccess(message) {
        Utils.showSuccess(message);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

