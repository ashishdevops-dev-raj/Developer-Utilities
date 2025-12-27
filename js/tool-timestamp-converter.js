// Timestamp Converter Tool
(function() {
    'use strict';

    const timestampInput = document.getElementById('timestampInput');
    const dateInput = document.getElementById('dateInput');
    const convertBtn = document.getElementById('convertBtn');
    const nowBtn = document.getElementById('nowBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const resultsOutput = document.getElementById('resultsOutput');

    function init() {
        convertBtn.addEventListener('click', convertTimestamp);
        nowBtn.addEventListener('click', setNow);
        clearBtn.addEventListener('click', handleClear);
        copyBtn.addEventListener('click', handleCopy);
        timestampInput.addEventListener('input', convertTimestamp);
        dateInput.addEventListener('change', convertFromDate);
    }

    function convertTimestamp() {
        const timestamp = timestampInput.value;
        if (!timestamp) {
            resultsOutput.innerHTML = '';
            return;
        }

        const date = new Date(parseInt(timestamp) * 1000);
        if (isNaN(date.getTime())) {
            resultsOutput.innerHTML = '<p class="error-message">Invalid timestamp</p>';
            return;
        }

        updateResults(date);
        dateInput.value = date.toISOString().slice(0, 16);
    }

    function convertFromDate() {
        const date = new Date(dateInput.value);
        if (isNaN(date.getTime())) {
            return;
        }

        timestampInput.value = Math.floor(date.getTime() / 1000);
        updateResults(date);
    }

    function setNow() {
        const now = new Date();
        timestampInput.value = Math.floor(now.getTime() / 1000);
        dateInput.value = now.toISOString().slice(0, 16);
        updateResults(now);
    }

    function updateResults(date) {
        const timestamp = Math.floor(date.getTime() / 1000);
        const iso = date.toISOString();
        const local = date.toLocaleString();
        const utc = date.toUTCString();

        resultsOutput.innerHTML = `
            <div class="result-item">
                <strong>Unix Timestamp:</strong> ${timestamp}
            </div>
            <div class="result-item">
                <strong>ISO 8601:</strong> ${iso}
            </div>
            <div class="result-item">
                <strong>Local Time:</strong> ${local}
            </div>
            <div class="result-item">
                <strong>UTC:</strong> ${utc}
            </div>
        `;
    }

    function handleClear() {
        timestampInput.value = '';
        dateInput.value = '';
        resultsOutput.innerHTML = '';
    }

    async function handleCopy() {
        const text = resultsOutput.textContent.trim();
        if (!text) {
            Utils.showError('No results to copy');
            return;
        }

        const success = await Utils.copyToClipboard(text);
        if (success) {
            copyBtn.textContent = '✓';
            setTimeout(() => {
                copyBtn.textContent = '📋';
            }, 2000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

