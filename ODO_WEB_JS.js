
async function generate() {
  const name = document.getElementById('nameInput').value;
  const vin = document.getElementById('vinInput').value;
  const employee = document.getElementById('employeeInput').value;
  const rDate = document.getElementById('dateInput').value;
  const nDate = rDate.split('-').slice(1).join('/') + '/' + rDate.split('-')[0];

  if (vin.length === 17) {
    try {
      // Fetch data from the NHTSA VIN Decoder API
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
      const data = await response.json();

      // Extract Make, Model, Year, and Body Class from the response
      const make = data.Results.find(item => item.Variable === 'Make')?.Value || 'Unknown';
      const model = data.Results.find(item => item.Variable === 'Model')?.Value || 'Unknown';
      const year = data.Results.find(item => item.Variable === 'Model Year')?.Value || 'Unknown';
      let body = data.Results.find(item => item.Variable === 'Body Class')?.Value || 'Unknown';

      if (make.includes("Unknown") || year.includes("Unknown") || body.includes("Unknown")) {
        alert("INVALID VIN");
      }
      else {

      if (body.includes("Sport Utility Vehicle") || body.includes("Multi-Purpose Vehicle")) {
        body = "SUV";
      }
      if (body.includes("Sedan")) {
        body = "Sedan";
      }
      if (body.includes("Hatchback")) {
        body = "Hatchback";
      }
      if (body.includes("Convertible")) {
        body = "Convertible";
      }
      if (body.includes("Pickup")) {
        body = "Pickup";
      }
      if (body.includes("Van")) {
        body = "Van";
      }
      if (body.includes("Minivan")) {
        body = "Minivan";
      }
      if (model.includes("Soul") || model.includes("Niro") || model.includes("C-Max") || model.includes("Outback") || model.includes("Venza") || model.includes("Impreza") || model.includes("A4")){
        body = "Wagon";
      }

      localStorage.setItem("make", make);
      localStorage.setItem("year", year);
      localStorage.setItem("body", body);
      localStorage.setItem("name", name);
      localStorage.setItem("vin", vin);
      localStorage.setItem("employee", employee || ""); // Allow blank value for employee
      localStorage.setItem("nDate", nDate);
      window.location.href = "ODO_PRINT.html"
    }

    } catch (error) {
      console.error('Error decoding VIN:', error);
      document.getElementById('make').textContent = 'Error fetching data.';
      document.getElementById('year').textContent = 'Error fetching data.';
      document.getElementById('body').textContent = 'Error fetching data.';
    } 
  } else {
    alert("INVALID VIN");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("make").textContent = localStorage.getItem("make") || "N/A";
  document.getElementById("year").textContent = localStorage.getItem("year") || "N/A";
  document.getElementById("body").textContent = localStorage.getItem("body") || "N/A";
  document.getElementById("name").textContent = localStorage.getItem("name") || "N/A";
  document.getElementById("name2").textContent = localStorage.getItem("name") || "N/A";
  document.getElementById("vin").textContent = localStorage.getItem("vin") || "N/A";
  document.getElementById("employee").textContent = localStorage.getItem("employee") || ""; // Handle blank employee value
  document.getElementById("nDate").textContent = localStorage.getItem("nDate") || "N/A";
});

