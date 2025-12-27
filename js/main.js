// Main application JavaScript
(function() {
    'use strict';

    // Tools configuration
    const tools = [
        {
            id: 'base64',
            title: 'Base64 Encoder/Decoder',
            description: 'Encode and decode Base64 strings with support for text, files, and URLs',
            icon: '🔐',
            file: 'tools/base64.html'
        },
        {
            id: 'json',
            title: 'JSON Formatter',
            description: 'Format, validate, minify, and beautify JSON data',
            icon: '📋',
            file: 'tools/json.html'
        },
        {
            id: 'xml',
            title: 'XML Formatter',
            description: 'Format and validate XML documents with syntax highlighting',
            icon: '📄',
            file: 'tools/xml.html'
        },
        {
            id: 'sql',
            title: 'SQL Formatter',
            description: 'Format and beautify SQL queries with syntax highlighting',
            icon: '🗄️',
            file: 'tools/sql.html'
        },
        {
            id: 'image-compressor',
            title: 'Image Compressor',
            description: 'Compress images while maintaining quality. Supports JPEG, PNG, WebP',
            icon: '🖼️',
            file: 'tools/image-compressor.html'
        },
        {
            id: 'url-encoder',
            title: 'URL Encoder/Decoder',
            description: 'Encode and decode URL components and query strings',
            icon: '🔗',
            file: 'tools/url-encoder.html'
        },
        {
            id: 'hash-generator',
            title: 'Hash Generator',
            description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text',
            icon: '🔑',
            file: 'tools/hash-generator.html'
        },
        {
            id: 'uuid-generator',
            title: 'UUID Generator',
            description: 'Generate UUIDs (v1, v4) and GUIDs',
            icon: '🆔',
            file: 'tools/uuid-generator.html'
        },
        {
            id: 'jwt-decoder',
            title: 'JWT Decoder',
            description: 'Decode and validate JSON Web Tokens',
            icon: '🎫',
            file: 'tools/jwt-decoder.html'
        },
        {
            id: 'color-picker',
            title: 'Color Picker & Converter',
            description: 'Pick colors and convert between HEX, RGB, HSL formats',
            icon: '🎨',
            file: 'tools/color-picker.html'
        },
        {
            id: 'regex-tester',
            title: 'Regex Tester',
            description: 'Test and debug regular expressions with live matching',
            icon: '🔍',
            file: 'tools/regex-tester.html'
        },
        {
            id: 'text-diff',
            title: 'Text Diff',
            description: 'Compare two texts and highlight differences',
            icon: '📊',
            file: 'tools/text-diff.html'
        },
        {
            id: 'qr-generator',
            title: 'QR Code Generator',
            description: 'Generate QR codes from text, URLs, or other data',
            icon: '📱',
            file: 'tools/qr-generator.html'
        },
        {
            id: 'timestamp-converter',
            title: 'Timestamp Converter',
            description: 'Convert between Unix timestamps and human-readable dates',
            icon: '⏰',
            file: 'tools/timestamp-converter.html'
        },
        {
            id: 'delimiter',
            title: 'Delimiter Converter',
            description: 'Convert between CSV, TSV, semicolon, pipe, and custom delimiters',
            icon: '📊',
            file: 'tools/delimiter.html'
        }
    ];

    // Initialize application
    function init() {
        renderTools();
        setupSearch();
        setupKeyboardNavigation();
    }

    // Render tools grid
    function renderTools(filteredTools = tools) {
        const grid = document.getElementById('toolsGrid');
        const noResults = document.getElementById('noResults');

        if (!grid) return;

        if (filteredTools.length === 0) {
            grid.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        noResults.style.display = 'none';

        grid.innerHTML = filteredTools.map(tool => `
            <a href="${tool.file}" class="tool-card" data-tool-id="${tool.id}" aria-label="${tool.title}">
                <span class="tool-icon" aria-hidden="true">${tool.icon}</span>
                <h3 class="tool-title">${escapeHtml(tool.title)}</h3>
                <p class="tool-description">${escapeHtml(tool.description)}</p>
            </a>
        `).join('');
    }

    // Setup search functionality
    function setupSearch() {
        const searchInput = document.getElementById('toolSearch');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim().toLowerCase();

            searchTimeout = setTimeout(() => {
                if (query === '') {
                    renderTools();
                    return;
                }

                const filtered = tools.filter(tool => {
                    const searchable = `${tool.title} ${tool.description} ${tool.id}`.toLowerCase();
                    return searchable.includes(query);
                });

                renderTools(filtered);
            }, 150);
        });

        // Clear search on Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                renderTools();
                searchInput.blur();
            }
        });
    }

    // Setup keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Focus search with Ctrl/Cmd + K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('toolSearch');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

