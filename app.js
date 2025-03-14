import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ✅ Firebase Yapılandırması
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "chfi-5aa14.firebaseapp.com",
  databaseURL: "https://chfi-5aa14-default-rtdb.firebaseio.com",
  projectId: "chfi-5aa14",
  storageBucket: "chfi-5aa14.appspot.com",
  messagingSenderId: "717108421974",
  appId: "1:717108421974:web:9336883d4a9a65f93462f7",
  measurementId: "G-14X9BJM6H1"
};

// Firebase Başlat
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ✅ Firebase'den GPS verisini oku
const GPS = ref(database, "Child");

let gpslat = 0;
let gpslon = 0;
let map;
let marker;

// Haritayı Başlat
function initMap(lat, lon) {
    let mapOptions = {
        zoom: 18,
        center: { lat: lat, lng: lon },
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    marker = new google.maps.Marker({
        position: { lat: lat, lng: lon },
        map: map,
        title: "Çocuğun Konumu"
    });

    console.log("Harita başlatıldı...");
}

// Firebase verisi geldiğinde çalıştırılacak fonksiyon
function handleNewData(snapshot) {
    if (snapshot.exists()) {
        let data = snapshot.val();
        console.log("Firebase'den gelen veri:", data);

        gpslat = parseFloat(data.GPSlatitude);  
        gpslon = parseFloat(data.GPSlongitude);

        document.getElementById('GPSlatitude').innerHTML = gpslat;
        document.getElementById('GPSlongitude').innerHTML = gpslon;
        document.getElementById('state').innerHTML = data.GPSMode;

        if (!map) {
            initMap(gpslat, gpslon);  // İlk kez haritayı başlat
        } else {
            updateMarkerAndMap();
        }
    }
}

// Firebase verisini dinle
onValue(GPS, handleNewData);

// ✅ Marker ve Haritayı Güncelle
function updateMarkerAndMap() {
    if (!map || !marker) return;

    let latlng = new google.maps.LatLng(gpslat, gpslon);
    
    marker.setPosition(latlng);
    map.setCenter(latlng);

    console.log("Harita güncellendi: ", gpslat, gpslon);
}
