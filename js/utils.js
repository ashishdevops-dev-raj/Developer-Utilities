/**
 * Shared utility functions used across tools
 */

const Utils = {
    /**
     * Format bytes to human-readable format
     * @param {number} bytes - Number of bytes
     * @returns {string} Formatted string (e.g., "1.5 KB")
     */
    formatBytes: function(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML string
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Show success message to user
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (default: 2000)
     */
    showSuccess: function(message, duration = 2000) {
        const info = document.createElement('div');
        info.className = 'success-message';
        info.textContent = message;
        info.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(info);
        setTimeout(() => {
            info.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => info.remove(), 300);
        }, duration);
    },

    /**
     * Show error message to user
     * @param {string} message - Error message to display
     * @param {number} duration - Duration in milliseconds (default: 3000)
     */
    showError: function(message, duration = 3000) {
        const info = document.createElement('div');
        info.className = 'error-message';
        info.textContent = message;
        info.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(info);
        setTimeout(() => {
            info.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => info.remove(), 300);
        }, duration);
    },

    /**
     * Copy text to clipboard with fallback
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    copyToClipboard: async function(text) {
        if (!text) {
            this.showError('No text to copy');
            return false;
        }

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                this.showSuccess('Copied to clipboard!');
                return true;
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (success) {
                    this.showSuccess('Copied to clipboard!');
                    return true;
                } else {
                    this.showError('Failed to copy to clipboard');
                    return false;
                }
            }
        } catch (error) {
            console.error('Clipboard error:', error);
            this.showError('Failed to copy to clipboard');
            return false;
        }
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Validate file type
     * @param {File} file - File to validate
     * @param {string[]} allowedTypes - Array of allowed MIME types
     * @param {number} maxSize - Maximum file size in bytes
     * @returns {Object} {valid: boolean, error: string}
     */
    validateFile: function(file, allowedTypes = [], maxSize = 10 * 1024 * 1024) {
        if (!file) {
            return { valid: false, error: 'No file selected' };
        }

        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            return { valid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
        }

        if (file.size > maxSize) {
            return { valid: false, error: `File too large. Maximum size: ${this.formatBytes(maxSize)}` };
        }

        return { valid: true, error: null };
    },

    /**
     * Check if Web Crypto API is available
     * @returns {boolean} Availability status
     */
    isCryptoAvailable: function() {
        return !!(window.crypto && window.crypto.subtle);
    },

    /**
     * Check if feature is supported
     * @param {string} feature - Feature name (e.g., 'clipboard', 'crypto')
     * @returns {boolean} Support status
     */
    isFeatureSupported: function(feature) {
        const features = {
            clipboard: !!(navigator.clipboard && navigator.clipboard.writeText),
            crypto: !!(window.crypto && window.crypto.subtle),
            fileReader: !!(window.FileReader),
            canvas: !!(document.createElement('canvas').getContext),
            localStorage: (() => {
                try {
                    localStorage.setItem('test', 'test');
                    localStorage.removeItem('test');
                    return true;
                } catch (e) {
                    return false;
                }
            })()
        };

        return features[feature] || false;
    }
};

// Add CSS animations if not already present
if (!document.getElementById('utils-animations')) {
    const style = document.createElement('style');
    style.id = 'utils-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

