// Get references to the DOM elements
const monthYear = document.getElementById('month-year');
const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');
const calendarDays = document.querySelector('.calendar-days');

const modal = document.getElementById('event-modal');
const closeModal = document.querySelector('.close');
const saveEventBtn = document.getElementById('save-event');
const eventTitleInput = document.getElementById('event-title');
const eventColorSelect = document.getElementById('event-color');
const eventIndexInput = document.getElementById('event-index'); // Hidden input for event index

let events = JSON.parse(localStorage.getItem('events')) || []; // Load events from local storage

// Initialize current month and year to the present date
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate; // This will store the date selected for adding an event

// Function to generate the calendar for a given month and year
function generateCalendar(month, year) {
    calendarDays.innerHTML = ''; // Clear the calendar days
    monthYear.textContent = new Date(year, month).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    // Get the first day of the month and number of days in the month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill the first row with empty spaces until the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendarDays.appendChild(document.createElement('div'));
    }

    // Fill the calendar with days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.addEventListener('click', () => openModal(year, month, day)); // Add event listener to open modal

        // Check if there are any events on this day and display them
        const dayEvents = events.filter(e => new Date(e.date).toDateString() === new Date(year, month, day).toDateString());
        dayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add("event-box");
            eventElement.textContent = event.title;
            eventElement.classList.add('event', event.color); // Add event color class
            
            // Add edit and delete buttons
            const editButton = document.createElement('button');
            editButton.classList.add("edit");
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(year, month, day, events.indexOf(event));
            });
            editButton.classList.add('edit');
            eventElement.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add("delete");
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteEvent(events.indexOf(event));
            });
            deleteButton.classList.add('delete');
            eventElement.appendChild(deleteButton);

            dayElement.appendChild(eventElement);
        });

        calendarDays.appendChild(dayElement);
    }
}

// Function to open the modal and set the selected date
function openModal(year, month, day, eventIndex = -1) {
    selectedDate = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0]; // Use UTC date to avoid time zone issues
    eventIndexInput.value = eventIndex;

    if (eventIndex >= 0) {
        const event = events[eventIndex];
        eventTitleInput.value = event.title;
        eventColorSelect.value = event.color;
    } else {
        eventTitleInput.value = '';
        eventColorSelect.value = 'blue';
    }

    modal.style.display = 'block'; // Display the modal
}

// Function to close the modal and reset inputs
function closeModalHandler() {
    modal.style.display = 'none'; // Hide the modal
    eventTitleInput.value = ''; // Clear event title input
    eventColorSelect.value = 'blue'; // Reset event color to default
}

// Function to save a new event or edit an existing one
function saveEvent() {
    const title = eventTitleInput.value;
    const color = eventColorSelect.value;
    const eventIndex = eventIndexInput.value;

    if (title && color) {
        if (eventIndex >= 0) {
            // Edit existing event
            events[eventIndex] = { date: selectedDate, title, color };
        } else {
            // Add new event
            events.push({ date: selectedDate, title, color });
        }
        closeModalHandler(); // Close the modal
        generateCalendar(currentMonth, currentYear); // Regenerate the calendar to reflect the new event
        localStorage.setItem('events', JSON.stringify(events)); // Save events to local storage
    }
}

// Function to delete an event
function deleteEvent(eventIndex) {
    events.splice(eventIndex, 1);
    generateCalendar(currentMonth, currentYear); // Regenerate the calendar to reflect the deletion
    localStorage.setItem('events', JSON.stringify(events)); // Save updated events to local storage
}

// Event listeners for navigating between months
prevMonth.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
});

nextMonth.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
});

// Event listener for closing the modal
closeModal.addEventListener('click', closeModalHandler);

// Event listener for saving the event
saveEventBtn.addEventListener('click', saveEvent);

// Generate the initial calendar
generateCalendar(currentMonth, currentYear);
