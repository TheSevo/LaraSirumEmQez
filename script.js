document.addEventListener("DOMContentLoaded", () => {
    // 1. Gestion de la musique de fond
    const musicBtn = document.getElementById("music-btn");
    const bgMusic = document.getElementById("bg-music");
    let isPlaying = false;

    if (musicBtn && bgMusic) {
        musicBtn.addEventListener("click", () => {
            if (isPlaying) {
                bgMusic.pause();
                musicBtn.textContent = "🎵 Jouer notre musique";
                musicBtn.classList.remove("playing");
            } else {
                // Gère la promesse de lecture audio (obligatoire sur les navigateurs modernes)
                bgMusic.play().then(() => {
                    musicBtn.textContent = "⏸️ Mettre en pause";
                    musicBtn.classList.add("playing");
                }).catch(error => {
                    console.log("Erreur de lecture audio:", error);
                });
            }
            isPlaying = !isPlaying;
        });
    }

    // 2. Animations fluides au scroll (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // L'animation se déclenche quand 15% de l'élément est visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // L'animation ne se joue qu'une fois
            }
        });
    }, observerOptions);

    // Sélectionne tous les éléments avec la classe 'fade-in-scroll'
    const elementsToFadeIn = document.querySelectorAll(".fade-in-scroll");
    elementsToFadeIn.forEach(el => observer.observe(el));
});