// Initialize the Telegram Web App (TWA) when the page is ready
Telegram.WebApp.ready();

// Get references to various buttons and links from the HTML page
const alertBtn = document.getElementById('alertBtn');           // Button to show an alert
const confirmBtn = document.getElementById('confirmBtn');       // Button to show a confirmation dialog
const popupBtn = document.getElementById('popupBtn');           // Button to show a popup
const telegramLink = document.getElementById('telegramLink');   // Button to open a Telegram link
const externalLink = document.getElementById('externalLink');   // Button to open an external link
const instantViewLink = document.getElementById('instantViewLink'); // Button to open a link with instant view
const expandBtn = document.getElementById('expandBtn');         // Button to expand the WebApp view
const toggleMainBtn = document.getElementById('toggleMainBtn'); // Button to toggle the visibility of the main button
const validateBtn = document.getElementById('validateBtn');     // Button to validate initData

// Event listener to show an alert when 'alertBtn' is clicked
alertBtn.addEventListener('click', () => {
    Telegram.WebApp.showAlert('Hello World!'); // Displays a simple alert with a message
});

// Event listener to show a confirmation dialog when 'confirmBtn' is clicked
confirmBtn.addEventListener('click', showConfirm);

// Event listener to show a popup when 'popupBtn' is clicked
popupBtn.addEventListener('click', showPopup);

// Event listener to open a specific Telegram link when 'telegramLink' is clicked
telegramLink.addEventListener('click', () => {
    Telegram.WebApp.openTelegramLink('https://t.me/trendingapps');
});

// Event listener to open an external link in the browser when 'externalLink' is clicked
externalLink.addEventListener('click', () => {
    Telegram.WebApp.openLink('https://ton.org/');
});

// Event listener to open a link with instant view when 'instantViewLink' is clicked
instantViewLink.addEventListener('click', () => {
    Telegram.WebApp.openLink('https://telegra.ph/api', {
        try_instant_view: true // Tries to open the link in Telegram Instant View mode
    });
});

// Event listener to expand the WebApp view when 'expandBtn' is clicked
expandBtn.addEventListener('click', () => {
    Telegram.WebApp.expand(); // Expands the web app to full screen within Telegram
});

// Event listener to toggle the visibility of the Telegram main button
toggleMainBtn.addEventListener('click', toggleMainButton);

// Event listener to validate the initData when 'validateBtn' is clicked
validateBtn.addEventListener('click', validateInitData);

// Function to show a popup with multiple buttons
function showPopup() {
    Telegram.WebApp.showPopup({
        title: 'Title',                // Popup title
        message: 'Some message',       // Popup message
        buttons: [
            {
                id: 'link',            // Button ID
                type: 'default',        // Button type
                text: 'Open ton.org'    // Button text
            },
            {
                type: 'cancel'          // A cancel button
            }
        ]
    }, (btn) => {
        // If the 'link' button is clicked, open ton.org in the browser
        if (btn === 'link') {
            Telegram.WebApp.openLink('https://ton.org/');
        }
    });
}

// Function to show a confirmation dialog with a callback
function showConfirm() {
    Telegram.WebApp.showConfirm('Do you want to open ton.org?', (result) => {
        // If the user confirms, open ton.org in the browser
        if (result) {
            Telegram.WebApp.openLink('https://ton.org/');
        }
    });
}

// Function to toggle the visibility of the Telegram MainButton
function toggleMainButton() {
    // If the main button is visible, hide it. Otherwise, show it.
    if (Telegram.WebApp.MainButton.isVisible) {
        Telegram.WebApp.MainButton.hide(); // Hide the main button
    } else {
        Telegram.WebApp.MainButton.show(); // Show the main button
    }
}

// Function to set viewport data, displaying the window size and whether the app is expanded
function setViewportData() {
    const sizeEl = document.getElementById('viewport-params-size');
    // Display the current width and height of the viewport
    sizeEl.innerText = `width: ${window.innerWidth} x height: ${Telegram.WebApp.viewportStableHeight}`;

    const expandEl = document.querySelector('#viewport-params-expand');
    // Display whether the WebApp is expanded or not
    expandEl.innerText = `Is Expanded: ${Telegram.WebApp.isExpanded ? 'true' : 'false'}`;
}

// Set the header color for the WebApp
Telegram.WebApp.setHeaderColor('secondary_bg_color');

// Set the initial viewport data when the app loads
setViewportData();

// Listen for viewport changes and update the display when the size changes
Telegram.WebApp.onEvent('viewportChanged', setViewportData);

// Function to validate the Telegram WebApp initData
async function validateInitData() {
    const initData = Telegram.WebApp.initData; // Get the initData from the WebApp
    try {
        // Send initData to the server for validation via a POST request
        const response = await fetch('/api/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Set the content type
            },
            body: `initData=${encodeURIComponent(initData)}` // Send the initData as the POST body
        });

        const data = await response.json(); // Parse the response as JSON
        document.getElementById('loader').style.display = 'none'; // Hide the loader
        if (data.success) {
            // If the validation is successful, show the content
            document.getElementById('content').style.display = 'block';
        } else {
            // If validation fails, show an alert with the error message
            Telegram.WebApp.showAlert('Data is invalid: ' + data.message);
        }
    } catch (error) {
        // Log the error and show an alert if the validation fails
        console.error('Error:', error);
        document.getElementById('loader').style.display = 'none'; // Hide the loader
        Telegram.WebApp.showAlert('An error occurred during validation');
    }
}