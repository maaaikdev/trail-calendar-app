import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import Chart from 'chart.js/auto';
import toGeoJSON from 'togeojson';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import isEqual from 'lodash/isEqual';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

mapboxgl.accessToken = process.env.REACT_APP_TOKEN;

const GPXMap4 = () => {
	const mapContainer = useRef(null);
	const chartRef = useRef(null);
	const markerRef = useRef(null);

	const [viewport, setViewport] = useState({
		latitude: 40,
		longitude: -74.5,
		zoom: 7,
		width: '100%',
		height: '100%',
	});

	const [geojsonData, setGeojsonData] = useState(null);
	const [gpxData, setGpxData] = useState(null);

	const [markers, setMarkers] = useState([]);
	const [distance, setDistance] = useState(0);
	const [totalDistance, setTotalDistance] = useState(0);

  	const updateElevationProfile = async (map, geojsonData) => {

    	const chunks = turf.lineChunk(geojsonData, 1).features;
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
  	};

  	const handleMapLoad = (map, geojsonData) => {

    map.on('style.load', () => {
        // add source and layer for rendering the line

		const currentPitch = map.getPitch();
        //console.log('Inclinación actual del mapa:', currentPitch);


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
  };


  	useEffect(() => {
    	fetch('data/42k_Merrell_Trail_Tour_Antioquia_.gpx')
			.then((response) => response.text())
			.then((gpxData) => {
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(gpxData, 'text/xml');
				const geojson = toGeoJSON.gpx(xmlDoc);

				const newElevations = Array.from(xmlDoc.getElementsByTagName('ele')).map((ele) => parseFloat(ele.textContent));

				//Elevations
				const altitudeChanges = newElevations.map((elevation, index) => {
					if (index === 0) return 0;
					return elevation - newElevations[index - 1];
				});
				 // Calcula la inclinación en grados
				const inclinationDegrees = altitudeChanges.reduce((sum, change) => sum + Math.atan2(change, 1), 0);

				// Convierte la inclinación de radianes a grados
				const inclinationDegreesConverted = inclinationDegrees * (180 / Math.PI);

				console.log('Inclinación del GPX en grados:', inclinationDegreesConverted);
				//Elevations

				const newDistance = calculateDistance1(geojson.features[0].geometry.coordinates);
				const totalDistances = newDistance[newDistance.length - 1]
				setTotalDistance(totalDistances);
				setDistance(newDistance);

				const coordinates1 = geojson.features[0].geometry.coordinates;
				const initialPosition = coordinates1[coordinates1.length - 1];

				createElevationChart(newDistance, newElevations, totalDistances, coordinates1, initialPosition);

				const coordinates = Array.from(xmlDoc.querySelectorAll('trkpt')).map((point) => ({
					latitude: parseFloat(point.getAttribute('lat')),
					longitude: parseFloat(point.getAttribute('lon')),
				}));
				setGeojsonData(xmlDoc);

				const centerLatitude = coordinates.reduce((sum, point) => sum + point.latitude, 0) / coordinates.length;
				const centerLongitude = coordinates.reduce((sum, point) => sum + point.longitude, 0) / coordinates.length;


				const map = new mapboxgl.Map({
					container: mapContainer.current,
					style: 'mapbox://styles/maaaik/clojd84jt004a01qn4cpuhklc',
					center:[centerLongitude, centerLatitude],
					zoom: 11,
				});

				markerRef.current = new mapboxgl.Marker().setLngLat(initialPosition).addTo(map);

				const geojsonData = {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: coordinates.map((point) => [point.longitude, point.latitude]),
					},
				};

				handleMapLoad(map, geojsonData);

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

  	const createElevationChart = async (distances, elevations, totalDistances, coordinates1, initialPosition) => {
    	const labelsDistances = [];
		distances.map((_, index) => {
			labelsDistances.push(`${(index * totalDistances / distances.length).toFixed(0)}`)
		})
		const uniqueDistancesArray = [...labelsDistances];
		console.log("labelsDistances", uniqueDistancesArray)
		// const labelsDistances = new Set();

		// distances.map((_, index) => {
		// 	labelsDistances.add(`${(index * totalDistances / distances.length).toFixed(0)} km`);
		// });

		// // Si necesitas convertir el conjunto de nuevo a un array
		// const uniqueDistancesArray = [...labelsDistances];
		// console.log("labelsDistances", uniqueDistancesArray)
		if (chartRef.current) {
			chartRef.current.destroy();
		}
		// Create a new Chart.js line chart
		const ctx = document.getElementById('elevationChart');

		if (ctx && distances.length > 0) {

			chartRef.current = new Chart(ctx, {
				type: 'line',
				data: {
				// labels: uniqueDistancesArray,
				labels: distances.map((_, index) => `${(index * totalDistances / distances.length).toFixed(0)} km`),
				datasets: [
					{
						label: 'Distance Traveled (km)',
						data: elevations,
						fill: true,
						borderColor: 'rgba(132,227,59,1)',
						backgroundColor: 'rgba(101, 125, 82, 1)',
						pointRadius: 0,
						tension: 0.4,
					},
				],
				},
				options: {
					interaction: {
						mode: 'index',
						intersect: false,
					},				
					onHover: (event, activeEls, chart) => {
						console.log("event", event)
						const activePoints = chartRef.current.getElementsAtEventForMode(event, "nearest", {
							intersect: false
						});
						//console.log("activePoints", activePoints)
						if (activePoints.length > 0) {
							const clickedIndex = activePoints[0].index;
							updateChartAndMarker(clickedIndex);
						}
					},
					plugins: {
						title: {
							display: true,
							// align: 'start',
							text: 'Elevation (m)'
						},
						tooltip: {
							displayColors: false,
							backgroundColor: "#fff",
							bodyColor: "#000",
							borderColor: "#000",
							borderWidth: 1,
							padding: 10,
							titleColor: "#000",
							titleFont: "bold",
							titleFontSize: 30,
							yAlign: "bottom",
							borderColor: "#ccc",
							callbacks: {
								title: ctx => {
									if (ctx.length) {
										return "Distancia: " + ctx[0].label;
									}
								},
								label: ctx => {
									// var value = ctx.dataset.data[ctx.dataIndex];
									return "Elevación: " + ctx.formattedValue + " m";
								},
								afterLabel: ctx => {
									console.log("CTX 3", ctx)
									let distance = ctx.label;
									let elevation = ctx.formattedValue;
									let convertDistanceToNumber = parseFloat(distance) * 1000;
									let convertElevationToNumber = parseFloat(elevation.replace(',', ''));

									//Desnivel = Altura final – Altura inicial.

									const anguloRadianes = (350/590).toFixed(4);
									console.log("anguloRadianes-----", anguloRadianes)
									const ang2 = (anguloRadianes*100).toFixed(2)

									console.log("ang2--------", ang2)

									const incline = Math.atan(convertElevationToNumber/convertDistanceToNumber)* (180 / Math.PI).toFixed(2);
									console.log("ang 33 ----", incline.toFixed(2))


									// Convertir a grados
									// var anguloGrados = anguloRadianes * (180 / Math.PI);
									// console.log("anguloGrados", anguloGrados)

									// Porcentaje de la pendiente = (350/590)*100 = 0.5932*100 = 59.32%
									// Grado de la pendiente: Arctan(altura/base) = Tan⁻¹(altura/base)
									// Grado de la pendiente(º) = Arctan(0.5932) = Tan⁻¹ 0.5932 = 30.67º

									// const inclinationPercentage = (convertElevationToNumber/convertDistanceToNumber*100);
									// const pitch = Math.atan(convertElevationToNumber/inclinationPercentage)
									// const pitch1 = Math.atan(pitch)

									console.log("Incline", [convertDistanceToNumber, convertElevationToNumber]); 
									// console.log("inclinationPercentage", inclinationPercentage);
									// console.log("pitch", pitch)
									// console.log("pitch 1", pitch1)
									// // const incline = (convertDistanceToNumber /convertElevationToNumber ) * 100
									// //const incline = (convertElevationToNumber / convertDistanceToNumber * 100) * 100;
									// const incline = Math.atan(convertElevationToNumber / convertDistanceToNumber) * (180 / Math.PI);
									// console.log("TOTAL", incline.toFixed(2))
									// //Pendiente% = (metros ascendidos / metros recorridos) · 100
									// // var hiddenDataset = ctx.chart.config._config.data.datasets[1].data;
									// // var value = hiddenDataset[ctx.dataIndex];

									return "Inclinación: " + " " + ctx.label;
								}
							}
						},
					},
					maintainAspectRatio: false,
					responsive: false,
					scales: {
						x: {
							grid: {
								display: false
							},
							maxRotation: 0,
							// type: 'category',
							// labels: distances.map((_, index) => `${(index * totalDistances / distances.length).toFixed(0)}`),
							labels: distances.map((_, index) => (index * totalDistances / distances.length).toFixed(1) +" km"),
						},
						y: {
							grid: {
								display: true
							},
							border:{
								dash:function(data){
									return data.tick.major ? null : [5, 3]
								}
							},
						}
					},
					elements: {
						point: {
							radius: 0,
						}
					},
					layout: {
						padding: {
							top: 6,
							right: 20,
							bottom: 24,
							left: 20
						}
					}
				},
				plugins:[
					{
						id: 'corsair',
						afterInit: (chart) => {
							chart.corsair = {x: 0, y: 0}
						},
						afterEvent: (chart, evt) => {
							const {
								chartArea: {top, bottom, left, right}
							} = chart;
							const {
								event: {x,y}
							} = evt;
							if (x < left || x > right || y < top || y > bottom) {
								chart.corsair = {x,	draw: false	}
								chart.draw();
								return;
							}

							chart.corsair = {x,draw: true}

							chart.draw();
						},
						afterDatasetsDraw: (chart, _, opts) => {
							const {
								ctx,
								tooltip,
								chartArea: {top, bottom, left, right}
							} = chart;
							const {x, y, draw} = chart.corsair;

							if (!draw) {
								return;
							}

							ctx.lineWidth = opts.width || 0;
							ctx.setLineDash(opts.dash || []);
							ctx.strokeStyle = opts.color || 'black'

							ctx.save();
							ctx.beginPath();
							ctx.moveTo(x, bottom);
							ctx.lineTo(x, top);
							ctx.moveTo(left, y);
							ctx.lineTo(right, y);
							ctx.stroke();
							ctx.restore();
						}
					}
				],
			});


		}

		const updateChartAndMarker = (clickedIndex) => {
			//console.log("clickedIndex", clickedIndex)
			const newData = coordinates1.slice(0, clickedIndex + 1);
			//console.log("clickedIndex 2", clickedIndex)
			chartRef.current.update();
			markerRef.current.setLngLat(coordinates1[clickedIndex]);
		};
  	};

	return (
		<div>
			<div ref={mapContainer} style={{ height: '400px' }} />
			<h3>Total Distance (km): {totalDistance.toFixed(2)}</h3>
			<canvas id="elevationChart" width="800" height="400"></canvas>
		</div>
	);
};

export default GPXMap4;
