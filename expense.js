// Initialize arrays and totals
let incomeSources = [];
let expenses = [];
let totalIncome = 0;
let totalExpenses = 0;
let balance = 0;
let editingIndex = -1; // To track the index of the item being edited
let editingType = '';  // 'income' or 'expense'

// Initialize Chart.js charts
const incomeSourceChart = new Chart(document.getElementById('incomeSourceChart'), {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            label: 'Income Sources',
            data: [],
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                '#FF9F40', '#FF5C5C', '#5AD5E4', '#FFB6C1', '#F3A6A4'
            ]
        }]
    }
});

const expenseChart = new Chart(document.getElementById('expenseChart'), {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            label: 'Expenses',
            data: [],
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                '#FF9F40', '#FF5C5C', '#5AD5E4', '#FFB6C1', '#F3A6A4'
            ]
        }]
    }
});

// Load data from local storage when the page loads
function loadData() {
    const savedIncomeSources = JSON.parse(localStorage.getItem('incomeSources')) || [];
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    totalIncome = savedIncomeSources.reduce((sum, income) => sum + income.amount, 0);
    totalExpenses = savedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    balance = totalIncome - totalExpenses;

    incomeSources = savedIncomeSources;
    expenses = savedExpenses;

    document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
    document.getElementById('totalExpenses').innerText = totalExpenses.toFixed(2);
    document.getElementById('balance').innerText = balance.toFixed(2);

    renderIncomeList();
    renderExpenseList();
    updateCharts();
}

// Save data to local storage
function saveData() {
    localStorage.setItem('incomeSources', JSON.stringify(incomeSources));
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to add income
function addIncome() {
    const incomeSource = document.getElementById('incomeSource').value;
    const incomeAmount = parseFloat(document.getElementById('incomeAmount').value);
    const incomeDate = document.getElementById('incomeDate') ? document.getElementById('incomeDate').value : '';

    if (incomeSource && !isNaN(incomeAmount) && incomeAmount > 0) {
        if (editingIndex >= 0 && editingType === 'income') {
            // Update existing income
            incomeSources[editingIndex] = { name: incomeSource, amount: incomeAmount, date: incomeDate };
            totalIncome += incomeAmount - incomeSources[editingIndex].amount;
        } else {
            // Add new income
            incomeSources.push({ name: incomeSource, amount: incomeAmount, date: incomeDate });
            totalIncome += incomeAmount;
        }
        balance += incomeAmount - (editingType === 'income' ? incomeSources[editingIndex].amount : 0);
        document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
        document.getElementById('balance').innerText = balance.toFixed(2);
        resetEditing();
        renderIncomeList();
        updateCharts();
        saveData();  // Save data to local storage
    }
}

// Function to add expense
function addExpense() {
    const expenseDescription = document.getElementById('expenseDescription').value;
    const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);
    const expenseDate = document.getElementById('expenseDate') ? document.getElementById('expenseDate').value : '';

    if (expenseDescription && !isNaN(expenseAmount) && expenseAmount > 0) {
        if (editingIndex >= 0 && editingType === 'expense') {
            // Update existing expense
            expenses[editingIndex] = { description: expenseDescription, amount: expenseAmount, date: expenseDate };
            totalExpenses += expenseAmount - expenses[editingIndex].amount;
        } else {
            // Add new expense
            expenses.push({ description: expenseDescription, amount: expenseAmount, date: expenseDate });
            totalExpenses += expenseAmount;
        }
        balance -= expenseAmount - (editingType === 'expense' ? expenses[editingIndex].amount : 0);
        document.getElementById('totalExpenses').innerText = totalExpenses.toFixed(2);
        document.getElementById('balance').innerText = balance.toFixed(2);
        resetEditing();
        renderExpenseList();
        updateCharts();
        saveData();  // Save data to local storage
    }
}

// Function to render the income list
function renderIncomeList() {
    const incomeList = document.getElementById('incomeList');
    if (!incomeList) {
        console.error('Income list element not found');
        return;
    }
    incomeList.innerHTML = '';
    incomeSources.forEach((income, index) => {
        const listItem = document.createElement('li');

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'details';
        detailsDiv.textContent = `${income.name}: $${income.amount.toFixed(2)} (${income.date})`;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const editButton = document.createElement('button');
        editButton.classList.add("edit-btn");
        editButton.textContent = 'Edit';
        editButton.onclick = () => editIncome(index);
        actionsDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteIncome(index);
        actionsDiv.appendChild(deleteButton);

        listItem.appendChild(detailsDiv);
        listItem.appendChild(actionsDiv);

        incomeList.appendChild(listItem);
    });
}

// Function to render the expense list
function renderExpenseList() {
    const expenseList = document.getElementById('expensesList');
    if (!expenseList) {
        console.error('Expense list element not found');
        return;
    }
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const listItem = document.createElement('li');

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'details';
        detailsDiv.textContent = `${expense.description}: $${expense.amount.toFixed(2)} (${expense.date})`;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const editButton = document.createElement('button');
        editButton.classList.add("edit-btn");
        editButton.textContent = 'Edit';
        editButton.onclick = () => editExpense(index);
        actionsDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteExpense(index);
        actionsDiv.appendChild(deleteButton);

        listItem.appendChild(detailsDiv);
        listItem.appendChild(actionsDiv);

        expenseList.appendChild(listItem);
    });
}

// Function to delete income
function deleteIncome(index) {
    const income = incomeSources.splice(index, 1)[0];
    totalIncome -= income.amount;
    balance -= income.amount;
    document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
    document.getElementById('balance').innerText = balance.toFixed(2);
    renderIncomeList();
    updateCharts();
    saveData();  // Save data to local storage
}

// Function to delete expense
function deleteExpense(index) {
    const expense = expenses.splice(index, 1)[0];
    totalExpenses -= expense.amount;
    balance += expense.amount;
    document.getElementById('totalExpenses').innerText = totalExpenses.toFixed(2);
    document.getElementById('balance').innerText = balance.toFixed(2);
    renderExpenseList();
    updateCharts();
    saveData();  // Save data to local storage
}

// Function to edit income
function editIncome(index) {
    const incomeItem = incomeSources[index];
    document.getElementById('incomeSource').value = incomeItem.name;
    document.getElementById('incomeAmount').value = incomeItem.amount;
    document.getElementById('incomeDate').value = incomeItem.date || '';
    editingIndex = index;
    editingType = 'income';
}

// Function to edit expense
function editExpense(index) {
    const expenseItem = expenses[index];
    document.getElementById('expenseDescription').value = expenseItem.description;
    document.getElementById('expenseAmount').value = expenseItem.amount;
    document.getElementById('expenseDate').value = expenseItem.date || '';
    editingIndex = index;
    editingType = 'expense';
}

// Function to reset editing mode
function resetEditing() {
    editingIndex = -1;
    editingType = '';
    document.getElementById('incomeSource').value = '';
    document.getElementById('incomeAmount').value = '';
    document.getElementById('incomeDate').value = '';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDate').value = '';
}

// Function to update charts
function updateCharts() {
    // Update income chart
    const incomeLabels = incomeSources.map(source => source.name);
    const incomeData = incomeSources.map(source => source.amount);
    incomeSourceChart.data.labels = incomeLabels;
    incomeSourceChart.data.datasets[0].data = incomeData;
    incomeSourceChart.update();

    // Update expense chart
    const expenseLabels = expenses.map(exp => exp.description);
    const expenseData = expenses.map(exp => exp.amount);
    expenseChart.data.labels = expenseLabels;
    expenseChart.data.datasets[0].data = expenseData;
    expenseChart.update();
}

// Load data when the page loads
loadData();
