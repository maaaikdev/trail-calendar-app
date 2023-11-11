import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchBox } from '@mapbox/search-js-react';
import "./EventCardDetailComponent.scss";
import { Layer, Source } from 'react-map-gl';
import toGeoJSON from 'togeojson';
import { DOMParser } from 'xmldom';
import GPXMap from './GPXMap';


const TOKEN = process.env.REACT_APP_TOKEN;

const EventCardDetailComponent = () => {

    const [ map, setMap ] = useState(null);
    const [ value, setValue ] = useState('');
    const [ route, setRoute ] = useState([]);
    const [trackCoordinates, setTrackCoordinates] = useState([]);

    const mapContainerRef = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = TOKEN;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/maaaik/clojd84jt004a01qn4cpuhklc',
            center: [-73.943, 40.7789],
            zoom: 13
        });

        setMap(map);

        
        
        return () => map.remove();

    },[]);

    // const loadGPXFile = async () => {
    //     debugger
    //     const response = await fetch('data/Las_Palmas_Run.gpx');
    //     const text = await response.text();
    //     const parser = new DOMParser();
    //     const xmlDoc = parser.parseFromString(text, 'text/xml');
    //     const trackpoints = xmlDoc.querySelectorAll('trkpt');
    //     const routeCoordinates = trackpoints.map((trackpoint) => {
    //     return [
    //         parseFloat(trackpoint.getAttribute('lon')),
    //         parseFloat(trackpoint.getAttribute('lat')),
    //     ];
    //     });
    //     setRoute(routeCoordinates);
    // };

    console.log("ROUTE", route)

    return(
        <>
            <div>Detail event</div>
            <div style={{width: '500px', margin: '20px'}}>
                <SearchBox
                    accessToken={TOKEN}
                    value={value}
                    onChange={(v) => {
                        setValue(v);
                        console.log('change', v)
                    }}
                    onSuggest={(res) => console.log('suggest', res) }
                    onSuggestError={(err) => console.log('err', err) }
                    onRetrieve={(res) => console.log('retrieve', res) }
                    map={map}
                />
            </div>
            <br></br>
            <div
                className='map-container'
                style={{ height: '500px', width: '500px', margin: '20px'}}
                ref={mapContainerRef}
            >
            </div>
            <br></br>
            <GPXMap gpxFile="data/Las_Palmas_Run.gpx" />
        </>
    )
};

export default EventCardDetailComponent;