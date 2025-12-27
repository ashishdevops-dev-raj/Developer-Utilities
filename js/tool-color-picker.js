// Color Picker Tool
(function() {
    'use strict';

    const colorPicker = document.getElementById('colorPicker');
    const colorPreview = document.getElementById('colorPreview');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');

    function init() {
        colorPicker.addEventListener('input', updateFromPicker);
        hexValue.addEventListener('input', updateFromHex);
        rgbValue.addEventListener('input', updateFromRGB);
        hslValue.addEventListener('input', updateFromHSL);
        
        // Copy buttons
        document.querySelectorAll('[data-format]').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.getAttribute('data-format');
                let value = '';
                if (format === 'hex') value = hexValue.value;
                else if (format === 'rgb') value = rgbValue.value;
                else if (format === 'hsl') value = hslValue.value;
                handleCopy(value, btn);
            });
        });
        
        updateFromPicker();
    }

    function updateFromPicker() {
        const hex = colorPicker.value;
        updateAllFormats(hex);
    }

    function updateFromHex() {
        let hex = hexValue.value.trim();
        if (!hex.startsWith('#')) hex = '#' + hex;
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            colorPicker.value = hex;
            updateAllFormats(hex);
        }
    }

    function updateFromRGB() {
        const rgb = rgbValue.value.match(/\d+/g);
        if (rgb && rgb.length === 3) {
            const r = parseInt(rgb[0]);
            const g = parseInt(rgb[1]);
            const b = parseInt(rgb[2]);
            if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
                const hex = rgbToHex(r, g, b);
                colorPicker.value = hex;
                updateAllFormats(hex);
            }
        }
    }

    function updateFromHSL() {
        const hsl = hslValue.value.match(/\d+/g);
        if (hsl && hsl.length === 3) {
            const h = parseInt(hsl[0]);
            const s = parseInt(hsl[1]);
            const l = parseInt(hsl[2]);
            if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
                const rgb = hslToRgb(h, s, l);
                const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
                colorPicker.value = hex;
                updateAllFormats(hex);
            }
        }
    }

    function updateAllFormats(hex) {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        
        hexValue.value = hex.toUpperCase();
        rgbValue.value = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        hslValue.value = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
        colorPreview.style.backgroundColor = hex;
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }

    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    async function handleCopy(text, button) {
        if (!text) {
            Utils.showError('No value to copy');
            return;
        }

        const success = await Utils.copyToClipboard(text);
        if (success) {
            button.textContent = '✓';
            setTimeout(() => {
                button.textContent = '📋';
            }, 2000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

