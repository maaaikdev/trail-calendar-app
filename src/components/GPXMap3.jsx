import React, { useEffect, useState } from 'react';
import ReactMapGL, { Source, Layer, Marker } from 'react-map-gl';
// import gpxParse from 'gpx-parse';
import polyline from '@mapbox/polyline';
// import geolib from 'geolib';

const TOKEN = process.env.REACT_APP_TOKEN;

const GPXMap3 = () => {
    const [viewport, setViewport] = useState({
        width: 800,
        height: 600,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 12,
    });

    const [gpxData, setGpxData] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        fetchGpxData();
    }, []);

    useEffect(() => {
        // Ensure onViewportChange is not triggering unnecessary updates
        const { latitude, longitude, zoom } = viewport;
        setViewport((prevViewport) => {
          if (prevViewport.latitude !== latitude || prevViewport.longitude !== longitude || prevViewport.zoom !== zoom) {
            return { ...prevViewport, latitude, longitude, zoom };
          }
          return prevViewport;
        });
      }, [viewport]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
      };
    
    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const fetchGpxData = async () => {
        try {
            const response = await fetch('data/Las_Palmas_Run.gpx');
            if (!response.ok) {
              throw new Error('Failed to fetch GPX data');
            }
      
            const gpxContent = await response.text();
            const decodedData = polyline.toGeoJSON(gpxContent);

            const parser = new DOMParser();

            const xmlDoc = parser.parseFromString(gpxContent, 'text/xml');

            const coordinates = Array.from(xmlDoc.querySelectorAll('trkpt')).map((point) => ({
                latitude: parseFloat(point.getAttribute('lat')),
                longitude: parseFloat(point.getAttribute('lon')),
            }));            

            const centerLatitude = coordinates.reduce((sum, point) => sum + point.latitude, 0) / coordinates.length;
            const centerLongitude = coordinates.reduce((sum, point) => sum + point.longitude, 0) / coordinates.length;

            // Set the GeoJSON data with LineString feature
            const geojsonData = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates.map((point) => [point.longitude, point.latitude]),
                },
            };

            setGpxData(geojsonData);

            // Calculate distance between consecutive points and add markers at each kilometer
            const newMarkers = [];
            let totalDistance = 0;

            for (let i = 1; i < coordinates.length; i++) {
                const distance = calculateDistance(
                coordinates[i - 1].latitude,
                coordinates[i - 1].longitude,
                coordinates[i].latitude,
                coordinates[i].longitude
                );

                totalDistance += distance;

                if (totalDistance >= 1) {
                newMarkers.push({
                    latitude: coordinates[i].latitude,
                    longitude: coordinates[i].longitude,
                    label: `${Math.round(totalDistance)} km`,
                });

                totalDistance = 0;
                }
            }

            setMarkers(newMarkers);

            setViewport((prevViewport) => ({
                ...prevViewport,
                latitude: centerLatitude,
                longitude: centerLongitude,
            }));
          } catch (error) {
            console.error('Error fetching or decoding GPX data:', error);
          }
    };

    return (
        <div style={{ height: '500px', width: '500px', margin: '20px'}}>
            <ReactMapGL
                {...viewport}
                onMove={(newViewport) => setViewport(newViewport)}
                mapboxAccessToken={TOKEN}
                mapStyle="mapbox://styles/maaaik/clojd84jt004a01qn4cpuhklc"
            >
                {gpxData && (
                    <>
                    <Source 
                        id="gpx-data"
                        type="geojson"
                        data={gpxData}
                      >
                        <Layer
                            id="gpx-track"
                            type="line"
                            paint={{
                                'line-color': 'red',
                                'line-width': 2,
                            }}
                        />
                    </Source>
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            latitude={marker.latitude}
                            longitude={marker.longitude}
                        >
                            <div>{marker.label}</div>
                        </Marker>
                    ))}
                    </>                    
                )}
            </ReactMapGL>
        </div>
        
    );
};

export default GPXMap3;
