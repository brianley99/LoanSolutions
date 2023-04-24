//Controller
function calculateLoan() {

    //get inputs from page
    let balance = parseInt(document.getElementById('balanceValue').value);
    let term = parseInt(document.getElementById('termValue').value);
    let rate = parseInt(document.getElementById('rateValue').value);

    //input validation
    if (Number.isInteger(balance) == false) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Enter an integer for Loan Amount',
        })
        return;
    }
    if (Number.isInteger(term) == false) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Enter an integer for Term',
        })
        return;
    }
    if (Number.isInteger(rate) == false) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Enter an integer for Rate',
        })
        return;
    }

    //do calculations
    let loan = createLoan(balance, term, rate);

    //display results
    displayLoan(loan);
}

//Logic
function createLoan(balance, term, rate) {

    //calculate and set payments to loan

    let totalMonthlyPayment = (balance) * (rate / 1200) / (1 - Math.pow((1 + rate / 1200), -term));

    let remainingBalance = balance;
    let totalInterest = 0;
    let payments = [];

    for (let month = 1; month <= term; month++) {

        //interest payment
        let interestPayment = remainingBalance * (rate / 1200);
        totalInterest += interestPayment;

        //principal payment
        let principalPayment = totalMonthlyPayment - interestPayment;

        //remaining balance
        remainingBalance -= principalPayment;

        //create and add payment
        let payment = {
            month: month,
            totalMonthlyPayment: totalMonthlyPayment,
            interestPayment: interestPayment,
            totalInterest: totalInterest,
            principalPayment: principalPayment,
            remainingBalance: Math.abs(remainingBalance),
        }

        //add payment
        payments.push(payment);
    }

    //create loan object and return
    let loan = {
        balance: balance,
        term: term,
        rate: rate,
        payments: payments,
        totalInterest: totalInterest,
        totalCost: balance + totalInterest
    }

    return loan;
}

//View
function displayLoan(loan) {

    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })

    document.getElementById('monthlyPayments').textContent = formatter.format(loan.payments[0].totalMonthlyPayment);
    document.getElementById('totalPrincipal').textContent = formatter.format(loan.balance);
    document.getElementById('totalInterest').textContent = formatter.format(loan.totalInterest);
    document.getElementById('totalCost').textContent = formatter.format(loan.totalCost);

    //Reset payments table
    const loanPaymentsTable = document.getElementById('loanTableBody');
    loanPaymentsTable.innerHTML = '';

    //Get template for table rows
    let template = document.getElementById('loanTableBodyTemplate');

    //Format each event and add to table 
    for (let i = 0; i < loan.payments.length; i++) {
        const payment = loan.payments[i];
        let tableRow = document.importNode(template.content, true);

        tableRow.querySelector('[data-id="month"]').textContent = payment.month;
        tableRow.querySelector('[data-id="payment"]').textContent = formatter.format(payment.totalMonthlyPayment);
        tableRow.querySelector('[data-id="principal"]').textContent = formatter.format(payment.principalPayment);
        tableRow.querySelector('[data-id="interest"]').textContent = formatter.format(payment.interestPayment);
        tableRow.querySelector('[data-id="totalInterest"]').textContent = formatter.format(payment.totalInterest);
        tableRow.querySelector('[data-id="balance"]').textContent = formatter.format(payment.remainingBalance);

        //add to page
        loanPaymentsTable.appendChild(tableRow);
    };

    //display to page
    document.getElementById('results').classList.remove('d-none');

}

let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})