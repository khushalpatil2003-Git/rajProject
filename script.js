// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBrGbJ9b_S8kvV6SBa7FpKMYa37Lixt22s",
    authDomain: "smart-parking-system-b3120.firebaseapp.com",
    databaseURL: "https://smart-parking-system-b3120-default-rtdb.firebaseio.com",
    projectId: "smart-parking-system-b3120",
    storageBucket: "smart-parking-system-b3120.firebasestorage.app",
    messagingSenderId: "273497621250",
    appId: "1:273497621250:web:a17d24e5a4835e6bfd781b",
    measurementId: "G-ZTB0LWNDEL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// References to the parking slots in Firebase
const slot1Ref = database.ref('/parking/slot1');
const slot2Ref = database.ref('/parking/slot2');

// Chart.js setup
const ctx = document.getElementById('parkingChart').getContext('2d');
const parkingChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Slot 1', 'Slot 2'],
    datasets: [{
      label: 'Parking Status',
      data: [0, 0],
      backgroundColor: ['#d4edda', '#f8d7da'],
      borderColor: ['#155724', '#721c24'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeInOutBounce'
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
});

// Function to update the UI
const updateSlotStatus = (slotElement, status) => {
  slotElement.innerText = status ? "Occupied" : "Available";
  slotElement.className = `slot ${status ? 'occupied' : 'available'}`;
};

// Function to update the total available slots
const updateTotalSlots = (slot1Status, slot2Status) => {
  const totalAvailable = (slot1Status ? 0 : 1) + (slot2Status ? 0 : 1);
  document.getElementById('totalSlots').innerText = `Total Available Slots: ${totalAvailable}`;
};

// Function to update the chart
const updateChart = (slot1Status, slot2Status) => {
  parkingChart.data.datasets[0].data = [slot1Status ? 1 : 0, slot2Status ? 1 : 0];
  parkingChart.update();
};

// Listen for changes in Slot 1
slot1Ref.on('value', (snapshot) => {
  const status = snapshot.val();
  updateSlotStatus(document.getElementById('slot1'), status);
  updateTotalSlots(status, parkingChart.data.datasets[0].data[1]);
  updateChart(status, parkingChart.data.datasets[0].data[1]);
});

// Listen for changes in Slot 2
slot2Ref.on('value', (snapshot) => {
  const status = snapshot.val();
  updateSlotStatus(document.getElementById('slot2'), status);
  updateTotalSlots(parkingChart.data.datasets[0].data[0], status);
  updateChart(parkingChart.data.datasets[0].data[0], status);
});

// Auto-refresh every 10 seconds
setInterval(refreshStatus, 10000);

// Refresh button functionality
function refreshStatus() {
  slot1Ref.once('value').then(snapshot => updateSlotStatus(document.getElementById('slot1'), snapshot.val()));
  slot2Ref.once('value').then(snapshot => updateSlotStatus(document.getElementById('slot2'), snapshot.val()));
}

// Admin login functionality
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginMessage = document.getElementById('login-message');

  if (username === "admin" && password === "admin123") {
    loginMessage.textContent = "Login successful!";
    loginMessage.style.color = "green";
  } else {
    loginMessage.textContent = "Invalid credentials!";
    loginMessage.style.color = "red";
  }
  loginMessage.classList.remove('hidden');
  setTimeout(() => loginMessage.classList.add('hidden'), 3000);
}
