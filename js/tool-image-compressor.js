// Image Compressor Tool
(function() {
    'use strict';

    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const maxWidth = document.getElementById('maxWidth');
    const maxHeight = document.getElementById('maxHeight');
    const compressBtn = document.getElementById('compressBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const controlsSection = document.getElementById('controlsSection');
    const previewSection = document.getElementById('previewSection');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalInfo = document.getElementById('originalInfo');
    const compressedInfo = document.getElementById('compressedInfo');

    let originalFile = null;
    let compressedBlob = null;

    function init() {
        fileInput.addEventListener('change', handleFileSelect);
        qualitySlider.addEventListener('input', updateQualityValue);
        compressBtn.addEventListener('click', handleCompress);
        downloadBtn.addEventListener('click', handleDownload);

        // Drag and drop
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
        dropZone.addEventListener('dragleave', handleDragLeave);

        dropZone.addEventListener('click', () => fileInput.click());
    }

    function updateQualityValue() {
        qualityValue.textContent = qualitySlider.value;
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            loadImage(file);
        } else {
            showError('Please select a valid image file');
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--accent-primary)';
        dropZone.style.backgroundColor = 'var(--bg-tertiary)';
    }

    function handleDragLeave(e) {
        e.preventDefault();
        dropZone.style.borderColor = '';
        dropZone.style.backgroundColor = '';
    }

    function handleDrop(e) {
        e.preventDefault();
        dropZone.style.borderColor = '';
        dropZone.style.backgroundColor = '';

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            loadImage(file);
        } else {
            showError('Please drop a valid image file');
        }
    }

    function loadImage(file) {
        originalFile = file;
        const reader = new FileReader();

        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalInfo.textContent = `Size: ${formatBytes(file.size)} | ${file.name}`;
            controlsSection.style.display = 'block';
            previewSection.style.display = 'block';
            compressedImage.src = '';
            compressedInfo.textContent = '';
            compressedBlob = null;
        };

        reader.readAsDataURL(file);
    }

    function handleCompress() {
        if (!originalFile) {
            showError('Please select an image first');
            return;
        }

        const quality = qualitySlider.value / 100;
        const maxW = maxWidth.value ? parseInt(maxWidth.value) : null;
        const maxH = maxHeight.value ? parseInt(maxHeight.value) : null;

        compressBtn.disabled = true;
        compressBtn.textContent = 'Compressing...';

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (maxW || maxH) {
                const ratio = Math.min(
                    maxW ? maxW / width : Infinity,
                    maxH ? maxH / height : Infinity
                );
                if (ratio < 1) {
                    width = width * ratio;
                    height = height * ratio;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    compressedBlob = blob;
                    compressedImage.src = URL.createObjectURL(blob);
                    compressedInfo.textContent = `Size: ${formatBytes(blob.size)} | ${Math.round((1 - blob.size / originalFile.size) * 100)}% smaller`;
                    compressedInfo.style.color = 'var(--success)';
                } else {
                    showError('Compression failed');
                }
                compressBtn.disabled = false;
                compressBtn.textContent = 'Compress';
            }, originalFile.type, quality);
        };

        img.onerror = () => {
            showError('Failed to load image');
            compressBtn.disabled = false;
            compressBtn.textContent = 'Compress';
        };

        img.src = originalImage.src;
    }

    function handleDownload() {
        if (!compressedBlob) {
            showError('Please compress the image first');
            return;
        }

        const url = URL.createObjectURL(compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed-' + originalFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    function showError(message) {
        const info = document.createElement('div');
        info.className = 'error-message';
        info.textContent = message;
        info.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--error); color: white; padding: 1rem; border-radius: 8px; z-index: 1000;';
        document.body.appendChild(info);
        setTimeout(() => info.remove(), 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

