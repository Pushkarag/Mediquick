// Cart functionality with fixes
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, productName, price, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }
    
    updateCart();
    saveCartToStorage();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
    // Update cart count in header
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
    
    // Update cart page if we're on it
    if (document.getElementById('cart-items')) {
        renderCartItems();
        calculateCartTotal();
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="images/${item.id}.jpg" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">₹${item.price.toFixed(2)}</p>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// Rider tracking fixes
function createMap(center) {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: center,
        mapTypeId: 'roadmap',
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });
    
    // Add user marker
    new google.maps.Marker({
        position: center,
        map: map,
        title: 'Your Location',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff'
        }
    });
    
    // Simulate rider location
    const riderLocation = {
        lat: center.lat + 0.005,
        lng: center.lng + 0.005
    };
    
    // Add rider marker
    const riderMarker = new google.maps.Marker({
        position: riderLocation,
        map: map,
        title: 'Delivery Rider',
        icon: {
            url: 'images/rider-marker.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    
    // Add route from rider to user
    const route = new google.maps.Polyline({
        path: [riderLocation, center],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map
    });
    
    // Always simulate rider movement (or use a better condition)
    simulateRiderMovement(riderMarker, center);
}

// Initialize event listeners for product buttons
function initProductButtons() {
    const productButtons = document.querySelectorAll('.product button');
    if (productButtons.length === 0) return;
    
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const productImg = product.querySelector('img');
            if (!productImg) return;
            
            const productId = productImg.src.split('/').pop().split('.')[0];
            const productName = product.querySelector('h3')?.textContent || 'Unknown Product';
            const priceText = product.querySelector('.price')?.textContent || '0';
            const price = parseFloat(priceText.replace('₹', '').replace(',', ''));
            
            if (!isNaN(price)) {
                addToCart(productId, productName, price);
                alert(`${productName} added to cart!`);
            }
        });
    });
}

// Update window.onload to include initProductButtons
window.onload = function() {
    if (document.getElementById('map')) {
        initMap();
    }
    
    updateCart(); // Always try to update cart
    
    if (document.getElementById('total-bill')) {
        calculateBill();
    }
    
    initProductButtons();
};

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
function initMap() {
    // Default location (can be any coordinates)
    const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // Delhi coordinates
    
    // Try to get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                createMap(userLocation);
            },
            (error) => {
                console.error("Geolocation error:", error);
                createMap(defaultLocation);
            }
        );
    } else {
        // Browser doesn't support Geolocation
        console.log("Geolocation is not supported by this browser.");
        createMap(defaultLocation);
    }
}

function createMap(center) {
    // Create map centered at the provided location
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15, // Zoom level (0-20)
        center: center,
        mapTypeId: 'roadmap', // 'roadmap', 'satellite', 'hybrid', 'terrain'
        styles: [
            {
                featureType: "poi", // Points of interest
                elementType: "labels",
                stylers: [{ visibility: "off" }] // Hide business labels
            }
        ]
    });
    
    // Add a marker at the center position
    new google.maps.Marker({
        position: center,
        map: map,
        title: 'Your Location',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff'
        }
    });
    
    // Optional: Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: "<h3>Your Location</h3><p>Lat: " + center.lat.toFixed(4) + "<br>Lng: " + center.lng.toFixed(4) + "</p>"
    });
    
    infoWindow.open(map, marker);
}

// Make sure initMap is available globally
window.initMap = initMap;
const locations = [
    { lat: 28.6139, lng: 77.2090, title: "Delhi" },
    { lat: 19.0760, lng: 72.8777, title: "Mumbai" }
];

locations.forEach(location => {
    new google.maps.Marker({
        position: location,
        map: map,
        title: location.title
    });
});
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

function calculateRoute(start, end) {
    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: 'DRIVING'
        },
        (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        }
    );
}