// Delimiter Converter Tool
(function() {
    'use strict';

    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const inputDelimiter = document.getElementById('inputDelimiter');
    const outputDelimiter = document.getElementById('outputDelimiter');
    const inputCustom = document.getElementById('inputCustom');
    const outputCustom = document.getElementById('outputCustom');
    const convertBtn = document.getElementById('convertBtn');
    const removeNewlines = document.getElementById('removeNewlines');
    const removeDuplicates = document.getElementById('removeDuplicates');
    const interval = document.getElementById('interval');
    const addQuotes = document.getElementById('addQuotes');
    const openTag = document.getElementById('openTag');
    const closeTag = document.getElementById('closeTag');
    const textBoxHeight = document.getElementById('textBoxHeight');
    const heightValue = document.getElementById('heightValue');
    const errorSection = document.getElementById('errorSection');
    const errorBox = document.getElementById('errorBox');

    function init() {
        convertBtn.addEventListener('click', handleConvert);
        
        inputDelimiter.addEventListener('change', () => {
            inputCustom.style.display = inputDelimiter.value === 'custom' ? 'block' : 'none';
        });
        
        outputDelimiter.addEventListener('change', () => {
            outputCustom.style.display = outputDelimiter.value === 'custom' ? 'block' : 'none';
        });

        // Auto-convert on input (debounced)
        const debouncedConvert = Utils.debounce(handleConvert, 500);
        inputText.addEventListener('input', debouncedConvert);
        
        // Auto-convert on settings change
        [removeNewlines, removeDuplicates, interval, addQuotes, openTag, closeTag].forEach(element => {
            if (element) {
                element.addEventListener('change', handleConvert);
                element.addEventListener('input', debouncedConvert);
            }
        });

        // Text box height slider
        textBoxHeight.addEventListener('input', (e) => {
            const height = e.target.value;
            heightValue.textContent = height + 'px';
            inputText.style.height = height + 'px';
            outputText.style.height = height + 'px';
        });

        // Set initial height
        const initialHeight = textBoxHeight.value;
        inputText.style.height = initialHeight + 'px';
        outputText.style.height = initialHeight + 'px';
    }

    function handleConvert() {
        const input = inputText.value.trim();
        
        if (!input) {
            outputText.value = '';
            hideError();
            return;
        }

        try {
            const inputDelim = getDelimiter(inputDelimiter.value, inputCustom.value);
            const outputDelim = getDelimiter(outputDelimiter.value, outputCustom.value);

            if (!inputDelim && inputDelimiter.value !== '\\n') {
                throw new Error('Input delimiter cannot be empty');
            }
            if (!outputDelim && outputDelimiter.value !== '\\n') {
                throw new Error('Output delimiter cannot be empty');
            }

            // Parse the input
            let items = parseInput(input, inputDelim);
            
            if (items.length === 0) {
                throw new Error('No data found. Please check your input format.');
            }

            // Apply processing options
            if (removeDuplicates.checked) {
                items = removeDuplicateItems(items);
            }

            // Apply quotes to items
            items = applyQuotes(items, addQuotes.value, outputDelim);

            // Apply wrap tags to items
            if (openTag.value.trim() || closeTag.value.trim()) {
                items = items.map(item => {
                    const open = openTag.value.trim() || '';
                    const close = closeTag.value.trim() || '';
                    return open + item + close;
                });
            }

            // Apply interval (insert delimiter every N items)
            const intervalValue = parseInt(interval.value) || 0;
            if (intervalValue > 0 && items.length > intervalValue) {
                items = applyInterval(items, intervalValue);
            }
            
            // Convert to output format
            let output = convertItems(items, outputDelim);
            
            // Remove newlines if requested
            if (removeNewlines.checked) {
                output = output.replace(/\r?\n/g, '');
            }
            
            outputText.value = output;
            hideError();
        } catch (error) {
            showError(error.message);
            outputText.value = '';
        }
    }

    function parseInput(text, delimiter) {
        if (!delimiter || delimiter === '\\n' || delimiter === '\n') {
            // Split by newlines
            return text.split(/\r?\n/).map(item => item.trim()).filter(item => item.length > 0);
        } else {
            // Split by delimiter
            const regex = new RegExp(delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            return text.split(regex).map(item => item.trim()).filter(item => item.length > 0);
        }
    }

    function convertItems(items, delimiter) {
        if (!delimiter || delimiter === '\\n' || delimiter === '\n') {
            return items.join('\n');
        } else {
            return items.join(delimiter);
        }
    }

    function removeDuplicateItems(items) {
        const seen = new Set();
        return items.filter(item => {
            if (seen.has(item)) {
                return false;
            }
            seen.add(item);
            return true;
        });
    }

    function applyInterval(items, intervalValue) {
        // Insert empty string as separator every N items to create visual grouping
        const result = [];
        for (let i = 0; i < items.length; i++) {
            result.push(items[i]);
            // Insert empty item after every N items (except the last) to create double delimiter
            if ((i + 1) % intervalValue === 0 && i < items.length - 1) {
                result.push('');
            }
        }
        return result;
    }

    function applyQuotes(items, quoteType, delimiter) {
        if (quoteType === 'none') {
            return items;
        }
        
        const quoteChar = quoteType === 'single' ? "'" : '"';
        return items.map(item => quoteChar + item + quoteChar);
    }


    function getDelimiter(selected, custom) {
        if (selected === 'custom') {
            return custom || '';
        }
        // Handle special characters
        if (selected === '\\t' || selected === '\t' || selected === 'tab') {
            return '\t';
        }
        if (selected === '\\n' || selected === '\n') {
            return '\n';
        }
        return selected;
    }

    function showError(message) {
        errorBox.textContent = 'Error: ' + message;
        errorSection.style.display = 'block';
        errorBox.style.cssText = `
            background: var(--bg-tertiary);
            border: 1px solid var(--error);
            border-radius: 8px;
            padding: 1rem;
            color: var(--error);
            margin-top: 1rem;
        `;
    }

    function hideError() {
        errorSection.style.display = 'none';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
