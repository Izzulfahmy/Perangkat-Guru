// js/helpers.js

/**
 * Menghitung jarak antara dua titik koordinat menggunakan rumus Haversine
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Jari-jari bumi dalam satuan meter
  const radLat1 = lat1 * Math.PI / 180;
  const radLat2 = lat2 * Math.PI / 180;
  const deltaLat = (lat2 - lat1) * Math.PI / 180;
  const deltaLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(radLat1) * Math.cos(radLat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
            
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/**
 * Mengubah objek Date menjadi format string ISO lokal YYYY-MM-DD
 */
function getLocalYYYYMMDD(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Menyesuaikan format teks jam agar kompatibel dengan tag input type="time"
 */
function formatTimeForInput(timeStr) {
  if (!timeStr || timeStr === '-') return '';
  return timeStr.replace(/\./g, ':').slice(0, 5);
}