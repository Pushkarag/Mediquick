// Cart array and helper functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty</p>';
        totalElement.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <h4>${item.name} (${item.quantity})</h4>
            <p>₹${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove-item" data-id="${item.id}">Remove</button>
        `;
        container.appendChild(itemElement);
        total += item.price * item.quantity;
    });
    
    totalElement.textContent = total.toFixed(2);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    updateCartCount();
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const name = product.querySelector('h3').textContent;
            const price = parseFloat(product.querySelector('.price').textContent.replace('₹', ''));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: Date.now().toString(),
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            saveCart();
            updateCartCount();
            alert(`${name} added to cart!`);
        });
    });
    
    // Cart button
    document.getElementById('cart-btn').addEventListener('click', function() {
        document.getElementById('cart-modal').style.display = 'block';
        renderCart();
    });
    
    // Close cart
    document.getElementById('close-cart').addEventListener('click', function() {
        document.getElementById('cart-modal').style.display = 'none';
    });
    
    // Remove items (using event delegation)
    document.getElementById('cart-items').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            cart = cart.filter(item => item.id !== id);
            saveCart();
            updateCartCount();
            renderCart();
        }
    });
});