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
  const product = document.getElementById("product").value;
  const message = `Hello, I am ${name} from ${shop}. I want to order ${qty} kg of ${product}.`;
  const phone = "91XXXXXXXXXX"; // replace with your number
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
});
