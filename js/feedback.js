// Feedback functionality with Google Sheets integration
(function() {
    'use strict';

    // Google Apps Script Web App URL - Replace with your actual URL
    const FEEDBACK_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

    let modal = null;
    let form = null;
    let closeBtn = null;
    let cancelBtn = null;
    let feedbackBtn = null;

    function init() {
        modal = document.getElementById('feedbackModal');
        form = document.getElementById('feedbackForm');
        closeBtn = document.getElementById('closeModal');
        cancelBtn = document.getElementById('cancelFeedback');
        feedbackBtn = document.getElementById('feedbackBtn');

        if (!modal || !form) return;

        // Open modal
        if (feedbackBtn) {
            feedbackBtn.addEventListener('click', openModal);
        }

        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Handle form submission
        form.addEventListener('submit', handleSubmit);
    }

    function openModal() {
        if (!modal) return;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus first input
        const firstInput = form.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        form.reset();
        document.body.style.overflow = '';
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Disable form during submission
        form.querySelectorAll('input, select, textarea, button').forEach(el => {
            el.disabled = true;
        });
        submitBtn.textContent = 'Sending...';

        const formData = {
            type: document.getElementById('feedbackType').value,
            message: document.getElementById('feedbackMessage').value.trim(),
            email: document.getElementById('feedbackEmail').value.trim() || 'anonymous',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        try {
            // Check if API URL is configured
            if (FEEDBACK_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
                // Fallback: Store in localStorage if API not configured
                storeFeedbackLocally(formData);
                showMessage('Feedback saved locally. Please configure Google Apps Script URL for cloud storage.', 'success');
            } else {
                await sendFeedback(formData);
                showMessage('Thank you for your feedback!', 'success');
            }

            setTimeout(() => {
                closeModal();
            }, 1500);
        } catch (error) {
            console.error('Feedback submission error:', error);
            showMessage('Failed to send feedback. Please try again.', 'error');
        } finally {
            // Re-enable form
            form.querySelectorAll('input, select, textarea, button').forEach(el => {
                el.disabled = false;
            });
            submitBtn.textContent = originalText;
        }
    }

    async function sendFeedback(data) {
        if (!FEEDBACK_API_URL || FEEDBACK_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            throw new Error('Feedback API not configured');
        }

        const response = await fetch(FEEDBACK_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    function storeFeedbackLocally(data) {
        try {
            const stored = JSON.parse(localStorage.getItem('feedback_queue') || '[]');
            stored.push(data);
            // Keep only last 50 feedback items
            if (stored.length > 50) {
                stored.shift();
            }
            localStorage.setItem('feedback_queue', JSON.stringify(stored));
        } catch (error) {
            console.error('Failed to store feedback locally:', error);
        }
    }

    function showMessage(message, type) {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `feedback-message feedback-message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

