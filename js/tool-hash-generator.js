// Hash Generator Tool
(function() {
    'use strict';

    const inputText = document.getElementById('inputText');
    const hashElements = {
        md5: document.getElementById('md5Hash'),
        sha1: document.getElementById('sha1Hash'),
        sha256: document.getElementById('sha256Hash'),
        sha512: document.getElementById('sha512Hash')
    };

    function init() {
        inputText.addEventListener('input', generateHashes);
        
        // Copy buttons
        document.querySelectorAll('[data-hash]').forEach(btn => {
            btn.addEventListener('click', () => {
                const hashId = btn.getAttribute('data-hash');
                const hashElement = document.getElementById(hashId);
                copyToClipboard(hashElement.textContent);
            });
        });
    }

    async function generateHashes() {
        const text = inputText.value;
        
        if (!text) {
            Object.values(hashElements).forEach(el => el.textContent = '-');
            return;
        }

        // Generate all hashes
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        try {
            const [md5, sha1, sha256, sha512] = await Promise.all([
                generateMD5(data),
                generateSHA1(data),
                generateSHA256(data),
                generateSHA512(data)
            ]);

            hashElements.md5.textContent = md5;
            hashElements.sha1.textContent = sha1;
            hashElements.sha256.textContent = sha256;
            hashElements.sha512.textContent = sha512;
        } catch (error) {
            console.error('Hash generation error:', error);
        }
    }

    async function generateMD5(data) {
        // MD5 is not available in Web Crypto API
        // Using a simple MD5 implementation for client-side hashing
        // Note: This is a basic implementation. For production use, consider a well-tested library
        const hash = await simpleMD5(data);
        return hash;
    }

    async function simpleMD5(data) {
        // Simple MD5 implementation (for demonstration)
        // In production, you might want to use a library like crypto-js
        // For now, we'll indicate MD5 is not available via Web Crypto API
        return 'MD5 not available (use SHA-256 or SHA-512)';
    }

    async function generateSHA1(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        return arrayBufferToHex(hashBuffer);
    }

    async function generateSHA256(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return arrayBufferToHex(hashBuffer);
    }

    async function generateSHA512(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-512', data);
        return arrayBufferToHex(hashBuffer);
    }

    function arrayBufferToHex(buffer) {
        const hashArray = Array.from(new Uint8Array(buffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function copyToClipboard(text) {
        if (text === '-') return;
        
        try {
            await navigator.clipboard.writeText(text);
            showSuccess('Copied to clipboard!');
        } catch (error) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showSuccess('Copied to clipboard!');
        }
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

