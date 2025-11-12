document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL CARRITO ---
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const shoppingCart = document.getElementById('shoppingCart');
    const cartCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const productCards = document.querySelectorAll('.product-card');

    let cart = [];

    // --- FUNCIONES DEL CARRITO ---

    const removeItemFromCart = (index) => {
        const removedItemName = cart[index].name;
        cart.splice(index, 1);
        updateCartUI();
        alert(`"${removedItemName}" eliminado del carrito.`);
    };

    const updateCartUI = () => {
        cartItemsList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
            
            cart.forEach((item, index) => {
                const listItem = document.createElement('div');
                listItem.classList.add('cart-item');
                const priceValue = parseFloat(item.price.replace(' MXN', '').replace('$', '').trim());
                total += priceValue; 
                
                listItem.innerHTML = `
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <span>Cantidad: 1</span>
                    </div>
                    <div class="item-actions">
                        <span class="item-price">${item.price}</span>
                        <button class="remove-from-cart-btn" data-index="${index}">Eliminar</button>
                    </div>
                `;
                cartItemsList.appendChild(listItem);
            });
            
            document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const indexToRemove = parseInt(e.target.getAttribute('data-index'));
                    removeItemFromCart(indexToRemove);
                });
            });
        }
        
        cartCount.textContent = cart.length;
        cartTotalPrice.textContent = `$${total.toFixed(2)} MXN`;
    };

    const addItemToCart = (name, price) => {
        const newItem = { name: name, price: price, quantity: 1 };
        cart.push(newItem);
        updateCartUI();
        alert(`¡${name} agregado al carrito! 🛒`);
        shoppingCart.classList.add('open');
    };

    // Inicializar la UI del carrito al cargar
    updateCartUI(); 

    // Control de la barra lateral del carrito
    openCartBtn.addEventListener('click', () => { shoppingCart.classList.add('open'); });
    closeCartBtn.addEventListener('click', () => { shoppingCart.classList.remove('open'); });
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert(`Procesando compra de ${cart.length} artículos por ${cartTotalPrice.textContent}. ¡Gracias por tu pedido!`);
            cart = [];
            updateCartUI();
            shoppingCart.classList.remove('open');
        } else {
            alert('Tu carrito está vacío. ¡Añade algunos productos primero!');
        }
    });

    
    // Asignar listeners a los botones directos "Agregar al Carrito"
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            const card = btn.closest('.product-card');
            const name = card.getAttribute('data-name');
            const price = card.querySelector('.price').textContent;
            addItemToCart(name, price);
        });
    });


    // --- LÓGICA: MODAL DE DETALLE DE PRODUCTO ---

    const detailModal = document.getElementById('productDetailModal');
    const closeDetailBtn = document.querySelector('.close-detail-btn');
    const detailAddToCartBtn = document.getElementById('detailAddToCartBtn');
    
    // Cierra la modal
    if (closeDetailBtn) {
         closeDetailBtn.addEventListener('click', () => {
            detailModal.style.display = 'none';
        });
    }
   
    // Cierra la modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === detailModal) {
            detailModal.style.display = 'none';
        }
    });

    // Función principal para llenar y mostrar el modal de detalle
    const showProductDetail = (cardElement) => {
        const name = cardElement.getAttribute('data-name');
        const price = cardElement.querySelector('.price').textContent;
        const description = cardElement.querySelector('p').textContent;
        
        // Obtiene la URL de la imagen directamente de la tarjeta del producto.
        const mainImageSrc = cardElement.querySelector('img').src; 
        
        // Asignar un "aura" o subtítulo dinámico
        const auraText = name.includes('Kit') ? 'Kit de Inicio' : 'Esencial para Huerto'; 

        // 1. Llenar los campos del modal
        document.getElementById('detailName').textContent = name;
        document.getElementById('detailAura').textContent = auraText;
        document.getElementById('detailPrice').textContent = price;
        document.getElementById('detailDescription').textContent = description;
        document.getElementById('detailMainImage').src = mainImageSrc; // Asigna la imagen dinámica

        // 2. Actualizar el botón de agregar al carrito del modal
        detailAddToCartBtn.onclick = () => {
            addItemToCart(name, price);
            detailModal.style.display = 'none';
        };

        // 3. Mostrar la modal
        detailModal.style.display = 'flex'; // Usamos 'flex' para el centrado CSS
    };

    // Asignar listener a las tarjetas para abrir el detalle
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            showProductDetail(card);
        });
    });

});