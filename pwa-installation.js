// ------------------------------
// GLOBAL
// ------------------------------
let deferredPrompt = null;

// ------------------------------
// Detect if running as PWA
// ------------------------------
function isPwaInstalled() {
    return (
        window.matchMedia("(display-mode: standalone)").matches || // Android/Desktop
        window.navigator.standalone === true                       // iOS Safari
    );
}

// ------------------------------
// Hide install button by default
// ------------------------------
function hideInstallButton() {
    const installBtn = document.getElementById("installBtn");
    if (installBtn) installBtn.style.display = "none";
}

// ------------------------------
// Show install button
// ------------------------------
function showInstallButton() {
    const installBtn = document.getElementById("installBtn");
    if (installBtn) installBtn.style.display = "block";
}

// ------------------------------
// BEFOREINSTALLPROMPT — only fires when NOT installed
// ------------------------------
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Only show install button if app is not installed
    if (!isPwaInstalled()) {
        showInstallButton();
    }
});

// ------------------------------
// Install Button Click
// ------------------------------
async function installPwa() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    // Hide button after the user accepts or dismisses
    hideInstallButton();

    // Reset
    deferredPrompt = null;
}

// ------------------------------
// When app actually gets installed
// ------------------------------
window.addEventListener("appinstalled", () => {
    hideInstallButton(); // Installed → hide button
});

// ------------------------------
// On Load
// ------------------------------
window.addEventListener("DOMContentLoaded", () => {
    // If PWA already installed → never show button
    if (isPwaInstalled()) {
        hideInstallButton();
    }
});
