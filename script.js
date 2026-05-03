document.addEventListener("DOMContentLoaded", () => {
    // 1. Gestion de la playlist
    const playlistBtn = document.getElementById("playlist-btn");
    const playlistMenu = document.getElementById("playlist-menu");
    const bgMusic = document.getElementById("bg-music");
    const playlistItems = document.querySelectorAll("#playlist-menu li");
    let isPlaying = false;

    const audioProgress = document.getElementById("audio-progress");
    const currentTimeEl = document.getElementById("current-time");
    const totalTimeEl = document.getElementById("total-time");

    if (playlistBtn && playlistMenu) {
        // Ouvrir/Fermer le menu
        playlistBtn.addEventListener("click", (e) => {
            playlistMenu.classList.toggle("show");
            e.stopPropagation();
        });

        // Fermer le menu si on clique ailleurs sur la page
        document.addEventListener("click", (e) => {
            if (!playlistMenu.contains(e.target) && e.target !== playlistBtn) {
                playlistMenu.classList.remove("show");
            }
        });
    }

    if (playlistItems.length > 0 && bgMusic) {
        playlistItems.forEach(item => {
            item.addEventListener("click", () => {
                const src = item.getAttribute("data-src");
                
                if (item.classList.contains("active")) {
                    // Clic sur la chanson en cours : Play/Pause
                    if (isPlaying) {
                        bgMusic.pause();
                        isPlaying = false;
                        playlistBtn.classList.remove("playing");
                        item.classList.remove("playing-anim");
                    } else {
                        bgMusic.play();
                        isPlaying = true;
                        playlistBtn.classList.add("playing");
                        item.classList.add("playing-anim");
                    }
                } else {
                    // Nouvelle chanson
                    playlistItems.forEach(li => {
                        li.classList.remove("active");
                        li.classList.remove("playing-anim");
                    });
                    item.classList.add("active");
                    item.classList.add("playing-anim");
                    bgMusic.src = src;
                    bgMusic.play().then(() => {
                        playlistBtn.classList.add("playing");
                        isPlaying = true;
                    }).catch(error => console.log("Erreur de lecture audio:", error));
                }
            });
        });

        // Passage automatique à la musique suivante à la fin de la piste
        bgMusic.addEventListener("ended", () => {
            let currentIndex = -1;
            playlistItems.forEach((item, index) => {
                if (item.classList.contains("active")) {
                    currentIndex = index;
                }
            });

            if (currentIndex !== -1) {
                const nextIndex = (currentIndex + 1) % playlistItems.length;
                playlistItems[nextIndex].click(); // Déclenche la chanson suivante
            }
        });

        // Formatage du temps en minutes:secondes (ex: 2:05)
        function formatTime(seconds) {
            if (isNaN(seconds)) return "0:00";
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }

        // Mise à jour de la barre de progression
        bgMusic.addEventListener("timeupdate", () => {
            if (bgMusic.duration) {
                audioProgress.value = (bgMusic.currentTime / bgMusic.duration) * 100;
                currentTimeEl.textContent = formatTime(bgMusic.currentTime);
            }
        });

        bgMusic.addEventListener("loadedmetadata", () => {
            totalTimeEl.textContent = formatTime(bgMusic.duration);
        });

        // Avancer/Reculer manuellement avec la barre
        audioProgress.addEventListener("input", (e) => {
            if (bgMusic.duration) {
                bgMusic.currentTime = (e.target.value / 100) * bgMusic.duration;
            }
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
                
                // Retire le délai d'apparition après l'animation pour que les survols (hover) soient instantanés
                if (entry.target.style.transitionDelay) {
                    const delayStr = entry.target.style.transitionDelay;
                    const delayMs = (parseFloat(delayStr) || 0) * 1000;
                    setTimeout(() => {
                        entry.target.style.transitionDelay = '0s';
                    }, delayMs + 800); // délai initial + durée de l'animation d'apparition (0.8s)
                }
                
                observer.unobserve(entry.target); // L'animation ne se joue qu'une fois
            }
        });
    }, observerOptions);

    // Sélectionne tous les éléments avec la classe 'fade-in-scroll'
    const elementsToFadeIn = document.querySelectorAll(".fade-in-scroll");
    elementsToFadeIn.forEach(el => observer.observe(el));

    // 4. Compteur de jours de la relation
    // ⚠️ Modifiez cette date avec la date de votre rencontre (Année-Mois-Jour)
    const dateRencontre = new Date("2022-08-12T16:50:00").getTime();
    
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateCounter() {
        if (!daysEl) return; // S'assure que les éléments existent
        
        const now = new Date().getTime();
        const difference = now - dateRencontre;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.innerText = days;
        if (hoursEl) hoursEl.innerText = hours;
        if (minutesEl) minutesEl.innerText = minutes;
        if (secondsEl) secondsEl.innerText = seconds;
    }

    // Met à jour le compteur chaque seconde
    setInterval(updateCounter, 1000);
    updateCounter(); // Appel immédiat pour éviter le "0" au chargement

    // 5. Gestion du mot de passe
    const passwordForm = document.getElementById("password-form");
    const passwordInput = document.getElementById("secret-password");
    const passwordOverlay = document.getElementById("password-overlay");
    const passwordError = document.getElementById("password-error");

    // ⚠️ Remplacez par vos 2 emojis réels
    const secretMotDePasse = "❤️🥑";

    if (passwordForm) {
        passwordForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Empêche la page de se recharger
            if (passwordInput.value === secretMotDePasse) {
                passwordOverlay.classList.add("hidden");
                document.body.classList.remove("locked"); // Débloque le défilement

                // Lancement automatique de la musique
                if (bgMusic && playlistItems.length > 0) {
                    const firstSong = playlistItems[0];
                    firstSong.classList.add("active");
                    firstSong.classList.add("playing-anim");
                    bgMusic.src = firstSong.getAttribute("data-src");
                    bgMusic.play().then(() => {
                        if(playlistBtn) playlistBtn.classList.add("playing");
                        isPlaying = true;
                    }).catch(error => console.log("Erreur de lecture audio:", error));
                }
            } else {
                passwordError.style.display = "block"; // Affiche l'erreur
                passwordInput.value = ""; // Vide le champ pour réessayer
            }
        });
    }

    // 6. Gestion du Mode Nuit (Ciel étoilé)
    const themeToggle = document.getElementById("theme-toggle");
    const nightModeHint = document.querySelector(".night-mode-hint");

    // Vérifie si le mode nuit a déjà été découvert lors d'une précédente visite
    if (localStorage.getItem("nightModeDiscovered") === "true") {
        if (nightModeHint) nightModeHint.remove();
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("night-mode");
            document.documentElement.classList.toggle("night-mode"); // Ajouté pour cibler la scrollbar
            
            // Supprime définitivement le message après le premier clic
            if (nightModeHint && nightModeHint.parentNode) {
                nightModeHint.remove();
                localStorage.setItem("nightModeDiscovered", "true"); // Mémorise l'action
            }
        });
    }

    // 7. Lightbox pour la galerie (Plein écran)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-grid img');

    if (lightbox && lightboxImg && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden'; // Empêche de défiler en arrière-plan
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = ''; // Rétablit le défilement
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) closeLightbox(); // Ferme si on clique à côté de l'image
        });
    }

    // 3 & 8. Optimisation du Scroll : Smart Navbar et Scroll Progress
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById("scroll-progress");
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Mise à jour de la barre de progression
                if (scrollProgress) {
                    const totalScroll = document.documentElement.scrollTop;
                    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    scrollProgress.style.width = `${(totalScroll / windowHeight) * 100}%`;
                }

                // Mise à jour de la Smart Navbar
                if (navbar) {
                    if (window.scrollY > lastScrollY && window.scrollY > 100) {
                        navbar.classList.add('hidden-scroll');
                    } else {
                        navbar.classList.remove('hidden-scroll');
                    }
                    lastScrollY = window.scrollY;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
});