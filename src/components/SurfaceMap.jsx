import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import toGeoJSON from 'togeojson';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
//import './App.css';
import SurfaceChart from './SurfaceChart';

const CenterMap = ({ center }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

function SurfaceMap() {
  const [gpxData, setGpxData] = useState(null);
  const [surfaceData, setSurfaceData] = useState([]);
  const [center, setCenter] = useState([51.505, -0.09]); // Default center
  const [markerPosition, setMarkerPosition] = useState(null); 
  const mapboxToken = 'pk.eyJ1IjoibWFhYWlrIiwiYSI6ImNsb3B3bTg2MjBkY2gyd2xhcGxtYXV3c2MifQ.xxfpJgtxgEYYjbXG74mdsw';

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Actualiza la posición del marcador si hay datos de superficie disponibles
//       if (surfaceData.length > 0) {
//         const currentTime = new Date().getTime() / 1000; // Obtiene el tiempo actual en segundos
//         const segmentIndex = Math.floor(currentTime) % surfaceData.length; // Calcula el índice del segmento actual
//         const segment = surfaceData[segmentIndex];
//         const coordinateIndex = Math.floor((currentTime % 1) * (segment.coordinates.length - 1)); // Calcula el índice de la coordenada actual dentro del segmento
//         const coordinate = segment.coordinates[coordinateIndex];
//         setMarkerPosition({ lat: coordinate[1], lng: coordinate[0] }); // Actualiza la posición del marcador
//       }
//     }, 1000); // Actualiza la posición del marcador cada segundo
  
//     return () => clearInterval(interval); // Limpia el intervalo cuando se desmonta el componente
//   }, [surfaceData]);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(e.target.result, 'application/xml');
        const geojson = toGeoJSON.gpx(xml);
        console.log('GPX Data:', geojson); // Log GPX data
        setGpxData(geojson);
        const surfaces = await fetchSurfaceData(geojson.features);
        setSurfaceData(surfaces);
        const routeCenter = calculateRouteCenter(geojson.features);
        setCenter(routeCenter);
      };
      reader.readAsText(file);
    }
  };

  const fetchSurfaceData = async (features) => {
    const surfaces = [];

    for (const feature of features) {
      const coordinates = feature.geometry.coordinates;

      // Solo consulta la primera coordenada de cada segmento para reducir el número de consultas
      const surface = await fetchSurfaceTypeFromOSM(coordinates[0]);
      console.log('Surface for feature:', surface); // Log each surface type

      surfaces.push({
        coordinates,
        surface,
      });
    }

    return surfaces;
  };

  const fetchSurfaceTypeFromOSM = async (coordinates) => {
    try {
      const [lon, lat] = coordinates;
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new Error('Invalid coordinates');
      }

      const query = `[out:json];
        way(around:50,${lat},${lon})[surface];
        out body;
        >;
        out skel qt;`;

      const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = response.data;
      if (data.elements && data.elements.length > 0) {
        console.log('OSM Data:', data.elements); // Log OSM data for debugging
        const surfaces = data.elements
          .map(element => element.tags?.surface)
          .filter(surface => surface !== undefined);
        return surfaces.length > 0 ? surfaces : ['Desconocido'];
      } else {
        console.log('No surface data found for coordinates:', coordinates);
        return ['Desconocido'];
      }
    } catch (error) {
      console.error('Error fetching surface type from OSM:', error);
      return ['Desconocido'];
    }
  };

  const calculateRouteCenter = (features) => {
    let totalLat = 0;
    let totalLon = 0;
    let count = 0;

    features.forEach(feature => {
      feature.geometry.coordinates.forEach(coord => {
        totalLat += coord[1];
        totalLon += coord[0];
        count++;
      });
    });

    return [totalLat / count, totalLon / count];
  };

  const generateChartData = () => {
    if (!gpxData || !surfaceData.length) return [];

    let distance = 0;
    const chartData = [];
    surfaceData.forEach((segment) => {
      segment.coordinates.forEach((coord, i) => {
        if (i > 0) {
          distance += calculateDistance(segment.coordinates[i - 1], coord);
        }
        const elevation = coord[2] || 0;
        chartData.push({
          distance: distance.toFixed(2),
          elevation: elevation,
          surface: segment.surface.join(', '), // Join multiple surfaces
        });
      });
    });

    console.log('Chart Data:', chartData); // Log the generated chart data
    return chartData;
  };

  const calculateDistance = (coord1, coord2) => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      0.5 - Math.cos(dLat) / 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * (Math.PI / 180))) *
        (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  };

  return (
    <div className="App">
      <h1>GPX Surface Viewer</h1>
      <input type="file" accept=".gpx" onChange={handleFileUpload} />
      {gpxData && (
        <div>
          <MapContainer center={center} zoom={13} style={{ height: '40vh', width: '100%' }}>
            <TileLayer
              url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`}
              attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              id="mapbox/streets-v11"
              tileSize={512}
              zoomOffset={-1}
            />
            {surfaceData.map((segment, index) => {
              console.log(`Rendering segment ${index} with surfaces: ${segment.surface}`); // Log surfaces for each segment
              return (
                <Polyline
                  key={index}
                  positions={segment.coordinates.map(coord => [coord[1], coord[0]])}
                  color={
                    segment.surface.includes('paved')
                      ? 'black'
                      : segment.surface.includes('dirt')
                      ? 'brown'
                      : segment.surface.includes('gravel')
                      ? 'gray'
                      : 'green'
                  }
                />
              );
            })}
            {markerPosition && ( // Render the marker only if markerPosition is available
                <Marker position={markerPosition}>
                    <Popup>
                        Posición del marcador: <br /> Latitud: {markerPosition.lat}, Longitud: {markerPosition.lng}
                    </Popup>
                </Marker>
            )}
            <CenterMap center={center} />
          </MapContainer>
          <SurfaceChart data={generateChartData()} />
        </div>
      )}
    </div>
  );
}

export default SurfaceMap;





// import React, { useState } from 'react';
// import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
// import toGeoJSON from 'togeojson';
// import 'leaflet/dist/leaflet.css';
// //import './App.css';
// import SurfaceChart from './SurfaceChart';

// const CenterMap = ({ center }) => {
//   const map = useMap();
//   map.setView(center, 13);
//   return null;
// };

// function SurfaceMap() {
//   const [gpxData, setGpxData] = useState(null);
//   const [surfaceData, setSurfaceData] = useState([]);
//   const [center, setCenter] = useState([51.505, -0.09]); // Default center

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const parser = new DOMParser();
//         const xml = parser.parseFromString(e.target.result, 'application/xml');
//         const geojson = toGeoJSON.gpx(xml);
//         console.log('GPX Data:', geojson); // Log GPX data
//         setGpxData(geojson);
//         const surfaces = await fetchSurfaceData(geojson.features);
//         setSurfaceData(surfaces);
//         const routeCenter = calculateRouteCenter(geojson.features);
//         setCenter(routeCenter);
//       };
//       reader.readAsText(file);
//     }
//   };

//   const fetchSurfaceData = async (features) => {
//     const surfaces = [];
//     for (const feature of features) {
//       const coordinates = feature.geometry.coordinates;
//       const surface = await fetchSurfaceTypeFromAPI(coordinates);
//       console.log('Surface for feature:', surface); // Log each surface type
//       surfaces.push({
//         coordinates,
//         surface,
//       });
//     }
//     return surfaces;
//   };

//   const fetchSurfaceTypeFromAPI = async (coordinates) => {
//     // Utilizar la API de OpenStreetMap para obtener información de terreno
//     // Aquí se podría hacer una solicitud HTTP a un servicio que proporciona datos de superficie
//     // Esta es solo una simulación y no refleja una implementación real
//     try {
//       const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates[1]}&lon=${coordinates[0]}&format=json`);
//       const data = await response.json();
//       return data?.address?.surface || 'Desconocido';
//     } catch (error) {
//       console.error('Error fetching surface type:', error);
//       return 'Desconocido';
//     }
//   };

//   const calculateRouteCenter = (features) => {
//     let totalLat = 0;
//     let totalLon = 0;
//     let count = 0;

//     features.forEach(feature => {
//       feature.geometry.coordinates.forEach(coord => {
//         totalLat += coord[1];
//         totalLon += coord[0];
//         count++;
//       });
//     });

//     return [totalLat / count, totalLon / count];
//   };

//   const generateChartData = () => {
//     if (!gpxData || !surfaceData.length) return [];

//     let distance = 0;
//     const chartData = [];
//     surfaceData.forEach((segment, index) => {
//       segment.coordinates.forEach((coord, i) => {
//         if (i > 0) {
//           distance += calculateDistance(segment.coordinates[i - 1], coord);
//         }
//         const elevation = coord[2] || 0;
//         chartData.push({
//           distance: distance.toFixed(2),
//           elevation: elevation,
//           surface: segment.surface,
//         });
//       });
//     });

//     console.log('Chart Data:', chartData); // Log the generated chart data
//     return chartData;
//   };

//   const calculateDistance = (coord1, coord2) => {
//     const [lon1, lat1] = coord1;
//     const [lon2, lat2] = coord2;
//     const R = 6371;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       0.5 - Math.cos(dLat) / 2 +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         (1 - Math.cos(dLon)) / 2;
//     return R * 2 * Math.asin(Math.sqrt(a));
//   };

//   return (
//     <div className="App">
//       <h1>GPX Surface Viewer</h1>
//       <input type="file" accept=".gpx" onChange={handleFileUpload} />
//       {gpxData && (
//         <div>
//           <MapContainer center={center} zoom={13} style={{ height: '40vh', width: '100%' }}>
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
//             {surfaceData.map((segment, index) => {
//               console.log(`Rendering segment ${index} with surface: ${segment.surface}`); // Log surface for each segment
//               return (
//                 <Polyline
//                   key={index}
//                   positions={segment.coordinates.map(coord => [coord[1], coord[0]])}
//                   color={
//                     segment.surface === 'water'
//                       ? 'blue'
//                       : segment.surface === 'grass'
//                       ? 'green'
//                       : 'gray'
//                   }
//                 />
//               );
//             })}
//             <CenterMap center={center} />
//           </MapContainer>
//           <SurfaceChart data={generateChartData()} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default SurfaceMap;
