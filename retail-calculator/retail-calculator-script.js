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

    function saveShopName() {
      localStorage.setItem("shop_name", document.getElementById("shopName").value);
    }

    window.onload = function () {
      const saved = localStorage.getItem("shop_name");
      if (saved) {
        document.getElementById("shopName").value = saved;
      }
    }

    function autoExpand(el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }

    window.onload = function () {
      const saved = localStorage.getItem("shop_name");
      if (saved) {
        const el = document.getElementById("shopName");
        el.value = saved;
        autoExpand(el);
      }
    };

    function openSettings() {
      document.getElementById("settingsModal").style.display = "flex";
      loadRateFields();
    }

    function closeSettings() {
      document.getElementById("settingsModal").style.display = "none";
    }

    function loadRateFields() {
      document.getElementById("rate_broiler_live").value = localStorage.getItem("rate_broiler_live") || "";
      document.getElementById("rate_broiler_cut").value = localStorage.getItem("rate_broiler_cut") || "";
      document.getElementById("rate_culbird_live").value = localStorage.getItem("rate_culbird_live") || "";
      document.getElementById("rate_culbird_cut").value = localStorage.getItem("rate_culbird_cut") || "";
    }

    function saveSettings() {
      localStorage.setItem("rate_broiler_live", document.getElementById("rate_broiler_live").value);
      localStorage.setItem("rate_broiler_cut", document.getElementById("rate_broiler_cut").value);
      localStorage.setItem("rate_culbird_live", document.getElementById("rate_culbird_live").value);
      localStorage.setItem("rate_culbird_cut", document.getElementById("rate_culbird_cut").value);

      // Clear current calculator values
      document.getElementById("rate").value = "";
      document.getElementById("kg").value = "";
      document.getElementById("amount").value = "";

      // Optional placeholder reset
      document.getElementById("rate").placeholder = "Rate";

      closeSettings();
    }
