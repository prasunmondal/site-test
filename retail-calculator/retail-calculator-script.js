let selectedType = null;

    function setRate(type) {
      selectedType = type;

      // Highlight active button
      document.querySelectorAll('.choice-btn').forEach(btn => btn.classList.remove("active"));
      event.target.classList.add("active");

      // Load saved rate for selected type
      const savedRate = localStorage.getItem("rate_" + type);
      if (savedRate && savedRate !== "") {
         document.getElementById("rate").value = savedRate;
<!--         document.getElementById("rate").placeholder = "Rate";-->
      } else {
         document.getElementById("rate").value = "";
<!--         document.getElementById("rate").placeholder = "Rate";-->
         document.getElementById("kg").value = "";
         document.getElementById("amount").value = "";
      }
    }

    // Auto calculate based on user change
    function autoCalc(changed) {
      const rate   = parseFloat(document.getElementById("rate").value);
      const kg     = parseFloat(document.getElementById("kg").value);
      const amount = parseFloat(document.getElementById("amount").value);

      if (changed === "kg" && rate) {
        document.getElementById("amount").value = (kg * rate).toFixed(0);
      }

      if (changed === "amount" && rate) {
        document.getElementById("kg").value = (amount / rate).toFixed(2);
      }

      if (changed === "rate" && kg) {
        document.getElementById("amount").value = (kg * rate).toFixed(0);
      }

      // Save rate per type
      if (selectedType && rate) {
        localStorage.setItem("rate_" + selectedType, rate);
      }
    }