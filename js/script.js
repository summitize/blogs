(() => {
    const yearTargets = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();

    yearTargets.forEach((node) => {
        node.textContent = String(currentYear);
    });

    initializeReadingProgress();
    initializeFeedbackForms();
    initializePdfBookReader();
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

function initializePdfBookReader() {
    const root = document.querySelector('[data-pdf-book]');

    if (!root) {
        return;
    }

    const source = String(root.getAttribute('data-pdf-src') || '').trim();
    const canvas = root.querySelector('[data-pdf-canvas]');
    const prevButton = root.querySelector('[data-pdf-prev]');
    const nextButton = root.querySelector('[data-pdf-next]');
    const fullscreenButton = root.querySelector('[data-pdf-fullscreen]');
    const indicator = root.querySelector('[data-pdf-indicator]');
    const loadingNode = root.querySelector('[data-pdf-loading]');
    const errorNode = root.querySelector('[data-pdf-error]');
    const canvasWrap = root.querySelector('.pdf-canvas-wrap');

    const showError = () => {
        if (loadingNode) {
            loadingNode.hidden = true;
        }

        if (errorNode) {
            errorNode.hidden = false;
        }

        if (prevButton) {
            prevButton.disabled = true;
        }

        if (nextButton) {
            nextButton.disabled = true;
        }

        if (fullscreenButton) {
            fullscreenButton.disabled = true;
        }

        if (indicator) {
            indicator.textContent = 'Preview unavailable';
        }
    };

    if (!source || !canvas || !prevButton || !nextButton || !indicator || !canvasWrap) {
        showError();
        return;
    }

    const pdfjs = window.pdfjsLib;

    if (!pdfjs) {
        showError();
        return;
    }

    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const context = canvas.getContext('2d', { alpha: false });
    let documentRef = null;
    let currentPage = 1;
    let rendering = false;
    let pendingPage = null;

    const updateFullscreenLabel = () => {
        if (!fullscreenButton) {
            return;
        }

        const fullElement = document.fullscreenElement || document.webkitFullscreenElement;
        const isActive = fullElement === root;
        fullscreenButton.textContent = isActive ? 'Exit Full Screen' : 'Full Screen';
        fullscreenButton.setAttribute('aria-label', isActive ? 'Exit full screen' : 'Enter full screen');
    };

    const updateNavState = () => {
        indicator.textContent = `Page ${currentPage} of ${documentRef.numPages}`;
        prevButton.disabled = currentPage <= 1;
        nextButton.disabled = currentPage >= documentRef.numPages;
    };

    const queueRender = (pageNumber) => {
        if (rendering) {
            pendingPage = pageNumber;
            return;
        }

        renderPage(pageNumber);
    };

    const renderPage = async (pageNumber) => {
        if (!documentRef || !context) {
            return;
        }

        rendering = true;

        if (loadingNode) {
            loadingNode.hidden = false;
            loadingNode.textContent = `Loading page ${pageNumber}...`;
        }

        try {
            const page = await documentRef.getPage(pageNumber);
            const availableWidth = Math.max(320, canvasWrap.clientWidth - 20);
            const baseViewport = page.getViewport({ scale: 1 });
            const scale = Math.min(2, availableWidth / baseViewport.width);
            const viewport = page.getViewport({ scale });
            const deviceScale = window.devicePixelRatio || 1;

            canvas.width = Math.floor(viewport.width * deviceScale);
            canvas.height = Math.floor(viewport.height * deviceScale);
            canvas.style.width = `${Math.floor(viewport.width)}px`;
            canvas.style.height = `${Math.floor(viewport.height)}px`;

            const transform = deviceScale !== 1 ? [deviceScale, 0, 0, deviceScale, 0, 0] : null;

            await page.render({
                canvasContext: context,
                viewport,
                transform
            }).promise;

            currentPage = pageNumber;
            updateNavState();

            if (errorNode) {
                errorNode.hidden = true;
            }
        } catch (error) {
            showError();
        } finally {
            rendering = false;

            if (loadingNode) {
                loadingNode.hidden = true;
            }

            if (pendingPage !== null) {
                const nextPending = pendingPage;
                pendingPage = null;
                queueRender(nextPending);
            }
        }
    };

    prevButton.addEventListener('click', () => {
        if (currentPage <= 1) {
            return;
        }

        queueRender(currentPage - 1);
    });

    nextButton.addEventListener('click', () => {
        if (!documentRef || currentPage >= documentRef.numPages) {
            return;
        }

        queueRender(currentPage + 1);
    });

    const requestFullScreen = () => {
        if (root.requestFullscreen) {
            return root.requestFullscreen();
        }

        if (root.webkitRequestFullscreen) {
            return root.webkitRequestFullscreen();
        }

        return Promise.reject(new Error('Fullscreen API not supported'));
    };

    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            return document.exitFullscreen();
        }

        if (document.webkitExitFullscreen) {
            return document.webkitExitFullscreen();
        }

        return Promise.resolve();
    };

    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', () => {
            const fullElement = document.fullscreenElement || document.webkitFullscreenElement;
            const isActive = fullElement === root;

            if (isActive) {
                exitFullScreen().finally(() => {
                    updateFullscreenLabel();
                    queueRender(currentPage);
                });
            } else {
                requestFullScreen()
                    .then(() => {
                        updateFullscreenLabel();
                        queueRender(currentPage);
                    })
                    .catch(() => {
                        fullscreenButton.disabled = true;
                    });
            }
        });

        document.addEventListener('fullscreenchange', () => {
            updateFullscreenLabel();
            queueRender(currentPage);
        });

        document.addEventListener('webkitfullscreenchange', () => {
            updateFullscreenLabel();
            queueRender(currentPage);
        });

        updateFullscreenLabel();
    }

    document.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;
        const tagName = activeElement?.tagName || '';
        const isTyping = tagName === 'INPUT' || tagName === 'TEXTAREA' || activeElement?.isContentEditable;

        if (isTyping) {
            return;
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prevButton.click();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextButton.click();
        }
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => queueRender(currentPage), 120);
    });

    pdfjs.getDocument({ url: source }).promise
        .then((pdfDocument) => {
            documentRef = pdfDocument;
            queueRender(1);
        })
        .catch(() => {
            showError();
        });
}
