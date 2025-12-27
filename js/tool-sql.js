// SQL Formatter Tool
(function() {
    'use strict';

    const SQL_KEYWORDS = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER',
        'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'LIKE', 'BETWEEN', 'IS', 'NULL',
        'GROUP', 'BY', 'ORDER', 'HAVING', 'UNION', 'ALL', 'DISTINCT', 'AS', 'CASE',
        'WHEN', 'THEN', 'ELSE', 'END', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
        'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'DATABASE',
        'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'DEFAULT', 'AUTO_INCREMENT',
        'LIMIT', 'OFFSET', 'TOP', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'IF', 'CAST'
    ];

    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const formatBtn = document.getElementById('formatBtn');
    const uppercaseBtn = document.getElementById('uppercaseBtn');
    const lowercaseBtn = document.getElementById('lowercaseBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const inputInfo = document.getElementById('inputInfo');
    const outputInfo = document.getElementById('outputInfo');

    let keywordCase = 'upper';

    function init() {
        formatBtn.addEventListener('click', handleFormat);
        uppercaseBtn.addEventListener('click', () => {
            keywordCase = 'upper';
            handleFormat();
        });
        lowercaseBtn.addEventListener('click', () => {
            keywordCase = 'lower';
            handleFormat();
        });
        clearBtn.addEventListener('click', handleClear);
        copyBtn.addEventListener('click', handleCopy);
    }

    function handleFormat() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter SQL query to format');
            return;
        }

        try {
            const formatted = formatSQL(text);
            outputText.value = formatted;
            outputInfo.textContent = '✓ SQL formatted';
            outputInfo.style.color = 'var(--success)';
            inputInfo.textContent = `Input: ${formatBytes(text.length)} characters`;
        } catch (error) {
            showError('Formatting failed: ' + error.message);
        }
    }

    function formatSQL(sql) {
        // Normalize whitespace
        sql = sql.replace(/\s+/g, ' ').trim();

        // Convert keywords to desired case
        const keywordRegex = new RegExp('\\b(' + SQL_KEYWORDS.join('|') + ')\\b', 'gi');
        sql = sql.replace(keywordRegex, (match) => {
            return keywordCase === 'upper' ? match.toUpperCase() : match.toLowerCase();
        });

        // Basic formatting
        sql = sql
            .replace(/\bSELECT\b/gi, '\nSELECT')
            .replace(/\bFROM\b/gi, '\nFROM')
            .replace(/\bWHERE\b/gi, '\nWHERE')
            .replace(/\bJOIN\b/gi, '\nJOIN')
            .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
            .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
            .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
            .replace(/\bFULL JOIN\b/gi, '\nFULL JOIN')
            .replace(/\bON\b/gi, '\n  ON')
            .replace(/\bAND\b/gi, '\n  AND')
            .replace(/\bOR\b/gi, '\n  OR')
            .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
            .replace(/\bORDER BY\b/gi, '\nORDER BY')
            .replace(/\bHAVING\b/gi, '\nHAVING')
            .replace(/\bUNION\b/gi, '\nUNION')
            .replace(/\bLIMIT\b/gi, '\nLIMIT')
            .replace(/\bOFFSET\b/gi, '\nOFFSET')
            .replace(/,/g, ',\n  ')
            .replace(/\(/g, '(\n    ')
            .replace(/\)/g, '\n)')
            .trim();

        // Clean up extra newlines and indent
        const lines = sql.split('\n');
        let indent = 0;
        const formatted = lines.map(line => {
            line = line.trim();
            if (!line) return '';

            // Decrease indent for closing parentheses
            if (line.startsWith(')')) {
                indent = Math.max(0, indent - 1);
            }

            const indented = '  '.repeat(indent) + line;

            // Increase indent for opening parentheses
            if (line.endsWith('(')) {
                indent++;
            }

            return indented;
        }).filter(line => line).join('\n');

        return formatted;
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

