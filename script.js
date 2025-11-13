const accordions = document.querySelectorAll(".accordion-header");
accordions.forEach(btn => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    content.classList.toggle("open");
  });
});

document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const shop = document.getElementById("shop").value;
  const qty = document.getElementById("quantity").value;

  const message =
`Hi!
Placing Chicken Order...
Name: ${name}
Shop: ${shop}
Quantity: ${qty} kg`;

  const phone = "919679004046";

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
});


let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;
  console.log("Install result:", result.outcome);
  deferredPrompt = null;
  installBtn.style.display = "none";
});
