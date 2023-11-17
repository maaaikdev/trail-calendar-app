import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchBox } from '@mapbox/search-js-react';
import "./EventCardDetailComponent.scss";
import GPXMap3 from './GPXMap3';


const TOKEN = process.env.REACT_APP_TOKEN;

const EventCardDetailComponent = () => {

    const [ map, setMap ] = useState(null);
    const [ value, setValue ] = useState('');

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
            <GPXMap3/>
        </>
    )
};

export default EventCardDetailComponent;