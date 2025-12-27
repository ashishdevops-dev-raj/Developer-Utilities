// Text Diff Tool
(function() {
    'use strict';

    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const diffOutput = document.getElementById('diffOutput');
    const copyBtn = document.getElementById('copyBtn');

    function init() {
        text1.addEventListener('input', computeDiff);
        text2.addEventListener('input', computeDiff);
        copyBtn.addEventListener('click', handleCopy);
    }

    function computeDiff() {
        const str1 = text1.value;
        const str2 = text2.value;

        if (!str1 && !str2) {
            diffOutput.innerHTML = '';
            return;
        }

        const diff = simpleDiff(str1, str2);
        diffOutput.innerHTML = diff;
    }

    function simpleDiff(str1, str2) {
        const lines1 = str1.split('\n');
        const lines2 = str2.split('\n');
        const maxLen = Math.max(lines1.length, lines2.length);
        let html = '';

        for (let i = 0; i < maxLen; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';

            if (line1 === line2) {
                html += `<div class="diff-line same">${escapeHtml(line1 || ' ')}</div>`;
            } else {
                if (line1) {
                    html += `<div class="diff-line removed">- ${escapeHtml(line1)}</div>`;
                }
                if (line2) {
                    html += `<div class="diff-line added">+ ${escapeHtml(line2)}</div>`;
                }
            }
        }

        return html || '<p class="no-diff">Texts are identical</p>';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function handleCopy() {
        const text = diffOutput.textContent.trim();
        if (!text || text === 'Texts are identical') {
            Utils.showError('No diff to copy');
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

