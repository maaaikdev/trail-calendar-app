import React, { useEffect, useState, useRef } from 'react';
import ReactMapGL, { Source, Layer, Marker } from 'react-map-gl';
// import gpxParse from 'gpx-parse';
// import axios from 'axios';
// import MapboxDraw from '@mapbox/mapbox-gl-draw';
// import * as turf from '@turf/turf';
// import { Chart } from 'chart.js/auto';
// import 'chart.js/auto';
// import mapboxgl from 'mapbox-gl';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

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
    const [elevationData, setElevationData] = useState(null);
    const elevationChartRef = useRef(null);


    useEffect(() => {
        fetchGpxData();
        // if (elevationData) {
        //     // Destroy existing chart if it exists
        //     if (elevationChartRef.current && elevationChartRef.current.chart) {
        //         elevationChartRef.current.chart.destroy();
        //     }
        //     // Create the elevation chart
        //     const ctx = elevationChartRef.current.getContext('2d');
        //     elevationChartRef.current.chart = new Chart(ctx, {
        //         type: 'line',
        //         data: {
        //             labels: elevationData.labels,
        //             datasets: [
        //                 {
        //                     label: 'Elevation Profile',
        //                     data: elevationData.data,
        //                     borderColor: 'blue',
        //                     fill: false,
        //                 },
        //             ],
        //         },
        //         options: {
        //             scales: {
        //                 x: {
        //                     title: {
        //                         display: true,
        //                         text: 'Distance (km)',
        //                     },
        //                 },
        //                 y: {
        //                     title: {
        //                         display: true,
        //                         text: 'Elevation (m)',
        //                     },
        //                 },
        //             },
        //         },
        //     });
        // }
    }, []);

    // useEffect(() => {
    //     fetchElevations();
    // }, []);

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
            // const decodedData = polyline.toGeoJSON(gpxContent);
            

            const parser = new DOMParser();

            const xmlDoc = parser.parseFromString(gpxContent, 'text/xml');
            const coordinates = Array.from(xmlDoc.querySelectorAll('trkpt')).map((point) => ({
                latitude: parseFloat(point.getAttribute('lat')),
                longitude: parseFloat(point.getAttribute('lon')),
            }));

            setElevationData(coordinates)

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

            // console.log("geojsonData", geojsonData)

            setGpxData(geojsonData);

            // Calculate distance between consecutive points and add markers at each kilometer
            const newMarkers = [];
            const newElevationData = {
                labels: [],
                data: [],
            };
            let totalDistance = 0;

            

            for (let i = 1; i < coordinates.length; i++) {
                const distance = calculateDistance(
                coordinates[i - 1].latitude,
                coordinates[i - 1].longitude,
                coordinates[i].latitude,
                coordinates[i].longitude
                );

                totalDistance += distance;

                // // Use Mapbox Elevation API to obtain elevation data
                // const mapboxAccessToken = TOKEN;
                // const url = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${coordinates[i - 1].longitude},${coordinates[i - 1].latitude};${coordinates[i].longitude},${coordinates[i].latitude}.geojson.json?access_token=${mapboxAccessToken}`;

                // const response = await axios.get(url);
                // const elevation = response.data.features[1].properties.ele; // Assuming elevation is stored in the 'ele' property

                // // Add data for elevation chart
                // newElevationData.labels.push(Math.round(totalDistance * 100) / 100); // Round to 2 decimal places
                // newElevationData.data.push(elevation);

                // console.log("newElevationData", [elevation, newElevationData])

                //setElevationData(newElevationData);

                if (totalDistance >= 1) {
                    newMarkers.push({
                        latitude: coordinates[i].latitude,
                        longitude: coordinates[i].longitude,
                        label: `${Math.round(totalDistance)} km`,
                    });

                    totalDistance = 0;
                }
            }
            fetchElevations();
            // setElevationData(newElevationData);

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

    const fetchElevations = async () => {
        console.log("coordinates", elevationData)
        // try {
        //     const batchSize = 5; // Set the number of coordinate pairs in each batch
        //     const batches = [];
        //     console.log("batch 1", elevationData)
        //     for (let i = 0; i < elevationData.length; i += batchSize) {
        //         const batch = elevationData.slice(i, i + batchSize);
        //         batches.push(batch);
        //     }
        //     console.log("batch 1", batches)
        //     const requests = batches.map(async (batch, batchIndex) => {
        //         console.log("batch 2", batch)
        //         const url = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${batch.map(coord => coord.longitude + ',' + coord.latitude).join(';')}/geojson.json?access_token=${TOKEN}`;
    
        //         try {
        //             const response = await axios.get(url);
        //             const elevations = response.data.features.map(feature => feature.properties.ele);
        //             return elevations;
        //         } catch (error) {
        //             console.error(`Error fetching elevations for batch ${batchIndex}:`, error);
        //             return Array(batch.length).fill(null); // Or handle the error as needed
        //         }
        //     });
    
        //     const elevationBatches = await Promise.all(requests);
        //     const elevations = elevationBatches.flat(); // Flatten the array of arrays
    
        //     setElevationData(elevations);
        // } catch (error) {
        //     console.error('Error fetching elevations:', error);
        // }
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
            {/* {gpxData && (
                <canvas ref={elevationChartRef} width="500" height="200" style={{ marginTop: '20px' }} />
            )} */}
        </div>
        
    );
};

export default GPXMap3;
