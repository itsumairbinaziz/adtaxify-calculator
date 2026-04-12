<<<<<<< HEAD
/**
 * TAX SLABS DATA - FBR PAKISTAN
 * 🔴 CHANGE HERE: Update these slabs when the new budget is announced
 */
const taxData = {
    "2024-2025": {
        salaried: [
            { min: 0, max: 600000, rate: 0, fixed: 0 },
            { min: 600000, max: 1200000, rate: 0.05, fixed: 0 },
            { min: 1200000, max: 2200000, rate: 0.15, fixed: 30000 },
            { min: 2200000, max: 3200000, rate: 0.25, fixed: 180000 },
            { min: 3200000, max: 4100000, rate: 0.30, fixed: 430000 },
            { min: 4100000, max: Infinity, rate: 0.35, fixed: 700000 }
        ],
        business: [
            { min: 0, max: 600000, rate: 0, fixed: 0 },
            { min: 600000, max: 800000, rate: 0.07, fixed: 0 },
            { min: 800000, max: 1200000, rate: 0.15, fixed: 14000 },
            { min: 1200000, max: 2400000, rate: 0.20, fixed: 74000 },
            { min: 2400000, max: 3000000, rate: 0.25, fixed: 314000 },
            { min: 3000000, max: 4000000, rate: 0.30, fixed: 464000 },
            { min: 4000000, max: Infinity, rate: 0.35, fixed: 764000 }
        ],
        freelancer: [
            { min: 0, max: Infinity, rate: 0.01, fixed: 0 } // Fixed 1% for export of services
        ]
    },
    "2025-2026": {
        salaried: [
            /* 🔴 CHANGE HERE: Add projected or new slabs for next year */
            { min: 0, max: 600000, rate: 0, fixed: 0 },
            { min: 600000, max: 1200000, rate: 0.05, fixed: 0 },
            { min: 1200000, max: 2200000, rate: 0.15, fixed: 30000 },
            { min: 2200000, max: 3200000, rate: 0.25, fixed: 180000 },
            { min: 3200000, max: 4100000, rate: 0.30, fixed: 430000 },
            { min: 4100000, max: Infinity, rate: 0.35, fixed: 700000 }
        ],
        business: [
            { min: 0, max: 600000, rate: 0, fixed: 0 },
            { min: 600000, max: 800000, rate: 0.07, fixed: 0 },
            { min: 800000, max: 1200000, rate: 0.15, fixed: 14000 },
            { min: 1200000, max: 2400000, rate: 0.20, fixed: 74000 },
            { min: 2400000, max: 3000000, rate: 0.25, fixed: 314000 },
            { min: 3000000, max: 4000000, rate: 0.30, fixed: 464000 },
            { min: 4000000, max: Infinity, rate: 0.35, fixed: 764000 }
        ],
        freelancer: [
            { min: 0, max: Infinity, rate: 0.01, fixed: 0 }
        ]
    }
};

let activeFrequency = 'monthly';

function setFrequency(freq) {
    activeFrequency = freq;
    const monthlyBtn = document.getElementById('toggleMonthly');
    const yearlyBtn = document.getElementById('toggleYearly');
    const label = document.getElementById('incomeLabel');

    if (freq === 'monthly') {
        monthlyBtn.classList.add('active');
        yearlyBtn.classList.remove('active');
        label.innerText = "Enter Monthly Income (PKR)";
    } else {
        yearlyBtn.classList.add('active');
        monthlyBtn.classList.remove('active');
        label.innerText = "Enter Annual Income (PKR)";
    }
}

function formatCurrency(val) {
    return "PKR " + Math.round(val).toLocaleString();
}

function calculate() {
    const incomeInput = document.getElementById('incomeAmount');
    const amount = parseFloat(incomeInput.value);
    const errorMsg = document.getElementById('errorMsg');
    const source = document.getElementById('incomeSource').value;
    const year = document.getElementById('taxYear').value;

    if (!amount || amount <= 0) {
        errorMsg.innerText = "Please enter a valid income amount.";
        return;
    }
    errorMsg.innerText = "";

    // 🔴 LOGIC: Convert Monthly to Yearly for Slab Calculation
    const annualIncome = (activeFrequency === 'monthly') ? amount * 12 : amount;
    const monthlyIncome = annualIncome / 12;

    const slabs = taxData[year][source];
    let totalTax = 0;
    let appliedSlab = null;

    // 🔴 LOGIC: Slab Calculation
    for (const slab of slabs) {
        if (annualIncome > slab.min && annualIncome <= slab.max) {
            const taxableAbove = annualIncome - slab.min;
            totalTax = slab.fixed + (taxableAbove * slab.rate);
            appliedSlab = slab;
            break;
        } else if (annualIncome > slab.min && slab.max === Infinity) {
            const taxableAbove = annualIncome - slab.min;
            totalTax = slab.fixed + (taxableAbove * slab.rate);
            appliedSlab = slab;
            break;
        }
    }

    const monthlyTax = totalTax / 12;

    // Display Results
    updateUI(annualIncome, monthlyIncome, totalTax, monthlyTax, slabs);
}

