function setDatePlaceholder() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  document.getElementById('dateInput').value = formattedDate;
}

function setLocation(location) {
  localStorage.setItem('location', location);
}

function getSelectedLocation() {
  const selected = document.querySelector('input[name="location"]:checked');
  return selected ? selected.value : "tolleson"; // fallback if nothing is selected
}

async function generate() {
  const location = getSelectedLocation();
  localStorage.setItem('location', location);
  const nameInput = document.getElementById('nameInput').value;
  const name = nameInput.trim() === "" ? " " : nameInput;

  const vin = document.getElementById('vinInput').value;
  const employeeInput = document.getElementById('employeeInput').value;
  const employee = employeeInput.trim() === "" ? " " : employeeInput;

  const rDate = document.getElementById('dateInput').value;
  const nDate = rDate ? rDate.split('-').slice(1).join('/') + '/' + rDate.split('-')[0] : " ";

  if (vin.length === 17) {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
      const data = await response.json();

      const make = data.Results.find(item => item.Variable === 'Make')?.Value || 'Unknown';
      const model = data.Results.find(item => item.Variable === 'Model')?.Value || 'Unknown';
      const year = data.Results.find(item => item.Variable === 'Model Year')?.Value || 'Unknown';
      let body = data.Results.find(item => item.Variable === 'Body Class')?.Value || 'Unknown';

      if (make === 'Unknown' || year === 'Unknown' || body === 'Unknown') {
        throw new Error("VIN Decode returned incomplete data");
      }

      if (body.includes("Sport Utility Vehicle") || body.includes("Multi-Purpose Vehicle") || body.includes("Crossover Utility Vehicle")) body = "SUV";
      if (body.includes("Sedan")) body = "Sedan";
      if (body.includes("Hatchback")) body = "Hatchback";
      if (body.includes("Convertible")) body = "Convertible";
      if (body.includes("Pickup")) body = "Pickup";
      if (body.includes("Van")) body = "Van";
      if (body.includes("Minivan")) body = "Minivan";
      if (["Soul", "Niro", "C-Max", "Outback", "Venza", "Impreza", "A4"].some(m => model.includes(m))) body = "Wagon";
      if (model.includes("Kicks")) body = "SUV";
      if (model.includes("Rogue Sport")) body = "SUV";

      localStorage.setItem("make", make);
      localStorage.setItem("year", year);
      localStorage.setItem("body", body);
      localStorage.setItem("name", name);
      localStorage.setItem("vin", vin);
      localStorage.setItem("employee", employee);
      localStorage.setItem("nDate", nDate);

      if (location === "casa") {
        window.location.href = "ODO_PRINT_CASA.html";
      } else {
        window.location.href = "ODO_PRINT.html";
      }

    } catch (error) {
      alert("VIN could not be decoded at this time. Please enter Make, Year, and Body Style manually.");
      document.getElementById("manualInput").style.display = "block";
    }
  } else {
    alert("Invalid VIN. Must be 17 characters.");
  }
}

function submitManualData() {
  const make = document.getElementById('manualMake').value.trim() || "Unknown";
  const year = document.getElementById('manualYear').value.trim() || "Unknown";
  let body = document.getElementById('manualBody').value.trim() || "Unknown";

  const nameInput = document.getElementById('nameInput').value.trim() || " ";
  const vin = document.getElementById('vinInput').value.trim() || " ";
  const employeeInput = document.getElementById('employeeInput').value.trim() || " ";

  const rDate = document.getElementById('dateInput').value;
  const nDate = rDate ? rDate.split('-').slice(1).join('/') + '/' + rDate.split('-')[0] : " ";

  const location = getSelectedLocation();

  localStorage.setItem("make", make);
  localStorage.setItem("year", year);
  localStorage.setItem("body", body);
  localStorage.setItem("name", nameInput);
  localStorage.setItem("vin", vin);
  localStorage.setItem("employee", employeeInput);
  localStorage.setItem("nDate", nDate);
  localStorage.setItem("location", location);

  if (location === "casa") {
    window.location.href = "ODO_PRINT_CASA.html";
  } else {
    window.location.href = "ODO_PRINT.html";
  }
}

// Runs on the PRINT page only
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("make")) return; // Exit if not on print page

  document.getElementById("make").textContent = localStorage.getItem("make") || "N/A";
  document.getElementById("year").textContent = localStorage.getItem("year") || "N/A";
  document.getElementById("body").textContent = localStorage.getItem("body") || "N/A";
  document.getElementById("name").textContent = localStorage.getItem("name") || " ";
  document.getElementById("name2").textContent = localStorage.getItem("name") || " ";
  document.getElementById("vin").textContent = localStorage.getItem("vin") || "N/A";
  document.getElementById("employee").textContent = localStorage.getItem("employee") || " ";
  document.getElementById("nDate").textContent = localStorage.getItem("nDate") || "N/A";

  const location = localStorage.getItem("location") || "tolleson";
  if (location === "tolleson") {
    document.getElementById("locationName").textContent = "CARVANA LLC";
    document.getElementById("locationNumber").textContent = "L00015079";
    document.getElementById("addressStreet").textContent = "600 S 94th Ave";
    document.getElementById("addressCity").textContent = "TOLLESON";
    document.getElementById("addressZip").textContent = "85353";
  } else if (location === "casa") {
    document.getElementById("locationName").textContent = "Casa Grande Chrysler Dodge Jeep Ram";
    document.getElementById("locationNumber").textContent = "L10002668";
    document.getElementById("addressStreet").textContent = "2425 E Florence Blvd Suite D";
    document.getElementById("addressCity").textContent = "CASA GRANDE";
    document.getElementById("addressZip").textContent = "85194";
  }
});

function printForm() {
  window.print();
}

function openPopup() {
  document.getElementById('popup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function sendEmail() {
  const recipient = "timothy.dyball@carvana.com";
  const subject = "Bug in ODO App";
  const body = "I have found a bug! VIN: (type here), Summary:";
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, '_blank');
}

function printOnLoad() {
  window.print();
}
