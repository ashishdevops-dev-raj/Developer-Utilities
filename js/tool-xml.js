// XML Formatter Tool
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
    }

    function handleFormat() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter XML to format');
            return;
        }

        try {
            const formatted = formatXML(text);
            outputText.value = formatted;
            outputInfo.textContent = '✓ XML formatted';
            outputInfo.style.color = 'var(--success)';
            inputInfo.textContent = `Input: ${formatBytes(text.length)} characters`;
        } catch (error) {
            showError('Invalid XML: ' + error.message);
        }
    }

    function handleMinify() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter XML to minify');
            return;
        }

        try {
            const minified = minifyXML(text);
            outputText.value = minified;
            outputInfo.textContent = `Minified: ${formatBytes(minified.length)} characters`;
            outputInfo.style.color = 'var(--success)';
            inputInfo.textContent = `Original: ${formatBytes(text.length)} characters`;
        } catch (error) {
            showError('Invalid XML: ' + error.message);
        }
    }

    function handleValidate() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter XML to validate');
            return;
        }

        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            const errorNode = xmlDoc.querySelector('parsererror');
            
            if (errorNode) {
                throw new Error(errorNode.textContent);
            }

            outputText.value = '✓ Valid XML';
            outputInfo.textContent = 'Validation successful';
            outputInfo.style.color = 'var(--success)';
            inputInfo.textContent = `Input: ${formatBytes(text.length)} characters`;
        } catch (error) {
            outputText.value = '✗ Invalid XML\n\n' + error.message;
            showError('Validation failed: ' + error.message);
        }
    }

    function formatXML(xml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');
        const errorNode = xmlDoc.querySelector('parsererror');
        
        if (errorNode) {
            throw new Error(errorNode.textContent);
        }

        return formatNode(xmlDoc.documentElement, 0);
    }

    function formatNode(node, indent) {
        const indentStr = '  '.repeat(indent);
        let result = indentStr + '<' + node.nodeName;

        // Add attributes
        if (node.attributes && node.attributes.length > 0) {
            for (let i = 0; i < node.attributes.length; i++) {
                const attr = node.attributes[i];
                result += ' ' + attr.name + '="' + escapeXml(attr.value) + '"';
            }
        }

        // Handle child nodes
        const children = Array.from(node.childNodes).filter(n => 
            n.nodeType === Node.ELEMENT_NODE || 
            (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
        );

        if (children.length === 0) {
            result += ' />\n';
        } else if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
            result += '>' + escapeXml(children[0].textContent.trim()) + '</' + node.nodeName + '>\n';
        } else {
            result += '>\n';
            children.forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    result += formatNode(child, indent + 1);
                } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
                    result += indentStr + '  ' + escapeXml(child.textContent.trim()) + '\n';
                }
            });
            result += indentStr + '</' + node.nodeName + '>\n';
        }

        return result;
    }

    function minifyXML(xml) {
        return xml.replace(/>\s+</g, '><').trim();
    }

    function escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
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

