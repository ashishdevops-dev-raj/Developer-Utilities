// QR Code Generator Tool
(function() {
    'use strict';

    const inputText = document.getElementById('inputText');
    const qrOutput = document.getElementById('qrOutput');
    const qrControls = document.getElementById('qrControls');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let currentQRImageUrl = null;
    let currentQRBlob = null;

    function init() {
        inputText.addEventListener('input', generateQR);
        downloadBtn.addEventListener('click', handleDownload);
    }

    async function generateQR() {
        const text = inputText.value.trim();
        
        if (!text) {
            qrOutput.innerHTML = '<p class="qr-placeholder">Enter text above to generate QR code</p>';
            qrControls.style.display = 'none';
            currentQRImageUrl = null;
            currentQRBlob = null;
            return;
        }

        // Generate QR code using external service (client-side only)
        // Note: For fully offline use, consider implementing client-side QR generation
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
        
        try {
            // Fetch the image as blob for download capability
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            currentQRBlob = blob;
            currentQRImageUrl = URL.createObjectURL(blob);
            
            qrOutput.innerHTML = `
                <img id="qrImage" src="${currentQRImageUrl}" alt="QR Code" style="max-width: 100%; height: auto; border-radius: 8px;">
                <p style="margin-top: 1rem; text-align: center; color: var(--text-secondary);">
                    Scan this QR code with your device
                </p>
            `;
            qrControls.style.display = 'flex';
        } catch (error) {
            qrOutput.innerHTML = `
                <p class="qr-placeholder" style="color: var(--error);">
                    Failed to generate QR code. Please check your connection.
                </p>
            `;
            qrControls.style.display = 'none';
            console.error('QR generation error:', error);
        }
    }

    function handleDownload() {
        if (!currentQRBlob) {
            Utils.showError('No QR code to download');
            return;
        }

        const url = URL.createObjectURL(currentQRBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrcode-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Utils.showSuccess('QR code downloaded!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

