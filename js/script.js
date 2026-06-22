// ---------------------------------------------------------
// Dungeon Loot Splitter - Phase 2
// ---------------------------------------------------------

// The loot array is the single source of truth.
// Every item in the app lives here.
let loot = []; // Each item looks like: { name, value, quantity }

// ---------------------------------------------------------
// Grab all DOM elements we need once at the top.
// This keeps the code cleaner and easier to read.
// ---------------------------------------------------------
const partySizeInput = document.getElementById("partySize");
const lootNameInput = document.getElementById("lootName");
const lootValueInput = document.getElementById("lootValue");
const lootQtyInput = document.getElementById("lootQty");

const lootRows = document.getElementById("lootRows");
const noLootMessage = document.getElementById("noLootMessage");
const totalLootElement = document.getElementById("totalLoot");

const finalTotalElement = document.getElementById("finalTotal");
const perMemberElement = document.getElementById("perMember");

const lootError = document.getElementById("lootError");
const partyError = document.getElementById("partyError");
const splitError = document.getElementById("splitError");

const splitBtn = document.getElementById("splitLootBtn");

// ---------------------------------------------------------
// addLoot()
// Validates user input, creates a loot object,
// pushes it into the loot array, and updates the UI.
// ---------------------------------------------------------
function addLoot() {
    lootError.textContent = ""; // Clear old errors

    // Read values from inputs
    let name = lootNameInput.value.trim();
    let value = parseFloat(lootValueInput.value);
    let qty = parseInt(lootQtyInput.value);

    // ------------------------------
    // Validation (Phase 2 requirement)
    // ------------------------------
    if (name === "") {
        lootError.textContent = "Loot name cannot be empty.";
        return;
    }
    if (isNaN(value) || value < 0) {
        lootError.textContent = "Loot value must be a valid number.";
        return;
    }
    if (isNaN(qty) || qty < 1) {
        lootError.textContent = "Quantity must be 1 or greater.";
        return;
    }

    // Create a plain object literal (required)
    loot.push({ name, value, quantity: qty });

    // Clear inputs for next entry
    lootNameInput.value = "";
    lootValueInput.value = "";
    lootQtyInput.value = "";

    // updateUI() handles all rendering and totals
    updateUI();
}

// ---------------------------------------------------------
// removeLoot()
// Removes an item from the array using splice()
// ---------------------------------------------------------
function removeLoot(index) {
    loot.splice(index, 1); // Required array mutation method
    updateUI();            // UI must update after state changes
}

// ---------------------------------------------------------
// handleSplit()
// Calculates final totals and loot per party member.
// Includes your BONUS FEATURES.
// ---------------------------------------------------------
function handleSplit() {
    splitError.textContent = "";

    let partySize = parseInt(partySizeInput.value);

    // Validate party size
    if (isNaN(partySize) || partySize < 1) {
        splitError.textContent = "Party size must be 1 or greater.";
        return;
    }

    // Validate loot exists
    if (loot.length === 0) {
        splitError.textContent = "No loot to split.";
        return;
    }

    // Calculate total loot (value × quantity)
    let total = 0;
    for (let i = 0; i < loot.length; i++) {
        total += loot[i].value * loot[i].quantity;
    }

    // -----------------------------------------------------
    // BONUS FEATURE: Guild Tax
    // If total > 100, apply 10% tax
    // -----------------------------------------------------
    let tax = 0;
    if (total > 100) {
        tax = total * 0.10;
        total -= tax;
        splitError.textContent = `Guild Tax Applied: $${tax.toFixed(2)}`;
    }

    // Calculate split
    let perPerson = total / partySize;

    // Show results
    finalTotalElement.textContent = `Total Loot (after tax): $${total.toFixed(2)}`;
    perMemberElement.textContent = `Loot Per Party Member: $${perPerson.toFixed(2)}`;

    // Make results visible
    finalTotalElement.classList.remove("hidden");
    perMemberElement.classList.remove("hidden");
}

// ---------------------------------------------------------
// updateUI()
// The MOST IMPORTANT function in Phase 2.
// It:
// 1. Renders the loot table
// 2. Calculates total loot
// 3. Shows/hides empty state
// 4. Enables/disables Split button
// 5. Clears and rebuilds the UI every time state changes
// ---------------------------------------------------------
function updateUI() {
    lootRows.innerHTML = ""; // Clear old rows

    // ------------------------------
    // Empty state (required)
    // ------------------------------
    if (loot.length === 0) {
        noLootMessage.classList.remove("hidden");
        totalLootElement.textContent = "0.00";
        splitBtn.disabled = true;

        // Hide split results
        finalTotalElement.classList.add("hidden");
        perMemberElement.classList.add("hidden");
        return;
    }

    noLootMessage.classList.add("hidden");

    let total = 0;

    // ------------------------------
    // Render loot table rows
    // Required: traditional for loop
    // ------------------------------
    for (let i = 0; i < loot.length; i++) {
        let row = document.createElement("div");
        row.className = "loot-row";

        let nameCell = document.createElement("div");
        nameCell.className = "loot-cell";
        nameCell.innerText = loot[i].name;

        let valueCell = document.createElement("div");
        valueCell.className = "loot-cell";
        valueCell.innerText = loot[i].value.toFixed(2);

        let qtyCell = document.createElement("div");
        qtyCell.className = "loot-cell";
        qtyCell.innerText = loot[i].quantity;

        let actionCell = document.createElement("div");
        actionCell.className = "loot-cell";

        let removeBtn = document.createElement("button");
        removeBtn.innerText = "Remove";

        // Remove button removes correct item
        removeBtn.onclick = function () {
            removeLoot(i);
        };

        actionCell.appendChild(removeBtn);

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(qtyCell);
        row.appendChild(actionCell);

        lootRows.appendChild(row);

        // Add to total
        total += loot[i].value * loot[i].quantity;
    }

    // Update total loot display
    totalLootElement.textContent = total.toFixed(2);

    // Enable/disable Split button (action gating)
    let partySize = parseInt(partySizeInput.value);
    splitBtn.disabled = isNaN(partySize) || partySize < 1;
}

// ---------------------------------------------------------
// Event Listeners
// ---------------------------------------------------------
document.getElementById("addLootBtn").onclick = addLoot;
splitBtn.onclick = handleSplit;

// When party size changes, UI updates automatically
partySizeInput.oninput = updateUI;

// Initial UI render
updateUI();
