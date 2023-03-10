// https://geo.ipify.org/
// https://leafletjs.com/

/* Your users should be able to:

- View the optimal layout for each page depending on their device's screen size
- See hover states for all interactive elements on the page
- See their own IP address on the map on the initial page load
- Search for any IP addresses or domains and see the key information and location */

/* - [API Key best practices from Google Developers](https://developers.google.com/maps/api-key-best-practices)
- [How to use Mapbox securely](https://docs.mapbox.com/help/troubleshooting/how-to-use-mapbox-securely/)
*/ 

const input = document.querySelector('.search-input')
const button = document.querySelector('.search-btn')
const ipEl = document.querySelector('.ip-result')
const locationEl = document.querySelector('.location-result')
const timeEl = document.querySelector('.timezone-result')
const ispEl = document.querySelector('.isp-result')

// event listener for search button
button.addEventListener('click', function(e) {
  e.preventDefault();
  map.remove();
  document.querySelector('main').appendChild(document.createElement('div')).setAttribute("id", "map")
  fetchDetails()
})

// initial function block to get user IP address and get coordinates for that IP; 
// can be changed later on once user makes request 

async function getIpAddress() {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return data.ip
  } catch (error) {
    console.error(error)
  }
}

// API call to get coordinates to be displayed by leaflet map

async function fetchGeo(ip) {
  try {
    const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_I6W8LXRSmni2Er5pShOMcWjbRW4dI&ipAddress=${ip}`)
    const data = await res.json()
    console.log(data)

    // creating map

    let map = L.map('map').setView([data.location.lat, data.location.lng], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // adding custom marker

    let customMarker = L.icon({
      iconUrl: './img/icon-location.svg',
      iconSize: [38, 50]
    })

    L.marker([data.location.lat, data.location.lng], {icon: customMarker}).addTo(map)

    ipEl.innerText = data.ip
    ipEl.style.color = '#2b2b2b'
    locationEl.innerText = data.location.city + ', ' + data.location.country
    timeEl.innerText = 'UTC ' + data.location.timezone 
    ispEl.innerText = data.isp

  } catch (error) {
    ipEl.innerHTML = "NOT A VALID IP!"
    ipEl.style.color = 'red' 
  }
}

async function fetchDetails() {
  let ip;
  if (input.value != "") {
    ip = input.value
  } else {
    ip = await getIpAddress();
  }
  fetchGeo(ip)
}

// call function initially to render out user IP location

fetchDetails()



