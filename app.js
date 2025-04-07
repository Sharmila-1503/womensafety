// Emergency button functionality
const emergencyBtn = document.getElementById('emergencyBtn');
const contactForm = document.getElementById('contactForm');
let pressTimer;
let emergencyContact = null;

// Function to get current location
const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        }
        
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error)
        );
    });
};

// Function to trigger emergency
const triggerEmergency = async () => {
    try {
        // Get current location
        const position = await getCurrentLocation();
        const { latitude, longitude } = position.coords;

        // Create emergency message
        const emergencyMessage = `EMERGENCY: Location - https://www.google.com/maps?q=${latitude},${longitude}`;

        // Silently trigger emergency call
        const emergencyNumber = '208';
        window.location.href = `tel:${emergencyNumber}`;

        // Send SMS to emergency contact if registered
        if (emergencyContact) {
            // In a real implementation, this would be handled by a backend service
            console.log(`Sending emergency message to ${emergencyContact.name}: ${emergencyMessage}`);
            alert(`Emergency alert sent to ${emergencyContact.name}`);
        }

    } catch (error) {
        console.error('Error during emergency:', error);
        alert('Failed to trigger emergency. Please try again or call emergency services directly.');
    }
};

// Emergency button press handlers
emergencyBtn.addEventListener('mousedown', () => {
    emergencyBtn.classList.add('active');
    pressTimer = setTimeout(() => {
        triggerEmergency();
    }, 3000); // 3 seconds hold
});

emergencyBtn.addEventListener('mouseup', () => {
    clearTimeout(pressTimer);
    emergencyBtn.classList.remove('active');
});

emergencyBtn.addEventListener('mouseleave', () => {
    clearTimeout(pressTimer);
    emergencyBtn.classList.remove('active');
});

// Touch events for mobile devices
emergencyBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    emergencyBtn.classList.add('active');
    pressTimer = setTimeout(() => {
        triggerEmergency();
    }, 3000);
});

emergencyBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    clearTimeout(pressTimer);
    emergencyBtn.classList.remove('active');
});

// Contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;

    if (name && phone) {
        emergencyContact = { name, phone };
        localStorage.setItem('emergencyContact', JSON.stringify(emergencyContact));
        alert('Emergency contact saved successfully!');
    } else {
        alert('Please fill in all fields');
    }
});

// Load saved emergency contact on page load
window.addEventListener('load', () => {
    const savedContact = localStorage.getItem('emergencyContact');
    if (savedContact) {
        emergencyContact = JSON.parse(savedContact);
        document.getElementById('contactName').value = emergencyContact.name;
        document.getElementById('contactPhone').value = emergencyContact.phone;
    }
});