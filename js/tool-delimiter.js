// Delimiter Converter Tool
(function() {
    'use strict';

    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const sourceDelimiter = document.getElementById('sourceDelimiter');
    const targetDelimiter = document.getElementById('targetDelimiter');
    const sourceCustom = document.getElementById('sourceCustom');
    const targetCustom = document.getElementById('targetCustom');
    const convertBtn = document.getElementById('convertBtn');
    const swapBtn = document.getElementById('swapBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const inputInfo = document.getElementById('inputInfo');
    const outputInfo = document.getElementById('outputInfo');
    const errorSection = document.getElementById('errorSection');
    const errorBox = document.getElementById('errorBox');

    function init() {
        convertBtn.addEventListener('click', handleConvert);
        swapBtn.addEventListener('click', handleSwap);
        clearBtn.addEventListener('click', handleClear);
        copyBtn.addEventListener('click', handleCopy);
        
        sourceDelimiter.addEventListener('change', () => {
            sourceCustom.style.display = sourceDelimiter.value === 'custom' ? 'block' : 'none';
        });
        
        targetDelimiter.addEventListener('change', () => {
            targetCustom.style.display = targetDelimiter.value === 'custom' ? 'block' : 'none';
        });

        // Auto-convert on input (debounced)
        const debouncedConvert = Utils.debounce(handleConvert, 500);
        inputText.addEventListener('input', debouncedConvert);
    }

    function handleConvert() {
        const input = inputText.value.trim();
        
        if (!input) {
            outputText.value = '';
            inputInfo.textContent = '';
            outputInfo.textContent = '';
            hideError();
            return;
        }

        try {
            const sourceDelim = getDelimiter(sourceDelimiter.value, sourceCustom.value);
            const targetDelim = getDelimiter(targetDelimiter.value, targetCustom.value);

            if (!sourceDelim) {
                throw new Error('Source delimiter cannot be empty');
            }
            if (!targetDelim) {
                throw new Error('Target delimiter cannot be empty');
            }

            // Parse the input
            const rows = parseDelimitedText(input, sourceDelim);
            
            if (rows.length === 0) {
                throw new Error('No data found. Please check your input format.');
            }

            // Convert to target delimiter
            const output = convertDelimiters(rows, targetDelim);
            
            outputText.value = output;
            
            // Update info
            const rowCount = rows.length;
            const colCount = rows[0] ? rows[0].length : 0;
            inputInfo.textContent = `Input: ${rowCount} row${rowCount !== 1 ? 's' : ''}, ${colCount} column${colCount !== 1 ? 's' : ''}`;
            outputInfo.textContent = `Output: ${rowCount} row${rowCount !== 1 ? 's' : ''}, ${colCount} column${colCount !== 1 ? 's' : ''}`;
            outputInfo.style.color = 'var(--success)';
            
            hideError();
            
            // Auto-copy to clipboard
            if (output) {
                setTimeout(async () => {
                    await Utils.copyToClipboard(output);
                    copyBtn.textContent = '✓ Copied';
                    setTimeout(() => {
                        copyBtn.textContent = '📋';
                    }, 2000);
                }, 300);
            }
        } catch (error) {
            showError(error.message);
            outputText.value = '';
            outputInfo.textContent = '';
        }
    }

    function parseDelimitedText(text, delimiter) {
        const rows = [];
        const lines = text.split(/\r?\n/);
        let currentRow = [];
        let currentField = '';
        let inQuotes = false;

        for (const line of lines) {
            if (line.trim() === '' && !inQuotes) {
                // Empty line - add empty row if we have data, otherwise skip
                if (currentRow.length > 0 || currentField) {
                    if (currentField) {
                        currentRow.push(currentField.trim());
                        currentField = '';
                    }
                    if (currentRow.length > 0) {
                        rows.push(currentRow);
                        currentRow = [];
                    }
                }
                continue;
            }

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                const nextChar = line[j + 1];

                if (char === '"') {
                    if (inQuotes && nextChar === '"') {
                        // Escaped quote (double quote)
                        currentField += '"';
                        j++; // Skip next quote
                    } else if (inQuotes && (nextChar === delimiter || nextChar === '\r' || nextChar === '\n' || nextChar === undefined || j === line.length - 1)) {
                        // End of quoted field
                        inQuotes = false;
                    } else if (!inQuotes) {
                        // Start of quoted field
                        inQuotes = true;
                    } else {
                        // Quote inside quoted field (shouldn't happen, but handle it)
                        currentField += char;
                    }
                } else if (char === delimiter && !inQuotes) {
                    // Field delimiter found
                    currentRow.push(currentField.trim());
                    currentField = '';
                } else {
                    currentField += char;
                }
            }

            // Check if we're still in quotes (line continuation)
            if (!inQuotes) {
                // End of line, add current field
                currentRow.push(currentField.trim());
                currentField = '';
                
                if (currentRow.length > 0) {
                    rows.push(currentRow);
                    currentRow = [];
                }
            } else {
                // Still in quotes, add newline and continue
                currentField += '\n';
            }
        }

        // Handle remaining field/row
        if (currentField || currentRow.length > 0) {
            if (currentField) {
                currentRow.push(currentField.trim());
            }
            if (currentRow.length > 0) {
                rows.push(currentRow);
            }
        }

        // Normalize row lengths (pad with empty strings)
        if (rows.length > 0) {
            const maxCols = Math.max(...rows.map(r => r.length));
            rows.forEach(row => {
                while (row.length < maxCols) {
                    row.push('');
                }
            });
        }

        return rows;
    }

    function convertDelimiters(rows, delimiter) {
        return rows.map(row => {
            return row.map(field => {
                // Determine if field needs quoting
                const needsQuotes = field.includes(delimiter) || 
                                   field.includes('"') || 
                                   field.includes('\n') || 
                                   field.includes('\r') ||
                                   field.trim() !== field;
                
                if (needsQuotes) {
                    // Escape quotes and wrap in quotes
                    const escaped = field.replace(/"/g, '""');
                    return `"${escaped}"`;
                }
                return field;
            }).join(delimiter);
        }).join('\n');
    }

    function getDelimiter(selected, custom) {
        if (selected === 'custom') {
            return custom || '';
        }
        // Handle special characters - check for tab in various formats
        if (selected === '\\t' || selected === '\t' || selected === 'tab') {
            return '\t';
        }
        return selected;
    }

    function handleSwap() {
        const sourceValue = sourceDelimiter.value;
        const targetValue = targetDelimiter.value;
        const sourceCustomValue = sourceCustom.value;
        const targetCustomValue = targetCustom.value;

        // Swap select values
        sourceDelimiter.value = targetValue;
        targetDelimiter.value = sourceValue;

        // Swap custom inputs
        sourceCustom.value = targetCustomValue;
        targetCustom.value = sourceCustomValue;

        // Update visibility
        sourceCustom.style.display = sourceDelimiter.value === 'custom' ? 'block' : 'none';
        targetCustom.style.display = targetDelimiter.value === 'custom' ? 'block' : 'none';

        // Re-convert if there's input
        if (inputText.value.trim()) {
            handleConvert();
        }
    }

    function handleClear() {
        inputText.value = '';
        outputText.value = '';
        inputInfo.textContent = '';
        outputInfo.textContent = '';
        hideError();
        inputText.focus();
    }

    async function handleCopy() {
        const text = outputText.value;
        if (!text) {
            Utils.showError('No output to copy');
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

