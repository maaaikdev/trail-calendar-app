import React, { useState, useEffect } from 'react';
import { Map, Layer } from 'react-map-gl';


const GPXMap = ({ gpxFile }) => {
  const [trackCoordinates, setTrackCoordinates] = useState([]);

  useEffect(() => {
    const loadGPXRoute = async () => {
      const trackCoordinates = await parseGPXFile(gpxFile);
      setTrackCoordinates(trackCoordinates);
    };

    loadGPXRoute();
  }, [gpxFile]);

    const parseGPXFile = async (gpxFile) => {
        const response = await fetch(gpxFile);
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const trackpoints = xmlDoc.querySelectorAll('trkpt');
        // console.log("trackpoints", trackpoints)
        // const trackpointsArray = Array.isArray(trackpoints) ? trackpoints : [trackpoints];
        // console.log("trackpointsArray", trackpointsArray)
        const trackCoordinates = [];
        for (const trackpoint of trackpoints) {
            trackCoordinates.push({
                lat: parseFloat(trackpoint.getAttribute('lat')),
                lon: parseFloat(trackpoint.getAttribute('lon')),
            });
        }
        //setTrackCoordinates(trackpointsAll)
        //console.log("trackpointsAll", trackpointsAll)
        return trackCoordinates;
        // const trackCoordinates = trackpointsArray.map((trackpoint) => {
        //     console.log("trackpoint", trackpoint)
        //     return [
        //         parseFloat(trackpoint.getAttribute('lon')), // Adjust index as needed
        //         parseFloat(trackpoint.getAttribute('lat')),
        //     ];
        // });
        // return trackCoordinates;
    };
    console.log("trackCoordinates", trackCoordinates[0])
  return (
    <div style={{ height: '500px', width: '500px', margin: '20px'}}>
        {trackCoordinates[0] && <Map 
            mapLib={import('mapbox-gl')}
            initialViewState={{
                longitude: trackCoordinates[0].lon,
                latitude: trackCoordinates[0].lat,
                zoom: 13
            }}
            mapStyle="mapbox://styles/maaaik/clojd84jt004a01qn4cpuhklc"
         >
            <Layer
                data={trackCoordinates}
                type='line'
                source='my-source'
                layout={{
                    'line-color': 'blue',
                    'line-width': 2,
                    }}
                paint={{
                    'line-color': 'blue',
                    'line-width': 2,
                }}
            />
        </Map>}
    </div>

   
  );
};

export default GPXMap;