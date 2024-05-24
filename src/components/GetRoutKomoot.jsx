import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [routeLayer, setRouteLayer] = useState(null);

  // Función para cargar una ruta GPX en el mapa
  const loadGPX = async (file) => {
    // Código para cargar y parsear el archivo GPX aquí
    // Supongamos que obtienes las coordenadas de la ruta como 'routeCoordinates'
    const routeCoordinates = [
      [51.505, -0.09],
      [51.51, -0.1],
      [51.51, -0.12]
      // Aquí deberías cargar las coordenadas reales de tu archivo GPX
    ];

    // Eliminar la capa de ruta existente si la hay
    if (routeLayer) {
      map.removeLayer(routeLayer);
    }

    // Crear una capa de ruta usando las coordenadas
    const route = L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);
    setRouteLayer(route);

    // Ajustar el mapa para que la ruta sea visible
    map.fitBounds(route.getBounds());
  };

  // Función para inicializar el mapa
  const initMap = () => {
    const mapInstance = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);
    setMap(mapInstance);
  };

  // Cargar la ruta cuando se selecciona un archivo GPX
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      loadGPX(file);
    }
  };

  // Función para obtener la ruta desde la API de Komoot
  const getKomootRoute = async () => {
    try {
      // Hacer una solicitud a la API de Komoot para obtener información sobre la ruta
      // Aquí deberías reemplazar 'API_KEY' con tu clave de API de Komoot y 'ROUTE_ID' con el ID de la ruta que deseas obtener
      const response = await fetch(`https://api.komoot.com/api/v007/tours/ROUTE_ID?key=API_KEY`);
      const data = await response.json();

      // Extraer las coordenadas de la ruta de la respuesta de la API de Komoot
      const routeCoordinates = data.geometry.coordinates.map(coord => [coord[1], coord[0]]);

      // Cargar la ruta en el mapa
      //loadRoute(routeCoordinates);
    } catch (error) {
      console.error('Error fetching Komoot route:', error);
    }
  };

  // Inicializar el mapa cuando el componente se monta
  useEffect(() => {
    initMap();
  }, []);

  return (
    <div>
      <input type="file" accept=".gpx" onChange={handleFileUpload} />
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default MapComponent;
