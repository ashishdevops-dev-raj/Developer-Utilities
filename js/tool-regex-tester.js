// Regex Tester Tool
(function() {
    'use strict';

    const regexInput = document.getElementById('regexInput');
    const testText = document.getElementById('testText');
    const regexInfo = document.getElementById('regexInfo');
    const matchesOutput = document.getElementById('matchesOutput');
    const copyBtn = document.getElementById('copyBtn');

    function init() {
        regexInput.addEventListener('input', testRegex);
        testText.addEventListener('input', testRegex);
        copyBtn.addEventListener('click', handleCopy);
    }

    function testRegex() {
        const regexStr = regexInput.value.trim();
        const text = testText.value;

        if (!regexStr) {
            matchesOutput.innerHTML = '';
            regexInfo.textContent = '';
            return;
        }

        try {
            // Parse regex pattern and flags
            const match = regexStr.match(/^\/(.+)\/([gimuy]*)$/);
            if (!match) {
                throw new Error('Invalid regex format. Use /pattern/flags');
            }

            const pattern = match[1];
            const flags = match[2] || 'g';
            const regex = new RegExp(pattern, flags);

            if (!text) {
                matchesOutput.innerHTML = '<p class="no-matches">Enter text to test</p>';
                regexInfo.textContent = 'Regex is valid';
                regexInfo.style.color = 'var(--success)';
                return;
            }

            const matches = [...text.matchAll(new RegExp(pattern, flags))];
            
            if (matches.length === 0) {
                matchesOutput.innerHTML = '<p class="no-matches">No matches found</p>';
            } else {
                matchesOutput.innerHTML = matches.map((match, index) => {
                    const highlighted = text.replace(regex, (m) => `<mark>${escapeHtml(m)}</mark>`);
                    return `<div class="match-item">
                        <strong>Match ${index + 1}:</strong> ${highlighted}
                        <div class="match-details">Groups: ${match.length > 1 ? match.slice(1).join(', ') : 'none'}</div>
                    </div>`;
                }).join('');
            }

            regexInfo.textContent = `Found ${matches.length} match${matches.length !== 1 ? 'es' : ''}`;
            regexInfo.style.color = 'var(--success)';
        } catch (error) {
            matchesOutput.innerHTML = `<p class="error-message">Error: ${escapeHtml(error.message)}</p>`;
            regexInfo.textContent = 'Invalid regex';
            regexInfo.style.color = 'var(--error)';
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function handleCopy() {
        const text = matchesOutput.textContent.trim();
        if (!text || text.startsWith('Error') || text.includes('No matches')) {
            Utils.showError('No matches to copy');
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

