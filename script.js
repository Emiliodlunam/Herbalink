document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos globales del DOM para Login/Modal
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn'); // Botón en el header
    const closeBtn = document.querySelector('.modal .close-btn');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    // Elementos opcionales que solo existen en index.html
    const startBtn = document.getElementById('startBtn'); 
    
    // Usuario y contraseña de prueba (simulación local)
    const USER_PRUEBA = 'admin';
    const PASS_PRUEBA = '12345'; 
    
    const navUl = document.querySelector('header nav ul');

    // --- FUNCIONES DE SESIÓN Y UI ---
    
    /** * Reemplaza el enlace de "Iniciar Sesión" por el nombre del usuario y el botón de Salir.
     */
    const updateNavForUser = (username) => {
        const existingLoginLi = document.getElementById('loginBtn') ? document.getElementById('loginBtn').closest('li') : null;

        if (existingLoginLi) {
            // Guardar el nombre de usuario en localStorage
            localStorage.setItem('loggedInUser', username);
            
            // Reemplazar el contenido del <li> con el nombre y el botón Salir
            existingLoginLi.innerHTML = `
                <a href="#" id="welcomeText" title="Ver perfil">Hola, ${username}</a>
                <a href="#" id="logoutBtn" style="margin-left: 10px; color: #cc0000; font-weight: 500;">(Salir)</a>
            `;

            // Asignar el evento para cerrar sesión al nuevo botón
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                logoutUser();
            });
        }
    };

    /**
     * Restaura la navegación a su estado pre-login ("Iniciar Sesión").
     */
    const restoreNavForGuest = () => {
        // Buscamos si existe el <li> que contiene el nombre/salir
        const logoutBtn = document.getElementById('logoutBtn');
        const welcomeText = document.getElementById('welcomeText');
        
        // Si encontramos elementos de sesión, restauramos el <li> completo.
        if (logoutBtn && welcomeText) {
            const loginLi = logoutBtn.closest('li');
            if (loginLi) {
                loginLi.innerHTML = `<a href="#" id="loginBtn">Iniciar Sesión</a>`;
                
                // Reasignar el listener de evento al nuevo botón 'Iniciar Sesión'
                const newLoginBtn = document.getElementById('loginBtn');
                if (newLoginBtn) {
                     newLoginBtn.addEventListener('click', openLoginModal);
                }
            }
        }
    };

    /**
     * Limpia la sesión y actualiza la UI.
     */
    const logoutUser = () => {
        localStorage.removeItem('loggedInUser'); // Elimina el usuario de localStorage
        restoreNavForGuest();
        // Opcional: Redirigir a la página de inicio o recargar para limpiar la UI
        window.location.reload(); 
    };
    
    /**
     * Función para abrir el modal (se usa en múltiples botones)
     */
    const openLoginModal = (e) => {
        e.preventDefault();
        if (loginModal) {
            loginModal.style.display = 'block';
            if (loginMessage) loginMessage.textContent = ''; // Limpiar mensaje previo
        }
    }


    // --- INICIALIZACIÓN Y EVENT LISTENERS ---

    // Verificar y cargar sesión al iniciar en cualquier página
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        updateNavForUser(storedUser); 
    } else {
        restoreNavForGuest(); // Asegurarse de que el botón de login esté funcional
    }

    // 1. Abrir modal al hacer clic en 'Iniciar Sesión' (si el elemento existe en el DOM)
    if (loginBtn) {
        // En lugar de añadir un listener a loginBtn directamente, nos aseguramos de que
        // la función de restaurar nav añade el listener correcto al <li> que esté activo.
        // Si loginBtn existe inicialmente, le agregamos el listener:
        loginBtn.addEventListener('click', openLoginModal);
    }
    
    // 2. Abrir modal al hacer clic en 'Empieza Ahora' (solo en index.html)
    if (startBtn) {
        startBtn.addEventListener('click', openLoginModal);
    }

    // 3. Cerrar modal al hacer clic en la 'x'
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
        });
    }

    // 4. Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            if (loginModal) loginModal.style.display = 'none';
        }
    });

    // 5. Simulación de SUBMISIÓN del Formulario
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            const usernameInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value.trim();

            if (loginMessage) loginMessage.className = 'message'; // Resetear clases

            if (usernameInput === USER_PRUEBA && passwordInput === PASS_PRUEBA) {
                // Credenciales correctas
                if (loginMessage) {
                    loginMessage.classList.add('success');
                    loginMessage.textContent = `¡Bienvenido, ${usernameInput}!`;
                }
                
                // Cerrar modal y actualizar la navegación
                setTimeout(() => {
                    if (loginModal) loginModal.style.display = 'none'; 
                    loginForm.reset(); 
                    updateNavForUser(usernameInput); // Actualiza la UI en la página actual
                }, 1500);

            } else {
                // Credenciales incorrectas
                if (loginMessage) {
                    loginMessage.classList.add('error');
                    loginMessage.textContent = 'Usuario o contraseña incorrectos. Intenta de nuevo.';
                }
            }
        });
    }
});