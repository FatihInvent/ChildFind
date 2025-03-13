import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getDatabase, ref, onValue 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ✅ Firebase Yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyAUscEzZqCP5GI086-tPUh9LDK3ZSdgyQ4",
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

function handleNewData(snapshot) {
    if (snapshot.exists()) {
        let data = snapshot.val();  // JSON olarak veriyi al
        console.log("Firebase'den gelen veri:", data); // Konsola yazdır

        gpslat = data.GPSlatitude;  
        gpslon = data.GPSlongitude;
        
        // HTML güncelle
        document.getElementById('GPSlatitude').innerHTML = gpslat;
        document.getElementById('GPSlongitude').innerHTML = gpslon;
        document.getElementById('state').innerHTML = data.GPSMode; // GPS OK veya hata durumu
        
        updateMarkerAndMap();  // Haritayı güncelle
    }
}

// Firebase verisini dinle
onValue(GPS, handleNewData);

// ✅ Google Harita ve Marker İşlemleri
let map;
let marker;

function initMap() {
    let mapOptions = {
        zoom: 18,
        center: { lat: gpslat, lng: gpslon },
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    marker = new google.maps.Marker({
        position: { lat: gpslat, lng: gpslon },
        map: map,
    });

    console.log("Harita başlatıldı...");
}

window.initMap = initMap;

// ✅ Harita ve Marker Güncelleme Fonksiyonu
function updateMarkerAndMap() {
    if (!map || !marker) return; // Eğer harita yüklenmemişse hata verme

    let latlng = new google.maps.LatLng(gpslat, gpslon);

    marker.setPosition(latlng);
    map.setCenter(latlng);

    console.log("Harita güncellendi: ", gpslat, gpslon);
}
