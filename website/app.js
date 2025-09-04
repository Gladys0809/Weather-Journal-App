const apiKey = '3c7c11b9b92d3a4df93683d9df741a5b&units=imperial';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';

const $ = (id) => document.getElementById(id); 
const newDate = () => {
  const d = new Date();
  return `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;
};

// ===== $('generate').addEventListener('click', onGenerateClick);

document.getElementById('generate').addEventListener('click', performAction);

async function performAction() {
  const zip = $('zip').value.trim();
  const feel = $('feelings').value.trim();

  if (!zip) {
    alert('Please enter a zip code.');
    return;
  }

  try {
    // ===== Asynchronous function to fetch data from external API =====
    const weather = await getWeatherByZip(zip);

    // Prepare the entry we will post to the app endpoint
    const entry = {
      date: newDate(),
      temp: weather?.main?.temp,
      feel
    };

    // ===== Client-side async POST to app endpoint =====
    await postData('/add', entry);

    // ===== Async function to GET from app endpoint and update UI =====
    await retrieveAndUpdateUI();
  } catch (err) {
    console.error('App error:', err);
    alert('Something went wrong. Check the console for details.');
  }
}

// --- Networking ---

async function getWeatherByZip(zip) {
  const url = `${baseURL}${encodeURIComponent(zip)}&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather fetch failed: ${res.status} ${res.statusText}`);
}

return await res.json();
}

async function postData(url = '', data = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`POST failed: ${res.status}`);
  return await res.json();
}

// ==== Function to GET Project Data and dynamically update DOM =====
async function retrieveAndUpdateUI() {
  try {
    const request = await fetch('/all');
    const allData = await request.json();
    console.log(allData);

    // Updated data to DOM elements
    $('temp').innerHTML = `Temp: ${Math.round(allData.temp)}°F`;
    $('content').innerHTML = `Feelings: ${allData.feel || ''}`;
    $('date').innerHTML = `Date: ${allData.date}`;
  } catch (error) {
    console.log('error', error);
  }
}
