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

    // 3. Compteur de jours de la relation
    // ⚠️ Modifiez cette date avec la date de votre rencontre (Année-Mois-Jour)
    const dateRencontre = new Date("2021-06-15T00:00:00").getTime();

    function updateCounter() {
        const now = new Date().getTime();
        const difference = now - dateRencontre;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        if (daysEl) { // S'assure que les éléments existent sur la page
            daysEl.innerText = days;
            document.getElementById("hours").innerText = hours;
            document.getElementById("minutes").innerText = minutes;
            document.getElementById("seconds").innerText = seconds;
        }
    }

    // Met à jour le compteur chaque seconde
    setInterval(updateCounter, 1000);
    updateCounter(); // Appel immédiat pour éviter le "0" au chargement
});
