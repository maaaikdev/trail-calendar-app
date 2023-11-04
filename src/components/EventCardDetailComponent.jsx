import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEventsContext } from './../store/store';
import ReactMapGl, { Layer, Marker, NavigationControl, Source, FullscreenControl, GeolocateControl } from "react-map-gl"

const TOKEN = process.env.REACT_APP_TOKEN

const EventCardDetailComponent = () => {

    const { eventListItems } = useEventsContext();
    const { id } = useParams();
    const [ eventDetail, setEventDetail ] = useState({});
    const [ newPlace, setNewPlace ] = useState(null);
    const [ windowWidth, setWindowWidth ] = useState(window.innerWidth);
    const [ viewPort, setViewPort ] = useState({
        latitude: 6.14780,
        longitude: -75.60623,
        zoom: 16
    })

    useEffect(() => {
		// Manejar cambios en el ancho de la ventana
		function handleResize() {
			setWindowWidth(window.innerWidth);
		}		
		window.addEventListener('resize', handleResize);
        const itemEvent = eventListItems.find(event => event.id === id);
        setEventDetail(itemEvent)

		return () => {
			window.removeEventListener('resize', handleResize);
		};        

	}, [windowWidth]); 

    const handleAddClick = (e) => {
        setNewPlace({
            lat: e?.lngLat?.lat,
            lng: e?.lngLat?.lng,
        })
    }

    return(
        <>
            <div>Detail event</div>
            <div style={{width: "100vw", height:"100vh", zIndex: 999}}>
                <ReactMapGl
                    {...viewPort}
                    mapboxAccessToken={TOKEN}
                    width="100%"
                    height="100%"
                    initialViewState={viewPort}
                    transitionDuration="200"
                    mapStyle="mapbox://styles/maaaik/clojd84jt004a01qn4cpuhklc"
                    onMove={(viewPort) => setViewPort(viewPort)}
                    onDblClick={handleAddClick}
                    attributionControl={true}
                >
                    {newPlace ? (
                        <Marker
                            latitude={newPlace?.lat}
                            longitude={newPlace?.lng}
                            draggable
                            onDragEnd={(e) =>
                                setNewPlace({ lng: e.lngLat.lng, lat: e.lngLat.lat })
                            }
                        />
                    ) : null}
                    <NavigationControl position="bottom-right" />
                </ReactMapGl>
            </div>
        </>
    )
};

export default EventCardDetailComponent;