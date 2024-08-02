document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');
    const addButton = document.getElementById('add-btn');
    const headingInput = document.getElementById('heading-input');
    const contentInput = document.getElementById('content-input');
    const linkInput = document.getElementById('link-input'); // New link input
    const donutChartCanvas = document.getElementById('donutChart');
    let chart;

    // Function to load items from local storage
    function loadItems() {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.forEach(item => addItemToDOM(item));
        updateChart();
    }

    // Function to save items to local storage
    function saveItems() {
        const items = [];
        document.querySelectorAll('.item-box').forEach(itemBox => {
            const heading = itemBox.querySelector('.heading select').value;
            const content = itemBox.querySelector('.conText').textContent;
            const link = itemBox.querySelector('.code-link a').href;
            items.push({ heading, content, link });
        });
        localStorage.setItem('items', JSON.stringify(items));
    }

    // Function to add an item to the DOM
    function addItemToDOM(item) {
        const heading = headingInput.value.trim();
        const content = contentInput.value.trim();
        const link = linkInput.value.trim(); // Get the link input value
        const itemBox = document.createElement('div');
        itemBox.classList.add('item-box');
        itemBox.innerHTML = `
            <div class="title">
                <div class="heading">
                    <span>${heading}</span>
                    <select name="difficulty">
                        <option value="Hard" ${item.heading === 'Hard' ? 'selected' : ''}>Hard</option>
                        <option value="Medium" ${item.heading === 'Medium' ? 'selected' : ''}>Medium</option>
                        <option value="Easy" ${item.heading === 'Easy' ? 'selected' : ''}>Easy</option>
                    </select>
                </div>
                <div class="item-icons">
                    <span class="material-symbols-outlined edit" onclick="editItem(this)">edit</span>
                    <span class="material-symbols-outlined delete" onclick="deleteItem(this)">delete</span>
                </div>
            </div>
            <hr>
            <div class="content">
                <span class="conText">${content}</span>
            </div>
            <hr>
            <div class="code-link">
                <span><a href="${link}" target="_blank" class="link">Source Code</a></span> <!-- Add link dynamically -->
            </div>
        `;
        itemsContainer.appendChild(itemBox);
        updateChart();
    }

    // Function to update the donut chart
    function updateChart() {
        const counts = { Hard: 0, Medium: 0, Easy: 0 };
        document.querySelectorAll('.item-box').forEach(itemBox => {
            const heading = itemBox.querySelector('.heading select').value;
            counts[heading]++;
        });

        if (chart) {
            chart.data.datasets[0].data = [counts.Hard, counts.Medium, counts.Easy];
            chart.update();
        } else {
            chart = new Chart(donutChartCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Hard', 'Medium', 'Easy'],
                    datasets: [{
                        data: [counts.Hard, counts.Medium, counts.Easy],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Add new item
    addButton.addEventListener('click', () => {
        const heading = headingInput.value.trim();
        const content = contentInput.value.trim();
        const link = linkInput.value.trim(); // Get the link input value
        if (heading && content) {
            addItemToDOM({ heading, content, link });
            headingInput.value = '';
            contentInput.value = '';
            linkInput.value = ''; // Clear link input
            saveItems();
        } else {
            alert('Please enter both heading and content.');
        }
    });

    // Edit an item
    window.editItem = function (element) {
        const itemBox = element.closest('.item-box');
        const headingSelect = itemBox.querySelector('.heading select');
        const contentSpan = itemBox.querySelector('.conText');
        const linkInput = itemBox.querySelector('.code-link a');
        const newHeading = prompt('Edit heading:', headingSelect.value);
        const newContent = prompt('Edit content:', contentSpan.textContent);
        const newLink = prompt('Edit Source Code URL:', linkInput.href);

        if (newHeading && newContent && newLink) {
            headingSelect.value = newHeading;
            contentSpan.textContent = newContent;
            linkInput.href = newLink;
            linkInput.textContent = 'Source Code'; // Update link text
            saveItems();
            updateChart();
        }
    };

    // Delete an item
    window.deleteItem = function (element) {
        const itemBox = element.closest('.item-box');
        itemBox.remove();
        saveItems();
        updateChart();
    };

    // Load items from local storage when the page is loaded
    loadItems();
});
