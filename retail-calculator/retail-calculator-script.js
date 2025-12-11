let selectedType = null;
window.currentType = null;


    function setRate(type) {
        localStorage.setItem("selectedType", type);   // save selected type
        const rate = localStorage.getItem(`rate_${type}`);
        document.getElementById("rate").value = rate;
        window.currentType = type;

        const readable = type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        document.getElementById("selectedTypeLabel").textContent = readable;

        recalcAfterRateUpdate();
        focusKg();

        highlightSelectedButton(type);
    }


    function highlightSelectedButton(type) {
        document.querySelectorAll(".choice-btn").forEach(btn => btn.classList.remove("active"));
        const activeBtn = document.querySelector(`.choice-btn[data-type="${type}"]`);
        if (activeBtn) activeBtn.classList.add("active");
    }

//window.onload = () => {
//    const savedType =
//    if (savedType) {
//        setRate(savedType);            // auto-fill rate & label
//        highlightSelectedButton(savedType);
//    }
//};


document.addEventListener("DOMContentLoaded", () => {
    const savedType = localStorage.getItem("selectedType");

    if (savedType) {
        const savedRate = localStorage.getItem(`rate_${savedType}`) || "";

        // Set rate input
        const rateInput = document.getElementById("rate");
        if (rateInput) {
            rateInput.value = savedRate;
        }

        // Restore label + button active state
        updateSelectionUI(savedType);
    }
});


function updateSelectionUI(type) {
    // Human-readable text
    const readable = type
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());

    const labelEl = document.getElementById("selectedTypeLabel");
    if (labelEl) {
        labelEl.textContent = readable;
    }

    // Highlight active button
    document.querySelectorAll(".choice-btn").forEach(btn => {
        const btnType = btn.getAttribute("data-type");
        btn.classList.toggle("active", btnType === type);
    });

    focusKg();
}



function recalcAfterRateUpdate() {
    const rate = Number(document.getElementById("rate").value);
    const kg = Number(document.getElementById("kg").value);
    const amount = Number(document.getElementById("amount").value);

    if (kg > 0) {
        document.getElementById("amount").value = (rate * kg).toFixed(2);
    } else if (amount > 0 && rate > 0) {
        document.getElementById("kg").value = (amount / rate).toFixed(2);
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

      const logMessage = `Rate Set: BL=${localStorage.getItem("rate_broiler_live")}, BC=${localStorage.getItem("rate_broiler_cut")}, CL=${localStorage.getItem("rate_culbird_live")}, CC=${localStorage.getItem("rate_culbird_cut")}`;
      trackEvent(`RCalc: Rate Set: ${logMessage}`)

      // Clear current calculator values
      document.getElementById("rate").value = "";
      document.getElementById("kg").value = "";
      document.getElementById("amount").value = "";

      // Optional placeholder reset
      document.getElementById("rate").placeholder = "Rate";
      location.reload();
      closeSettings();
    }

function saveAndClearKgAmount() {
 const kgField = document.getElementById("kg");
    const kg = parseFloat(document.getElementById("kg").value);
        const type = window.currentType;

        if (!type) {
            console.warn("No chicken type selected — cannot log sale.");
            return;
        }

        if (!kg || kg <= 0) {
            console.warn("No KG entered — skipping log.");
            return;
        }

        logSale(type, kg);

  document.getElementById("kg").value = "";
  document.getElementById("amount").value = "";
  focusKg();
  trackEvent(`RCalc: Saved`)
}

function clearKgAmount() {
  document.getElementById("kg").value = "";
  document.getElementById("amount").value = "";
  focusKg();
  trackEvent(`RCalc: Cleared`)
}


document.addEventListener("DOMContentLoaded", () => {
            const rateKeys = [
                { key: "rate_broiler_live", btnClass: "broiler_live" },
                { key: "rate_broiler_cut", btnClass: "broiler_cut" },
                { key: "rate_culbird_live", btnClass: "culbird_live" },
                { key: "rate_culbird_cut", btnClass: "culbird_cut" }
            ];

            rateKeys.forEach(({ key, btnClass }) => {
                const savedRate = localStorage.getItem(key);
                const btn = document.querySelector(`.${btnClass}`);

                if (!savedRate || savedRate.trim() === "" || Number(savedRate) === 0) {
                    btn.style.display = "none";      // hide if not set
                } else {
                    btn.style.display = "block";     // show if set
                }
            });
        });

function clearField(id) {
    const input = document.getElementById(id);
    input.value = "";
}

function focusKg() {
    const kgInput = document.getElementById("kg");
    kgInput.focus();
    kgInput.select();  // optional: highlights current text for typing quickly
}



// Logging sales

