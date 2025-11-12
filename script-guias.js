document.addEventListener('DOMContentLoaded', () => {
    // ... (Variables existentes: stepCards, etc.) ...
    
    // --- NUEVAS VARIABLES DE CONTROL DE SESIÓN ---
    const videosSection2 = document.getElementById('videosSection2');
    const loginToViewAd = document.getElementById('loginToViewAd');
    const openLoginFromAd = document.getElementById('openLoginFromAd');
    
    // Obtener el estado de la sesión (asumiendo que script.js lo gestiona)
    const loggedInUser = localStorage.getItem('loggedInUser');

    // Función para abrir el modal de login (debe existir en script.js o aquí)
    const openLoginModal = (e) => {
        if (e) e.preventDefault();
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'block';
        }
    };

    // --- LÓGICA DE VISIBILIDAD DE VIDEOS ---
    if (videosSection2 && loginToViewAd) {
        if (loggedInUser) {
            // El usuario está loggeado: Muestra los videos, oculta el anuncio.
            videosSection2.style.display = 'block';
            loginToViewAd.style.display = 'none';
        } else {
            // El usuario NO está loggeado: Oculta los videos, muestra el anuncio.
            videosSection2.style.display = 'none';
            loginToViewAd.style.display = 'block';

            // Asigna el evento al botón del anuncio para abrir el modal
            if (openLoginFromAd) {
                openLoginFromAd.addEventListener('click', openLoginModal);
            }
        }
    }

    
});

document.addEventListener('DOMContentLoaded', () => {
    
});