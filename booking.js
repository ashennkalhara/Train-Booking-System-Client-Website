document.addEventListener("DOMContentLoaded", function () {
    var getTrainsBtn = document.getElementById("getTrainsBtn");
    var searchBtn = document.getElementById("searchBtn");

    getTrainsBtn.addEventListener("click", getAllTrains);
    searchBtn.addEventListener("click", searchTrains);
});

function getAllTrains() {
    console.log("Fetching all trains..."); 
    fetch("https://localhost:7125/api/Train")
        .then(response => response.json())
        .then(data => {
            console.log("All trains data:", data); 
            displayTrains(data);
        })
        .catch(error => console.error("Error:", error));
}

function searchTrains() {
    var dateInput = document.getElementById("date").value;
    var parts = dateInput.split("-");
    var formattedDate = parts[0] + "." + parts[1] + "." + parts[2];
    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    console.log("Searching trains with date:", formattedDate, "from", start, "to", end); 

    fetch("https://localhost:7125/api/Train/Search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Date: formattedDate,
            StartStation: start,
            DestinationStation: end
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Searched trains data:", data); 
            displayTrains(data);
        })
        .catch(error => console.error("Error:", error));
}


function displayTrains(data) {
    console.log("Displaying trains..."); 
    var tableBody = document.getElementById("trainData");
    tableBody.innerHTML = "";

    data.forEach(train => {
        var row = `<tr>
            <td>${train.trainId}</td>
            <td>${train.name}</td>
            <td>${train.startStation}</td>
            <td>${train.destinationStation}</td>
            <td>${train.capacity}</td>
            <td>${train.departureTime}</td>
            <td>${train.arrivalTime}</td>
            <td>${train.date}</td>
            <td><button onclick="bookTicket(${train.trainId}, '${train.startStation}', '${train.destinationStation}', 
            '${train.date}', '${train.departureTime}', '${train.arrivalTime}', ${train.capacity})">Book Ticket</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}


function bookTicket(trainId, startStation, destinationStation, date, departureTime, arrivalTime, capacity) {
    console.log("Booking ticket for train:", trainId); 
    var nicNumber = prompt("Enter Your NIC number again:");
    if (!nicNumber) return;
    var seatCapacity = parseInt(prompt("Enter seat capacity:"));
    if (isNaN(seatCapacity) || seatCapacity <= 0) {
        alert("Invalid seat capacity. Please enter a valid number.");
        return;
    }
    if (seatCapacity > 5) {
        alert("You can book 5 seats only.");
        return;
    }

    var tableRows = document.querySelectorAll("#trainData tr");
    tableRows.forEach(row => {
        var trainIdCell = row.querySelector("td:first-child");
        if (trainIdCell && trainIdCell.textContent == trainId) {
            var capacityCell = row.querySelector("td:nth-child(5)");
            if (capacityCell) {
                var newCapacity = parseInt(capacityCell.textContent) - seatCapacity;
                capacityCell.textContent = newCapacity;
            }
        }
    });

    fetch("https://localhost:7125/api/Booking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            TrainId: trainId,
            NIC: nicNumber,
            SeatCapacity: seatCapacity,
            StartStation: startStation,
            DestinationStation: destinationStation,
            DepartureTime: departureTime,
            ArrivalTime: arrivalTime,
            Date: date
        })
    })
        .then(response => {
            if (response.ok) {
                alert("Booking confirmed successfully!");
            } else {
                alert("Failed to confirm booking.");
            }
        })
        .catch(error => console.error("Error:", error));
}