function updateUI(annualInc, monthlyInc, annualTax, monthlyTax, slabs) {
    const res = document.getElementById('resultSection');
    res.classList.remove('hidden');

    document.getElementById('resYearlyIncome').innerText = formatCurrency(annualInc);
    document.getElementById('resYearlyTax').innerText = formatCurrency(annualTax);
    document.getElementById('resYearlyNet').innerText = formatCurrency(annualInc - annualTax);

    document.getElementById('resMonthlyIncome').innerText = formatCurrency(monthlyInc);
    document.getElementById('resMonthlyTax').innerText = formatCurrency(monthlyTax);
    document.getElementById('resMonthlyNet').innerText = formatCurrency(monthlyInc - monthlyTax);

    // Build Breakdown
    const list = document.getElementById('slabBreakdown');
    list.innerHTML = "";
    slabs.forEach(s => {
        const row = document.createElement('div');
        row.className = "breakdown-row";
        const maxText = s.max === Infinity ? "Above" : formatCurrency(s.max);
        row.innerHTML = `<span>Slab: ${formatCurrency(s.min)} - ${maxText}</span> <span>${s.rate * 100}%</span>`;
        if (annualInc > s.min) row.style.color = "var(--primary-blue)";
        list.appendChild(row);
    });
}

function resetForm() {
    document.getElementById('incomeAmount').value = "";
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('errorMsg').innerText = "";
=======
/**
 * 🔥 AdTaxify Tax Calculator (FINAL CLEAN VERSION)
 */

const DEFAULT_YEAR = "2024-2025";

let taxData = {};

// 🔴 JSON LOAD
fetch("tax-data.json")
    .then(res => res.json())
    .then(data => {
        taxData = data;
        console.log("✅ Tax data loaded");
    })
    .catch(() => {
        alert("❌ Tax data load failed! Check JSON file path.");
    });

// 🔴 SAFE SLABS GET
function getSlabs(year, source) {
    if (!taxData[year] || !taxData[year][source]) {
        alert("⚠️ Year data not found, using default year");
        return taxData[DEFAULT_YEAR][source];
    }
    return taxData[year][source];
}

let activeFrequency = 'monthly';

// 🔴 TOGGLE
function setFrequency(freq) {
    activeFrequency = freq;

    document.getElementById('toggleMonthly').classList.remove('active');
    document.getElementById('toggleYearly').classList.remove('active');

    document.getElementById(freq === 'monthly' ? 'toggleMonthly' : 'toggleYearly')
        .classList.add('active');

    document.getElementById('incomeLabel').innerText =
        freq === 'monthly'
            ? "Enter Monthly Income (PKR)"
            : "Enter Annual Income (PKR)";
}

// 🔴 FORMAT
function formatCurrency(val) {
    return "PKR " + Math.round(val).toLocaleString();
}

// 🔴 CALCULATE
function calculate() {
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const source = document.getElementById('incomeSource').value;
    const year = document.getElementById('taxYear').value;

    if (!amount || amount <= 0) {
        alert("Enter valid income");
        return;
    }

    if (!taxData || Object.keys(taxData).length === 0) {
        alert("Tax data still loading...");
        return;
    }

    const annualIncome = activeFrequency === 'monthly' ? amount * 12 : amount;
    const monthlyIncome = annualIncome / 12;

    const slabs = getSlabs(year, source);

    let totalTax = 0;
    let breakdownHTML = "";

    // ✅ CORRECT PROGRESSIVE TAX
    for (const slab of slabs) {
        if (annualIncome > slab.min) {

            const upper = Math.min(annualIncome, slab.max);
            const taxable = upper - slab.min;

            const tax = taxable * slab.rate;
            totalTax += tax;

            breakdownHTML += `
                <div class="break-item">
                    <span>${formatCurrency(slab.min)} - ${formatCurrency(slab.max)}</span>
                    <span>${formatCurrency(tax)}</span>
                </div>
            `;
        }
    }

    const monthlyTax = totalTax / 12;
    const yearlyNet = annualIncome - totalTax;
    const monthlyNet = yearlyNet / 12;

    // 🔴 UPDATE UI
    document.getElementById("resYearlyIncome").innerText = formatCurrency(annualIncome);
    document.getElementById("resYearlyTax").innerText = formatCurrency(totalTax);
    document.getElementById("resMonthlyTax").innerText = formatCurrency(monthlyTax);
    document.getElementById("resYearlyNet").innerText = formatCurrency(yearlyNet);
    document.getElementById("resMonthlyNet").innerText = formatCurrency(monthlyNet);
    document.getElementById("resMonthlyIncome").innerText = formatCurrency(monthlyIncome);

    document.getElementById("slabBreakdown").innerHTML = breakdownHTML;

    document.getElementById("resultSection").classList.remove("hidden");
}

// 🔴 RESET
function resetForm() {
<<<<<<< HEAD
    document.getElementById('incomeAmount').value = "";
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('errorMsg').innerText = "";
>>>>>>> caa148c (first commit)
=======
    document.getElementById("taxForm").reset();

    document.getElementById("resultSection").classList.add("hidden");

    document.getElementById("resYearlyIncome").innerText = "PKR 0";
    document.getElementById("resYearlyTax").innerText = "PKR 0";
    document.getElementById("resMonthlyTax").innerText = "PKR 0";
    document.getElementById("resYearlyNet").innerText = "PKR 0";
    document.getElementById("resMonthlyNet").innerText = "PKR 0";
    document.getElementById("resMonthlyIncome").innerText = "PKR 0";

    document.getElementById("slabBreakdown").innerHTML = "";
>>>>>>> 509bf70 (updated changes)
}