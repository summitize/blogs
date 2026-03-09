(() => {
    const yearTargets = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();

    yearTargets.forEach((node) => {
        node.textContent = String(currentYear);
    });

    initializeReadingProgress();
    initializeFeedbackForms();
})();

function initializeReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    const article = document.querySelector('[data-article]');

    if (!progressBar || !article) {
        return;
    }

    const updateProgress = () => {
        const doc = document.documentElement;
        const totalScrollable = doc.scrollHeight - window.innerHeight;

        if (totalScrollable <= 0) {
            progressBar.style.width = '0%';
            return;
        }

        const progress = (window.scrollY / totalScrollable) * 100;
        const clamped = Math.min(100, Math.max(0, progress));
        progressBar.style.width = `${clamped.toFixed(1)}%`;
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
}

function initializeFeedbackForms() {
    const forms = document.querySelectorAll('[data-feedback-form]');

    if (!forms.length) {
        return;
    }

    forms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const honeypotValue = String(form.elements.company?.value || '').trim();
            const status = form.querySelector('[data-feedback-status]');

            if (honeypotValue) {
                return;
            }

            if (!form.checkValidity()) {
                form.reportValidity();
                setStatus(status, 'Please complete all required fields before submitting.', 'error');
                return;
            }

            const formData = new FormData(form);
            const payload = {
                page: String(formData.get('page') || window.location.pathname),
                name: String(formData.get('name') || '').trim(),
                email: String(formData.get('email') || '').trim(),
                topic: String(formData.get('topic') || '').trim(),
                rating: String(formData.get('rating') || '').trim(),
                message: String(formData.get('message') || '').trim(),
                submittedAt: new Date().toISOString()
            };

            try {
                const storageKey = 'summitize_feedback_entries';
                const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
                stored.unshift(payload);
                localStorage.setItem(storageKey, JSON.stringify(stored.slice(0, 100)));

                form.reset();
                setStatus(status, 'Thank you. Your feedback has been recorded successfully.', 'success');
            } catch (error) {
                setStatus(status, 'Feedback was received, but local storage is unavailable in this browser.', 'error');
            }
        });
    });
}

function setStatus(node, message, type) {
    if (!node) {
        return;
    }

    node.textContent = message;
    node.classList.remove('success', 'error');
    node.classList.add(type);
}
