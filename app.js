document.addEventListener('DOMContentLoaded', function() {
    // Capture user's location and set to hidden fields in the forms
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // Set location details in hidden fields for each juice
            document.getElementById('latitude-cocktail').value = position.coords.latitude;
            document.getElementById('longitude-cocktail').value = position.coords.longitude;

            document.getElementById('latitude-apple').value = position.coords.latitude;
            document.getElementById('longitude-apple').value = position.coords.longitude;

            document.getElementById('latitude-mango').value = position.coords.latitude;
            document.getElementById('longitude-mango').value = position.coords.longitude;

            document.getElementById('latitude-banana').value = position.coords.latitude;
            document.getElementById('longitude-banana').value = position.coords.longitude;

            document.getElementById('latitude-watermelon').value = position.coords.latitude;
            document.getElementById('longitude-watermelon').value = position.coords.longitude;

            document.getElementById('latitude-mixed berries').value = position.coords.latitude;
            document.getElementById('longitude-mixed berries').value = position.coords.longitude;

            document.getElementById('latitude-pineapple').value = position.coords.latitude;
            document.getElementById('longitude-pineapple').value = position.coords.longitude;
        }, function (error) {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    // Add event listeners to the order buttons
    const orderButtons = document.querySelectorAll('.order-button');
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const juiceType = this.getAttribute('data-juice');
            submitOrder(juiceType);
        });
    });
})

// Function to submit order and show the checkout section
function submitOrder(juiceType) {
    // Collect selected juice details
    const size = document.getElementById(`size-${juiceType}`).value;
    const temperature = document.getElementById(`temperature-${juiceType}`).value;
    const latitude = document.getElementById(`latitude-${juiceType}`).value;
    const longitude = document.getElementById(`longitude-${juiceType}`).value;

    // Populate checkout section with order details
    document.getElementById('juice-type').value = juiceType;
    document.getElementById('size').value = size;
    document.getElementById('temperature').value = temperature;
    document.getElementById('latitude').value = latitude;
    document.getElementById('longitude').value = longitude;

    // Display checkout section
    document.getElementById('checkout').style.display = 'block'; // Show the checkout section
}

// map location for user
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

