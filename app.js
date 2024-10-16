// Handle juice order selection
const orderButtons = document.querySelectorAll('.order-button');
orderButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const juiceType = e.target.getAttribute('data-juice');
        document.getElementById('juice-type').value = juiceType;
        alert(`${juiceType} selected! Proceed to checkout.`);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([-1.286389, 36.817223], 13);

    const roadView = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    });

    const satelliteView = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });

    roadView.addTo(map);
    L.control.layers({ "Road View": roadView, "Satellite View": satelliteView }).addTo(map);

    const locationStatus = document.getElementById('location-status');
    const paymentButton = document.getElementById('pay-with-mpesa');

    if ('geolocation' in navigator) {
        const locationButton = document.getElementById('get-location');

        locationButton.addEventListener('click', () => {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    locationStatus.textContent = `Your Location: Latitude ${latitude}, Longitude ${longitude}`;
                    map.setView([latitude, longitude], 15);

                    L.marker([latitude, longitude]).addTo(map)
                        .bindPopup(`<b>Your Delivery Location:</b><br>Latitude: ${latitude}<br>Longitude: ${longitude}`)
                        .openPopup();
                },
                function(error) {
                    locationStatus.textContent = "Unable to retrieve your location.";
                }
            );
        });
    } else {
        locationStatus.textContent = "Geolocation is not supported by your browser.";
    }

    // MPesa Payment Integration
    paymentButton.addEventListener('click', function() {
        // Fetch the payment details from your server
        fetch('/api/initiatePayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Include necessary payment details like amount and phone number
                amount: 100,  // Example amount
                phoneNumber: 'your-phone-number',  // User's phone number
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Payment initiated! Please confirm on your MPesa app.');
            } else {
                alert('Payment initiation failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during the payment process.');
        });
    });
});
