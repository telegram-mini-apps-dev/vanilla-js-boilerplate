// Init TWA
Telegram.WebApp.ready();

const alertBtn = document.getElementById('alertBtn');
const confirmBtn = document.getElementById('confirmBtn');
const popupBtn = document.getElementById('popupBtn');
const telegramLink = document.getElementById('telegramLink');
const externalLink = document.getElementById('externalLink');
const instantViewLink = document.getElementById('instantViewLink');
const expandBtn = document.getElementById('expandBtn');
const toggleMainBtn = document.getElementById('toggleMainBtn');
const validateBtn = document.getElementById('validateBtn');

alertBtn.addEventListener('click', () => {
    Telegram.WebApp.showAlert('Hello World!');
});

confirmBtn.addEventListener('click', showConfirm);
popupBtn.addEventListener('click', showPopup);
telegramLink.addEventListener('click', () => {
    Telegram.WebApp.openTelegramLink('https://t.me/trendingapps');
});
externalLink.addEventListener('click', () => {
    Telegram.WebApp.openLink('https://ton.org/');
});
instantViewLink.addEventListener('click', () => {
    Telegram.WebApp.openLink('https://telegra.ph/api', {
        try_instant_view: true
    });
});
expandBtn.addEventListener('click', () => {
    Telegram.WebApp.expand();
});
toggleMainBtn.addEventListener('click', toggleMainButton);
validateBtn.addEventListener('click', validateInitData);

function showPopup() {
    Telegram.WebApp.showPopup({
        title: 'Title',
        message: 'Some message',
        buttons: [{
            id: 'link',
            type: 'default',
            text: 'Open ton.org'
        },
        {
            type: 'cancel'
        }
        ]
    }, (btn) => {
        if (btn === 'link') {
            Telegram.WebApp.openLink('https://ton.org/');
        }
    });
}

function showConfirm() {
    Telegram.WebApp.showConfirm('Do you want to open ton.org?', (result) => {
        if (result) {
            Telegram.WebApp.openLink('https://ton.org/');
        }
    });
}

function toggleMainButton() {
    if (Telegram.WebApp.MainButton.isVisible) {
        Telegram.WebApp.MainButton.hide();
    } else {
        Telegram.WebApp.MainButton.show();
    }
}

function setViewportData() {
    const sizeEl = document.getElementById('viewport-params-size');
    sizeEl.innerText = `width: ${window.innerWidth} x height: ${Telegram.WebApp.viewportStableHeight}`;

    const expandEl = document.querySelector('#viewport-params-expand');
    expandEl.innerText = `Is Expanded: ${Telegram.WebApp.isExpanded ? 'true' : 'false'}`;
}

Telegram.WebApp.setHeaderColor('secondary_bg_color');
setViewportData();
Telegram.WebApp.onEvent('viewportChanged', setViewportData);

async function validateInitData() {
    const initData = Telegram.WebApp.initData;
    try {
        const response = await fetch('/api/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `initData=${encodeURIComponent(initData)}`
        });
        const data = await response.json();
        document.getElementById('loader').style.display = 'none';
        if (data.success) {
            document.getElementById('content').style.display = 'block';
        } else {
            Telegram.WebApp.showAlert('Data is invalid: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loader').style.display = 'none';
        Telegram.WebApp.showAlert('An error occurred during validation');
    }
}