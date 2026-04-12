/**
 * 🔥 AdTaxify Tax Calculator (FINAL PRODUCTION VERSION)
 */

const DEFAULT_YEAR = "2024-2025";

let taxData = {};
let isDataLoaded = false;

// 🔴 JSON LOAD
fetch("tax-data.json")
    .then(res => res.json())
    .then(data => {
        taxData = data;
        isDataLoaded = true;
        console.log("✅ Tax data loaded");
    })
    .catch(() => {
        alert("❌ Tax data load failed! Check JSON file path.");
    });

// 🔴 SAFE SLABS GET
function getSlabs(year, source) {
    if (!taxData[year] || !taxData[year][source]) {
        console.warn("⚠️ Year not found, using default");
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

    if (!isDataLoaded) {
        alert("Tax data still loading...");
        return;
    }

    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const source = document.getElementById('incomeSource').value;
    const year = document.getElementById('taxYear').value;

    if (!amount || amount <= 0) {
        alert("Enter valid income");
        return;
    }

    const annualIncome = activeFrequency === 'monthly' ? amount * 12 : amount;
    const monthlyIncome = annualIncome / 12;

    const slabs = getSlabs(year, source);

    let totalTax = 0;
    let breakdownHTML = "";

    // ✅ PROGRESSIVE TAX LOGIC
    for (const slab of slabs) {

        if (annualIncome >= slab.min) {

            const upper = Math.min(annualIncome, slab.max);
            const taxable = upper - slab.min;

            if (taxable <= 0) continue;

            const tax = taxable * slab.rate;
            totalTax += tax;

            breakdownHTML += `
                <div class="break-item">
                    <span>
                        ${formatCurrency(slab.min)} - 
                        ${slab.max >= 1e11 ? "Above" : formatCurrency(slab.max)}
                    </span>
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

    document.getElementById("taxForm").reset();

    document.getElementById("resultSection").classList.add("hidden");

    document.getElementById("resYearlyIncome").innerText = "PKR 0";
    document.getElementById("resYearlyTax").innerText = "PKR 0";
    document.getElementById("resMonthlyTax").innerText = "PKR 0";
    document.getElementById("resYearlyNet").innerText = "PKR 0";
    document.getElementById("resMonthlyNet").innerText = "PKR 0";
    document.getElementById("resMonthlyIncome").innerText = "PKR 0";

    document.getElementById("slabBreakdown").innerHTML = "";
}