import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import Chart from 'chart.js/auto';
import toGeoJSON from 'togeojson';
import ReactMapGL, { Source, Layer } from 'react-map-gl';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

mapboxgl.accessToken = process.env.REACT_APP_TOKEN;

const GPXMap4 = () => {
  const mapContainer = useRef(null);
  const mapContainerRef = useRef(null);
  const drawRef = useRef(null);
  const chartRef = useRef(null);

  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -74.5,
    zoom: 9,
    width: '100%',
    height: '100%',
  });

  const [ map, setMap ] = useState(null);

  const [geojsonData, setGeojsonData] = useState(null);
  const [gpxData, setGpxData] = useState(null);

  const [markers, setMarkers] = useState([]);
  const [elevationData, setElevationData] = useState(null);
  const [distance, setDistance] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);

  const updateElevationProfile = async (map, geojsonData) => {
    // const features = drawRef.current.getAll();
  
    // if (features.features.length === 0) {
    //   return;
    // }
  
    // const line = turf.lineString(features.features[0].geometry.coordinates);
    // const coordinates = [];
  
    // turf.coordEach(line, (coord) => {
    //   coordinates.push(coord);
    // });

    // const lineDistance = turf.length(line, { units: 'kilometers' });
    // const interval = lineDistance / coordinates.length;

    // const line = turf.lineString(features.features[0].geometry.coordinates);
    // const coordinates = [];
    // const lineDistance = turf.length(line, { units: 'kilometers' });
    // const interval = lineDistance / features.features[0].geometry.coordinates.length;

    // features.features[0].geometry.coordinates.forEach((coord, index) => {
    //     const distanceAlongLine = index * interval;
    //     coordinates.push({ lon: coord[0], lat: coord[1], distanceAlongLine, elevation: null  });
    // });
  
    // await Promise.all(
    //     coordinates.map(async (coord) => {
    //       const url = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${coord.lon},${coord.lat}.json?layers=contour&access_token=${mapboxgl.accessToken}`;
    
    //       try {
    //         const response = await fetch(url);
    //         const data = await response.json();
    
    //         if (data.features.length > 0) {
    //           const elevation = data.features[0].properties.ele;
    //           coord.elevation = elevation;
    //         } else {
    //           console.error('No se pudo obtener la elevación para la coordenada:', coord);
    //         }
    //       } catch (error) {
    //         console.error('Error al obtener la elevación:', error);
    //       }
    //     })
    //   );
    
    //   // Now you have the elevation profile data with distance along the line and elevation,
    //   // and you can use Chart.js to create a chart
    //   await createElevationChart(coordinates);
    console.log("geojsonData-------llll", geojsonData)
    debugger;
    
    const chunks = turf.lineChunk(geojsonData, 1).features;

    console.log("geojsonData-------llll", chunks)
 
    // get the elevation for the leading coordinate of each segment
    const elevations = [
        ...chunks.map((feature) => {
            return map.queryTerrainElevation(
                feature.geometry.coordinates[0]
            );
        }),
        // do not forget the last coordinate
        map.queryTerrainElevation(
            chunks[chunks.length - 1].geometry.coordinates[1]
        )
    ];
    console.log("elevations----", elevations)
    // add dummy labels
    // await createElevationChart(elevations);
    // myLineChart.data.labels = elevations.map(() => '');
    // myLineChart.data.datasets[0] = {
    //     data: elevations,
    //     fill: false,
    //     tension: 0.4
    // };
    // myLineChart.update();
  };

  const handleMapLoad = (map, geojsonData) => {
    console.log("MAP", map)
    // const map = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: 'mapbox://styles/maaaik/clojd84jt004a01qn4cpuhklc',
    //   center: [-74.5, 40],
    //   zoom: 9,
    // });

    map.on('style.load', () => {
        // add source and layer for rendering the line
        map.addSource('line-data', {
            type: 'geojson',
            data: geojsonData
        });
         
        map.addLayer({
            id: 'line-line-data',
            type: 'line',
            source: 'line-data',
            paint: {
                'line-width': 4,
                'line-color': '#37a2eb'
            }
        });
         
        // add the digital elevation model tiles
        map.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 20
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1 });
         
        // add draggable markers
        const marker0 = new mapboxgl.Marker({
            draggable: false,
            color: '#83f7a0'
        })
        .setLngLat(geojsonData.geometry.coordinates[0])
        .addTo(map);
        //FInal
        const marker1 = new mapboxgl.Marker({
            draggable: false,
            color: '#ed6461'
        })
        .setLngLat(geojsonData.geometry.coordinates[1])
        .addTo(map);
         
        // as the user drags a marker, update the data for the line and re-render it with setData()
        const updateLineData = (e, position) => {
            const { lng, lat } = e.target.getLngLat();
            geojsonData.geometry.coordinates[position] = [lng, lat];
            map.getSource('line-data').setData(geojsonData);
        };
         
        marker0.on('drag', (e) => {
            updateLineData(e, 0);
        });
        marker0.on('dragend', updateElevationProfile);
         
        marker1.on('drag', (e) => {
            updateLineData(e, 1);
        });

        marker1.on('dragend', updateElevationProfile);

        updateElevationProfile(map, geojsonData);
    });

    console.log("geojsonData", geojsonData)

    // if(map != undefined){
    //     map.addSource('route', {
    //         type: 'geojson',
    //         data: geojsonData,
    //         generateId: true,
    //       });
      
    //       map.addLayer({
    //         id: 'route',
    //         type: 'line',
    //         source: 'route',
    //         paint: {
    //           'line-color': '#FF0000',
    //           'line-width': 3,
    //         },
    //       });
    // }
  };
  

  useEffect(() => {

    // var gpxUrl = 'data/Las_Palmas_Run.gpx';
    // const map = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: 'mapbox://styles/maaaik/clojd84jt004a01qn4cpuhklc',
    //   center: [-74.5, 40],
    //   zoom: 9,
    // });


    //DRAW
    // const draw = new MapboxDraw({
    //   displayControlsDefault: false,
    //   controls: {
    //     line_string: true,
    //     trash: true,
    //   },
    // });

    // map.addControl(draw);

    // const handleDrawCreate = () => {
    //   updateElevationProfile();
    // };

    // map.on('draw.create', handleDrawCreate);

    // drawRef.current = draw;
    //DRAW



    // return () => {
    //     map.off('draw.create', handleDrawCreate);
    // };
  }, []);

  useEffect(() => {
    fetch('data/Las_Palmas_Run.gpx')
      .then((response) => response.text())
      .then((gpxData) => {

        // const geojson = toGeoJSON.gpx(new DOMParser().parseFromString(gpxData, 'text/xml'));
        const parser = new DOMParser();
        console.log("RESPONSE", parser)
        const xmlDoc = parser.parseFromString(gpxData, 'text/xml');
        console.log("COORDS 2", xmlDoc);
        const geojson = toGeoJSON.gpx(xmlDoc);
        console.log("geojson", geojson);

        const newElevations = Array.from(xmlDoc.getElementsByTagName('ele')).map((ele) => parseFloat(ele.textContent));
        console.log("newElevations", newElevations);
        // setElevations(newElevations);
        const newDistance = calculateDistance1(geojson.features[0].geometry.coordinates);
        console.log("newDistance", newDistance);
        console.log("Total Distance", newDistance[newDistance.length - 1]);
        const totalDistances = newDistance[newDistance.length - 1]
        setTotalDistance(totalDistances); 
        setDistance(newDistance);
        
        createElevationChart(newDistance, newElevations, totalDistances);

        const coordinates = Array.from(xmlDoc.querySelectorAll('trkpt')).map((point) => ({
            latitude: parseFloat(point.getAttribute('lat')),
            longitude: parseFloat(point.getAttribute('lon')),
        }));
        console.log("COORDS 3", coordinates);
        console.log("COORDS 4", viewport);
        setGeojsonData(xmlDoc);

        const centerLatitude = coordinates.reduce((sum, point) => sum + point.latitude, 0) / coordinates.length;
        const centerLongitude = coordinates.reduce((sum, point) => sum + point.longitude, 0) / coordinates.length;


        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/maaaik/clojd84jt004a01qn4cpuhklc',
            // center: [-74.5, 40],
            center:[centerLongitude, centerLatitude],
            zoom: 12,
        });
        

        const geojsonData = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: coordinates.map((point) => [point.longitude, point.latitude]),
            },
        };

        handleMapLoad(map, geojsonData);

        console.log("geojsonData", geojsonData)

        setGpxData(geojsonData);

        console.log("COORDS 5", mapContainer);

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

        //updateElevationProfile()

        setViewport((prevViewport) => ({
            ...prevViewport,
            latitude: centerLatitude,
            longitude: centerLongitude,
        }));

      })
      .catch((error) => console.error('Error fetching GPX data:', error));

    //   return () => map.remove();
}, []);

  const calculateDistance1 = (coordinates) => {
    let totalDistance = 0;
    const distances = [0]; // Start with 0 distance at the beginning

    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lon1, lat1] = coordinates[i];
      const [lon2, lat2] = coordinates[i + 1];

      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const radius = 6371; // Earth's radius in kilometers

      totalDistance += radius * c;
      distances.push(totalDistance);
    }

    return distances;
  };

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

  const createElevationChart = async (distances, elevations, totalDistances) => {
    
    console.log("DATA", [distances, elevations, totalDistances])
    const labelsDistances = [];
    distances.map((_, index) => {
      labelsDistances.push(`${(index * totalDistances / distances.length).toFixed(2)} km`)      
    })
    console.log("------ DISTANFES", labelsDistances)
    // data.map(point => {
    //     console.log("POINT", point)
    // })
    // const ctx = document.getElementById('elevationChart').getContext('2d');
    // return new Chart(ctx, {
    //   type: 'line',
    //   data: {
    //     // labels: data.map(point => `${point.lon.toFixed(2)}, ${point.lat.toFixed(2)}`),
    //     // labels: data.map(point => `${point.distanceAlongLine.toFixed(2)} km`),
    //     labels: distances,
    //     datasets: [
    //       {
    //         label: 'Elevation Profile',
    //         // data: data.map(point => point.elevation),
    //         data: elevations,
    //         borderColor: 'rgba(75, 192, 192, 1)',
    //         borderWidth: 2,
    //         fill: false,
    //         tension: 0.2,
    //         pointBackgroundColor: 'rgb(0, 0, 0, 0)',
    //         pointBorderWidth: 0,
    //         backgroundColor: 'rgb(0, 0, 0)'
    //       },
    //     ],
    //   },
    //   options: {
    //     scales: {
    //         y: {
    //           beginAtZero: true,
    //         },
    //         x: {
    //           title: {
    //             display: true,
    //             text: 'Distance (km)',
    //           },
    //         },
    //     },
    //   },
    // });
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new Chart.js line chart
    const ctx = document.getElementById('elevationChart');

    if (ctx && distances.length > 0) {
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          // labels: labelsDistances,
          labels: labelsDistances,
          datasets: [
            {
              label: 'Distance Traveled (km)',
              data: elevations,
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
              pointRadius: 0,
              tension: 0.4
            },
          ],
        },
        options: {
          plugins: {
            // legend: {
            //   display: false
            // },
            title: {
              display: true,
              align: 'start',
              text: 'Elevation (m)'
            }
          },
          maintainAspectRatio: false,
          responsive: false,
          scales: {
            x: {              
              position: 'bottom',
              grid: {
                display: false
              },
              skipNull: true,
            },
            y: {
            min: 0,
              grid: {
                display: true
              }
            }
          },
          elements: {
            point: {
              radius: 0
            }
          },
          layout: {
            padding: {
              top: 6,
              right: 20,
              bottom: -10,
              left: 20
            }
          }
          }
      });
    }
  };

  return (
    <div>
        <div ref={mapContainer} style={{ height: '400px' }} />
        <h3>Total Distance (km): {totalDistance.toFixed(2)}</h3>
        <canvas id="elevationChart" width="800" height="400"></canvas>
        {/* <div ref={mapContainerRef} style={{ width: '100%', height: '400' }}>
         <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={mapboxgl.accessToken}
            onMove={(newViewport) => setViewport(newViewport)}
            onLoad={({ target }) => handleMapLoad(target)}
            ref={(map) => (mapContainerRef.current = map && map.getMap())}
        />
        </div> */}
        {/* <canvas id="elevationChart" width="400" height="200"></canvas> */}
    </div>
  );
};

export default GPXMap4;