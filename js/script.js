(() => {
    const yearTargets = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();

    yearTargets.forEach((node) => {
        node.textContent = String(currentYear);
    });

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
})();
