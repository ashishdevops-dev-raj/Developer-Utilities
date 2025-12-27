// JSON Formatter Tool
(function() {
    'use strict';

    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const validateBtn = document.getElementById('validateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const inputInfo = document.getElementById('inputInfo');
    const outputInfo = document.getElementById('outputInfo');

    function init() {
        formatBtn.addEventListener('click', handleFormat);
        minifyBtn.addEventListener('click', handleMinify);
        validateBtn.addEventListener('click', handleValidate);
        clearBtn.addEventListener('click', handleClear);
        copyBtn.addEventListener('click', handleCopy);

        // Auto-format on paste
        inputText.addEventListener('paste', () => {
            setTimeout(() => {
                const text = inputText.value.trim();
                if (text) {
                    handleFormat();
                }
            }, 100);
        });
    }

    function handleFormat() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter JSON to format');
            return;
        }

        try {
            const parsed = JSON.parse(text);
            const formatted = JSON.stringify(parsed, null, 2);
            outputText.value = formatted;
            outputInfo.textContent = '✓ Valid JSON formatted';
            outputInfo.style.color = 'var(--success)';
            inputInfo.textContent = `Input: ${formatBytes(text.length)} characters`;
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
        }
    }

    function handleMinify() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter JSON to minify');
            return;
        }

        try {
            const parsed = JSON.parse(text);
            const minified = JSON.stringify(parsed);
            outputText.value = minified;
            outputInfo.textContent = `Minified: ${formatBytes(minified.length)} characters`;
            outputInfo.style.color = 'var(--success)';
            inputInfo.textContent = `Original: ${formatBytes(text.length)} characters`;
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
        }
    }

    function handleValidate() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter JSON to validate');
            return;
        }

        try {
            JSON.parse(text);
            outputText.value = '✓ Valid JSON';
            outputInfo.textContent = 'Validation successful';
            outputInfo.style.color = 'var(--success)';
            inputInfo.textContent = `Input: ${formatBytes(text.length)} characters`;
        } catch (error) {
            outputText.value = '✗ Invalid JSON\n\n' + error.message;
            showError('Validation failed: ' + error.message);
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
        outputText.value = '';
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

