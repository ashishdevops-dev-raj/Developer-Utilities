// UUID Generator Tool
(function() {
    'use strict';

    const outputText = document.getElementById('outputText');
    const generateBtn = document.getElementById('generateBtn');
    const generateMultipleBtn = document.getElementById('generateMultipleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const outputInfo = document.getElementById('outputInfo');

    function init() {
        generateBtn.addEventListener('click', () => generateUUID(1));
        generateMultipleBtn.addEventListener('click', () => generateUUID(10));
        clearBtn.addEventListener('click', handleClear);
        copyBtn.addEventListener('click', handleCopy);
    }

    function generateUUID(count) {
        const uuids = [];
        for (let i = 0; i < count; i++) {
            uuids.push(crypto.randomUUID());
        }
        
        const existing = outputText.value.trim();
        outputText.value = existing ? existing + '\n' + uuids.join('\n') : uuids.join('\n');
        outputInfo.textContent = `Generated ${count} UUID${count > 1 ? 's' : ''}`;
        outputInfo.style.color = 'var(--success)';
    }

    function handleClear() {
        outputText.value = '';
        outputInfo.textContent = '';
    }

    async function handleCopy() {
        const text = outputText.value;
        if (!text) {
            showError('No UUIDs to copy');
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

