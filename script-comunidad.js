document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener elementos de la comunidad y del modal
    const profileSection = document.getElementById('profileSection');
    const loginPrompt = document.getElementById('loginPrompt');
    const openLoginModalBtn = document.getElementById('openLoginModalBtn');
    
    // Elementos del feed para visibilidad condicional
    const newPostForm = document.getElementById('newPostForm');
    const newPostInput = document.getElementById('newPostInput');
    const createPostPrompt = document.getElementById('createPostPrompt');
    const commentToggleButtons = document.querySelectorAll('.comment-btn'); 
    const openLoginFromFeed = document.getElementById('openLoginFromFeed');
    const postsList = document.querySelector('.posts-list');
    
    // Filtros
    const misPublicacionesBtn = document.getElementById('misPublicacionesBtn');
    const filterButtons = document.querySelectorAll('.feed-filters .filter-btn');
    
    // Elementos del MODAL
    const loginModal = document.getElementById('loginModal');
    const loginMessage = document.getElementById('loginMessage');
    
    // 2. Comprobar el estado de la sesión
    const loggedInUser = localStorage.getItem('loggedInUser'); 

    // Función para abrir el modal
    const openLoginModal = (e) => {
        if (e) e.preventDefault();
        if (loginModal) {
            loginModal.style.display = 'block';
            if (loginMessage) loginMessage.textContent = ''; 
        }
    };
    
    // --- LÓGICA DE PUBLICACIÓN Y COMENTARIOS ---

    const attachCommentListeners = (container) => {
        const toggleBtn = container.querySelector('.comment-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => handleCommentToggle(toggleBtn));
        }

        // Selecciona el botón de envío dentro del contenedor
        const submitBtn = container.querySelector('.submit-comment-btn'); 
        if (submitBtn) {
            submitBtn.addEventListener('click', () => handleCommentSubmission(submitBtn));
        }
    };

    const handleCommentSubmission = (btn) => {
        const postId = btn.getAttribute('data-post-id');
        const input = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
        const commentText = input.value.trim();
        
        if (commentText === "") {
            alert("No puedes enviar un comentario vacío.");
            return;
        }

        const newComment = document.createElement('div');
        newComment.classList.add('comment-item');
        newComment.innerHTML = `<span class="comment-user">${loggedInUser}:</span> <span class="comment-text">${commentText}</span>`;
        
        // Busca la lista de comentarios correcta (el primer comments-list dentro del post)
        const commentsList = document.getElementById(`comments-post-${postId}`);
        if (commentsList) {
            commentsList.appendChild(newComment);
            
            const countSpan = commentsList.closest('.post-card').querySelector('.comment-count');
            if (countSpan) {
                let currentCount = parseInt(countSpan.getAttribute('data-count')) || 0;
                currentCount++;
                countSpan.setAttribute('data-count', currentCount);
                countSpan.textContent = `${currentCount} Comentarios`;
            }
        }
        
        input.value = '';
        input.closest('.comment-form-container').classList.remove('active');
    };

    const handleNewPost = (event) => {
        event.preventDefault();

        const postText = newPostInput.value.trim();

        if (postText === "") {
            alert("No puedes crear una publicación vacía.");
            return;
        }

        const newPostId = Date.now(); 

        const newPostCard = document.createElement('div');
        newPostCard.classList.add('post-card');
        newPostCard.setAttribute('data-post-id', newPostId);
        newPostCard.setAttribute('data-type', 'logro'); 
        newPostCard.setAttribute('data-owner', loggedInUser);
        
        newPostCard.innerHTML = `
            <div class="post-header">
                <img src="imagenes/p1.jpeg" alt="${loggedInUser}" class="post-avatar">
                <h4>${loggedInUser}</h4>
            </div>
            <p class="post-text">${postText}</p>
            <div class="post-actions">
                <span>0 Likes</span>
                <span class="comment-count" data-count="0">0 Comentarios</span>
            </div>
            
            <div class="comments-section">
                <div class="comments-list" id="comments-post-${newPostId}">
                </div>
                
                <div class="comment-form-container">
                    <input type="text" placeholder="Escribe tu comentario..." class="comment-input" data-post-id="${newPostId}">
                    <button class="submit-comment-btn" data-post-id="${newPostId}">Enviar</button>
                </div>
            </div>
            
            <div class="post-footer">
                <button class="comment-btn post-action-btn" data-toggle-id="${newPostId}">Comentar</button>
            </div>
        `;
        
        if (postsList) {
            postsList.prepend(newPostCard);
        }
        
        newPostInput.value = '';
        alert("¡Publicación creada con éxito!");
        
        // Adjuntar listeners al nuevo post
        attachCommentListeners(newPostCard);
        
        // Re-ejecutar el filtro para que el nuevo post sea visible si el filtro 'Todos' está activo
        const activeFilterBtn = document.querySelector('.feed-filters .active');
        if (activeFilterBtn) {
             const filterText = activeFilterBtn.textContent.trim().toLowerCase();
             let filterValue;
             if (filterText === 'preguntas') {
                 filterValue = 'pregunta';
             } else if (filterText === 'mis publicaciones') {
                 filterValue = 'mis publicaciones';
             } else {
                 filterValue = 'todos';
             }
             filterPosts(filterValue); // Aplica el filtro para mostrar la nueva publicación
        }
    };
    
    const handleCommentToggle = (btn) => {
        const postCard = btn.closest('.post-card');
        const formContainer = postCard.querySelector('.comment-form-container');
        
        formContainer.classList.toggle('active');
        
        if (formContainer.classList.contains('active')) {
            formContainer.querySelector('.comment-input').focus();
        }
    };
    
    // --- LÓGICA DE FILTRADO DE PUBLICACIONES ---
    
    

    const filterPosts = (filterType) => {
        // Obtenemos las tarjetas en el momento de la ejecución (incluye las nuevas)
        const currentPostCards = document.querySelectorAll('.posts-list .post-card');
        
        currentPostCards.forEach(card => {
            const postType = card.getAttribute('data-type');
            const postOwner = card.getAttribute('data-owner');
            
            let shouldShow = false;

            if (filterType === 'todos') {
                shouldShow = true;
            } else if (filterType === 'pregunta') {
                // Muestra solo si el tipo es 'pregunta'
                shouldShow = (postType === 'pregunta');
            } else if (filterType === 'mis publicaciones') {
                // Muestra solo si el owner coincide con el usuario loggeado (REQUIERE LOGIN)
                shouldShow = (postOwner === loggedInUser);
            }

            card.style.display = shouldShow ? 'block' : 'none';
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterText = button.textContent.trim().toLowerCase();
            
            let filterValue;
            if (filterText === 'preguntas') {
                filterValue = 'pregunta';
            } else if (filterText === 'mis publicaciones') {
                filterValue = 'mis publicaciones';
                // Si el usuario intenta filtrar por sus posts sin estar loggeado, abre el modal
                if (!loggedInUser) {
                     alert("Debes iniciar sesión para ver tus publicaciones.");
                     openLoginModal();
                     return; 
                }
            } else {
                 filterValue = 'todos';
            }
            
            filterPosts(filterValue);
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // --- INICIALIZACIÓN Y VISIBILIDAD ---
    
    // Función de inicialización
    const initializePage = () => {
        document.querySelectorAll('.post-card').forEach(attachCommentListeners);
        
        // Aplicar el filtro 'Todos' al cargar la página
        filterPosts('todos'); 

        // Lógica de visibilidad del header y el perfil
        if (loggedInUser) {
            profileSection.style.display = 'block';
            loginPrompt.style.display = 'none';
            const userNameDisplay = profileSection.querySelector('h2');
            if (userNameDisplay) {
                 userNameDisplay.textContent = loggedInUser;
            }

            if (newPostForm) {
                 newPostForm.style.display = 'flex';
                 newPostForm.addEventListener('submit', handleNewPost);
            }
            if (createPostPrompt) createPostPrompt.style.display = 'none';

            if (misPublicacionesBtn) misPublicacionesBtn.style.display = 'block';

        } else {
            profileSection.style.display = 'none';
            loginPrompt.style.display = 'flex'; 

            if (newPostForm) newPostForm.style.display = 'none';
            if (createPostPrompt) createPostPrompt.style.display = 'block';

            commentToggleButtons.forEach(btn => {
                btn.style.display = 'none'; 
            });

            if (misPublicacionesBtn) misPublicacionesBtn.style.display = 'none';
            
            if (openLoginModalBtn) {
                openLoginModalBtn.addEventListener('click', openLoginModal);
            }
            if (openLoginFromFeed) {
                 openLoginFromFeed.addEventListener('click', openLoginModal);
            }
        }
    };

    initializePage(); // Ejecutar inicialización al cargar la página
});