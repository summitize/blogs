import { useEffect } from "react";

export default function useReadingProgress() {
  useEffect(() => {
    const progressBar = document.getElementById("readingProgress");
    const article = document.querySelector("[data-article]");

    if (!progressBar || !article) {
      return undefined;
    }

    const updateProgress = () => {
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;

      if (totalScrollable <= 0) {
        progressBar.style.width = "0%";
        return;
      }

      const progress = (window.scrollY / totalScrollable) * 100;
      const clamped = Math.min(100, Math.max(0, progress));
      progressBar.style.width = `${clamped.toFixed(1)}%`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      progressBar.style.width = "0%";
    };
  }, []);
}
