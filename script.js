const accordions = document.querySelectorAll(".accordion-header");
accordions.forEach(btn => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    content.classList.toggle("open");
  });
});


document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const shop = document.getElementById("shop")?.value.trim() || ""; // optional field
  const pieces = document.getElementById("pieces").value.trim();
  const kg = document.getElementById("kg").value.trim();
  const product = document.getElementById("product")?.value.trim() || ""; // optional

  // Build quantity text dynamically
  let qtyText = "";
  if (pieces) qtyText = `${pieces} pieces`;
  if (kg) qtyText = `${kg} kg`;
  if (pieces && kg) qtyText = `${pieces} pieces and ${kg} kg`;

  const message =
    `Hello, I am ${name}${shop ? " from " + shop : ""}. ` +
    `I want to order ${qtyText}${product ? " of " + product : ""}.`;

  const phone = "919679004046"; // Replace with your business number

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
});


function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).innerText;
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied: ${text}`);
        });
}

function showToast(message) {
  const toast = document.getElementById("copyToast");
  toast.innerText = message;  // Use innerText to avoid issues
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}


document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".copyable").forEach(item => {
    item.addEventListener("click", () => {
      const text = item.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text}`);
      });
    });
  });
});


// Auto-generate UPI deep link from entered amount
function openUPILink() {
  const amountField = document.getElementById("amt");
  const amount = amountField.value.trim();
  const upiId = "prsnmondal@ybl";
  const name = encodeURIComponent("Prasun Mondal");
  const note = encodeURIComponent("Payment - Mondal Brothers");

  // If no amount, create URL without am parameter
  let url = `upi://pay?pa=${upiId}&pn=${name}&cu=INR&tn=${note}`;

  // If valid amount added, include am parameter
  if (amount && !isNaN(amount) && Number(amount) > 0) {
    url += `&am=${amount}`;
  }

  window.location.href = url;
}

function payNow() {
  openUPILink();
}



// PWA - start



let deferredPrompt;
const installBtn = document.getElementById("installBtn");
const toast = document.getElementById("toast");

installBtn.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
  installBtn.style.display = "none";
  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;
  deferredPrompt = null;
});

// When installed
window.addEventListener("appinstalled", () => {
  showToast("Installing App...");
});

// Toast function
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}


// PWA - end




