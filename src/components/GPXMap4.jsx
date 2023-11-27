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
  const mapContainerRef = useRef(null);
  const drawRef = useRef(null);
  const chartRef = useRef(null);
  const chartRef1 = useRef(null);
  const markerRef = useRef(null);
  const chartInstance = useRef(null);

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
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [tooltip, setTooltip] = useState({
	opacity: 0,
	top: 0,
	left: 0,
	date: '',
	value: '',
  }) //


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
        const xmlDoc = parser.parseFromString(gpxData, 'text/xml');
        const geojson = toGeoJSON.gpx(xmlDoc);

        const newElevations = Array.from(xmlDoc.getElementsByTagName('ele')).map((ele) => parseFloat(ele.textContent));
        // setElevations(newElevations);
        const newDistance = calculateDistance1(geojson.features[0].geometry.coordinates);
        const totalDistances = newDistance[newDistance.length - 1]
        setTotalDistance(totalDistances);
        setDistance(newDistance);

        // ---
        const coordinates1 = geojson.features[0].geometry.coordinates;
        const initialPosition = coordinates1[coordinates1.length - 1];

        // ---

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
            // center: [-74.5, 40],
            center:[centerLongitude, centerLatitude],
            zoom: 12,
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

        const updateChartAndMarker = (clickedIndex) => {
          const newData = coordinates1.slice(0, clickedIndex + 1);
          // chartRef.current.data.datasets[0].data = newData.map((coord, index) => ({ x: index, y: coord[2] }));
          //console.log("newData 1", chartRef.current.data.datasets[0].data = newData.map((coord, index) => ({ x: index, y: coord[2] })))
          chartRef.current.update();

          // Use setLngLat with an array of coordinates
          markerRef.current.setLngLat(coordinates1[clickedIndex]);
        };

        // Handle chart click to update marker and chart
        // chartRef.current.canvas.addEventListener('mouseover', (event) => {
        //   console.log('Chart clicked!', event);
        //   const activePoints = chartRef.current.getElementsAtEventForMode(event, "nearest", {
        //     intersect: true
        // });
        // //const activePoints = chartRef.current.getSegmentsAtEvent(event)
        // console.log("activePoints", activePoints)
        //   if (activePoints.length > 0) {
        //     const clickedIndex = activePoints[0].index;
        //     console.log("clickedIndex", clickedIndex)
        //     updateChartAndMarker(clickedIndex);
        //   }
        // });

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
      // Clean up resources when component unmounts

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

	const CustomTooltip = ({ data }) => {
		const { label, datasets } = data;
		const tooltipContent = `
		  <div style={{ padding: 10, border: '1px solid #ccc', borderRadius: 4 }}>
			<div style={{ fontWeight: 'bold' }}>${label}</div>
			<ul>
			  ${datasets.map((dataset) => {
				const { label: datasetLabel, dataPoint } = dataset;
				return (
				  <li key={datasetLabel}>
					<span style={{ color: dataset.borderColor }}>{datasetLabel}:</span>
					{dataPoint}
				  </li>
				);
			  })}
			</ul>
		  </div>
		`;
	  
		return tooltipContent;
	  };

  const createElevationChart = async (distances, elevations, totalDistances, coordinates1, initialPosition) => {

    //markerRef.current = new mapboxgl.Marker().setLngLat(initialPosition).addTo(map);

    const labelsDistances = [];
    distances.map((_, index) => {
      labelsDistances.push(`${(index * totalDistances / distances.length).toFixed(2)} km`)
    })

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new Chart.js line chart
    const ctx = document.getElementById('elevationChart');

    if (ctx && distances.length > 0) {
		const getOrCreateTooltip = (chart) => {
			console.log("CHART", chart)
			
			// let tooltipEl = chart.canvas.parentNode.querySelector('div');
		  
			// if (!tooltipEl) {
			//   tooltipEl = document.createElement('div');
			//   tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
			//   tooltipEl.style.borderRadius = '3px';
			//   tooltipEl.style.color = 'white';
			//   tooltipEl.style.opacity = 1;
			//   tooltipEl.style.pointerEvents = 'none';
			//   tooltipEl.style.position = 'absolute';
			//   tooltipEl.style.transform = 'translate(-50%, 0)';
			//   tooltipEl.style.transition = 'all .1s ease';
		  
			//   const table = document.createElement('table');
			//   table.style.margin = '0px';
		  
			//   tooltipEl.appendChild(table);
			//   chart.canvas.parentNode.appendChild(tooltipEl);
			// }
			
			// return tooltipEl;
		  };

		const externalTooltipHandler = (context) => {
			console.log("CONTEXT", context)
			const {chart, tooltip} = context;
			let tooltipEl = document.getElementById('chartjs-tooltip');
			if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.id = 'chartjs-tooltip';
				tooltipEl.innerHTML = "<table></table>"
				document.body.appendChild(tooltipEl);
			}
			// Hide if no tooltip
			if (tooltip.opacity === 0) {
				tooltipEl.style.opacity = 0;
				return;
			}
			// Set caret Position
			tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				tooltipEl.classList.add(tooltip.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}
			function getBody(bodyItem) {
				return bodyItem.lines;
			}
			// Set Text
			if (tooltip.body) {
				var titleLines = tooltip.title || [];
				var bodyLines = tooltip.body.map(getBody);
				//PUT CUSTOM HTML TOOLTIP CONTENT HERE (innerHTML)
				var innerHtml = '<thead>';
				titleLines.forEach(function(title) {
					innerHtml += '<tr><th>' + title + '</th></tr>';
				});
				innerHtml += '</thead><tbody>';
				bodyLines.forEach(function(body, i) {
					var colors = tooltip.labelColors[i];
					var style = 'background:' + colors.backgroundColor;
					style += '; border-color:' + colors.borderColor;
					style += '; border-width: 2px'; 
					var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
					innerHtml += '<tr><td>' + span + body + '</td></tr>';
				});
				innerHtml += '</tbody>';
				var tableRoot = tooltipEl.querySelector('table');
				tableRoot.innerHTML = innerHtml;
			}
			var position = chart.canvas.getBoundingClientRect();
			// Display, position, and set styles for font
			tooltipEl.style.opacity = 1;
			tooltipEl.style.left = position.left + tooltip.caretX + 'px';
			tooltipEl.style.top = position.top + tooltip.caretY + 'px';
			tooltipEl.style.fontFamily = tooltip._fontFamily;
			tooltipEl.style.fontSize = tooltip.fontSize;
			tooltipEl.style.fontStyle = tooltip._fontStyle;
			tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';


			// Tooltip Element
			// const {chart, tooltip} = context;
			// const tooltipEl = getOrCreateTooltip(chart);

			// console.log("tooltipEl", tooltipEl)
		  
			// // Hide if no tooltip
			// if (tooltip.opacity === 0) {
			//   tooltipEl.style.opacity = 0;
			//   return;
			// }
		  
			// // Set Text
			// if (tooltip.body) {
			//   const titleLines = tooltip.title || [];
			//   const bodyLines = tooltip.body.map(b => b.lines);
		  
			//   const tableHead = document.createElement('thead');
		  
			//   titleLines.forEach(title => {
			// 	const tr = document.createElement('tr');
			// 	tr.style.borderWidth = 0;
		  
			// 	const th = document.createElement('th');
			// 	th.style.borderWidth = 0;
			// 	const text = document.createTextNode(title);
		  
			// 	th.appendChild(text);
			// 	tr.appendChild(th);
			// 	tableHead.appendChild(tr);
			//   });
		  
			//   const tableBody = document.createElement('tbody');
			//   bodyLines.forEach((body, i) => {
			// 	const colors = tooltip.labelColors[i];
		  
			// 	const span = document.createElement('span');
			// 	span.style.background = colors.backgroundColor;
			// 	span.style.borderColor = colors.borderColor;
			// 	span.style.borderWidth = '2px';
			// 	span.style.marginRight = '10px';
			// 	span.style.height = '10px';
			// 	span.style.width = '10px';
			// 	span.style.display = 'inline-block';
		  
			// 	const tr = document.createElement('tr');
			// 	tr.style.backgroundColor = 'inherit';
			// 	tr.style.borderWidth = 0;
		  
			// 	const td = document.createElement('td');
			// 	td.style.borderWidth = 0;
		  
			// 	const text = document.createTextNode(body);
		  
			// 	td.appendChild(span);
			// 	td.appendChild(text);
			// 	tr.appendChild(td);
			// 	tableBody.appendChild(tr);
			//   });
		  
			//   const tableRoot = tooltipEl.querySelector('table');
			//   console.log("TABLEROOT", tableRoot)
		  
			//   // Remove old children
			//   while (tableRoot.firstChild) {
			// 	tableRoot.firstChild.remove();
			//   }
		  
			//   // Add new children
			//   tableRoot.appendChild(tableHead);
			//   tableRoot.appendChild(tableBody);
			// }
		  
			// const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
		  
			// // Display, position, and set styles for font
			// tooltipEl.style.opacity = 1;
			// tooltipEl.style.left = positionX + tooltip.caretX + 'px';
			// tooltipEl.style.top = positionY + tooltip.caretY + 'px';
			// tooltipEl.style.font = tooltip.options.bodyFont.string;
			// tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
		};

		const customTooltip = (context) => {
			console.log("CONTEXT 11", context)
			const { chart, tooltip } = context;
			const { ctx, canvas } = chart;
		
			// Custom tooltip logic
			// You can customize the content and appearance here
			const { body, opacity } = tooltip;
			if (opacity === 0) {
			  return;
			}
		
			// Position of the tooltip
			const position = chart.canvas.getBoundingClientRect();
		
			// Draw a white background for the tooltip
			ctx.fillStyle = 'white';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.fillRect(position.left + tooltip.caretX - 50, position.top + tooltip.caretY - 40, 100, 30);
			ctx.strokeRect(position.left + tooltip.caretX - 50, position.top + tooltip.caretY - 40, 100, 30);
		
			// Draw text
			ctx.fillStyle = 'black';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = '12px Arial';
			body.forEach((line, index) => {
			  ctx.fillText(line.lines, position.left + tooltip.caretX, position.top + tooltip.caretY - 15 + index * 12);
			});
		};

		chartRef.current = new Chart(ctx, {
			type: 'line',
			data: {
			labels: labelsDistances,
			datasets: [
				{
				label: 'Distance Traveled (km)',
				data: elevations,
				fill: false,
				borderColor: 'rgba(75,192,192,1)',
				pointRadius: 0,
				tension: 0.4,
				},
			],
			},
			options: {
				tooltips: {
					enabled: true,
					custom: CustomTooltip,
				  },
				interaction: {
					mode: 'index',
					intersect: false,
				},				
				onHover: (event, activeEls, chart) => {
					const activePoints = chartRef.current.getElementsAtEventForMode(event, "nearest", {
						intersect: false
					});

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
						enabled: false,
						// position: 'nearest',
						custom: CustomTooltip,
						// external: customTooltip

					},
				},
				maintainAspectRatio: false,
				responsive: false,
				scales: {
					x: {
						grid: {
							display: false
						},
						type: 'category',
						labels: labelsDistances
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
						bottom: -10,
						left: 20
					}
				}
			},
			plugins:[
				{
					id: 'corsair',
					afterInit: (chart) => {
						chart.corsair = {
							x: 0,
							y: 0
						}
					},
					afterEvent: (chart, evt) => {
						const {
							chartArea: {
								top,
								bottom,
								left,
								right
							}
						} = chart;
						const {
							event: {
								x,
								y
							}
						} = evt;
						if (x < left || x > right || y < top || y > bottom) {
							chart.corsair = {
								x,
								draw: false
							}
							chart.draw();
							return;
						}

						chart.corsair = {
							x,
							draw: true
						}

					  	chart.draw();
					},
					afterDatasetsDraw: (chart, _, opts) => {
					  	const {
							ctx,
							tooltip,
							chartArea: {
								top,
								bottom,
								left,
								right
							}
					  	} = chart;
						const {
							x,
							y,
							draw
						} = chart.corsair;

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
      const newData = coordinates1.slice(0, clickedIndex + 1);
      // chartRef.current.data.datasets[0].data = newData.map((coord, index) => ({ x: index, y: coord[2] }));
      //console.log("newData 1", chartRef.current.data.datasets[0].data = newData.map((coord, index) => ({ x: index, y: coord[2] })))
      chartRef.current.update();

      // Use setLngLat with an array of coordinates
      markerRef.current.setLngLat(coordinates1[clickedIndex]);
    };


  };

  return (
    <div>
        <div ref={mapContainer} style={{ height: '400px' }} />
        <h3>Total Distance (km): {totalDistance.toFixed(2)}</h3>
		{/* <div className='tooltip'  style={{ top: tooltip.top, left: tooltip.left, opacity: tooltip.opacity }}>
			// your tooltip jsx here, in ex.
			<p>{ tooltip.date } </p>
			<p>{ tooltip.value} </p>
		</div> */}
        <canvas id="elevationChart" width="800" height="400"></canvas>
        {/* <canvas ref={chartRef} width="400" height="400" /> */}
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
