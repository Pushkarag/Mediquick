// Initialize and add the map
function initMap() {
    // The location of the delivery rider (example coordinates)
    const riderLocation = { lat: 28.6139, lng: 77.2090 };
    // The map, centered at the rider's location
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: riderLocation,
    });
    // The marker, positioned at the rider's location
    const marker = new google.maps.Marker({
        position: riderLocation,
        map: map,
        title: 'Delivery Rider Location',
    });
}

// Calculate and display the total bill
function calculateBill() {
    const medicineCost = 500; // Example medicine cost
    const deliveryFee = parseFloat(document.getElementById('delivery-fee').innerText);
    const totalBill = medicineCost + deliveryFee;

    document.getElementById('medicine-cost').innerText = medicineCost.toFixed(2);
    document.getElementById('delivery-fee-summary').innerText = deliveryFee.toFixed(2);
    document.getElementById('total-bill').innerText = totalBill.toFixed(2);
}

// Initialize functions on window load
window.onload = function() {
    initMap();
    calculateBill();
};
