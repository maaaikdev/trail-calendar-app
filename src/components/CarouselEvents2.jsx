import React, { useState, useEffect } from 'react';
import EventCardComponent from "./EventCardComponents";
import "./CarouselEvents2.scss";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase/config";
import { useEventsContext } from './../store/store'

const CarouselEvents2 = () => {   

    const { eventListItems, addEvent } = useEventsContext();
    

    useEffect(() => {
        
        const track = document.querySelector('.track');
        let initialPosition = null;
        let moving = false;
        let transform = 0;
        let selectedElement = null; 
        const gestureStart = (e) => {
            //console.log('gestureStart', e);
            initialPosition = e.pageX;
            moving = true;
            const transformMatrix = window.getComputedStyle(track).getPropertyValue('transform');
            if (transformMatrix != 'none') {
                transform = parseInt(transformMatrix.split(',')[4].trim());
            }
            console.log(transform)
        }        

        const gestureMove = (e) => {
            //console.log('gestureMove', e);
            if(moving) {
                const currentPosition = e.pageX;
                const diff = currentPosition - initialPosition;
                track.style.transform = `translateX(${transform + diff}px)`;
            }
            const touchElement = document.elementFromPoint(e.clientX, e.clientY);
            //console.log('gestureMove 2', touchElement);
            if (touchElement && touchElement.closest('.carousel')) {
                if (touchElement.classList.contains('card')) {
                    if (selectedElement !== touchElement) {
                        if (selectedElement) {
                            selectedElement.classList.remove('selected');
                        }
                        touchElement.classList.add('selected');
                        selectedElement = touchElement;
                    }
                } else {
                    if (selectedElement) {
                        selectedElement.classList.remove('selected');
                        selectedElement = null;
                    }
                }
            }           
        }

        const gestureEnd = (e) => {
            //console.log('gestureEnd', e);
            moving = false;
        }

        if(window.PointerEvent) {
            window.addEventListener('pointerdown', gestureStart);
            window.addEventListener('pointermove', gestureMove);
            window.addEventListener('pointerup', gestureEnd);
        } else {
            window.addEventListener('touchdown', gestureStart);
            window.addEventListener('touchmove', gestureMove);
            window.addEventListener('touchup', gestureEnd);
            window.addEventListener('mousedown', gestureStart);
            window.addEventListener('mousemove', gestureMove);
            window.addEventListener('mouseup', gestureEnd);
        }
        getListElements();
	}, []);    

    function compareByDate(a, b) {
        return a.date - b.date;
    }

    const getListElements = () => {
        const eventRef = collection(db, "events");
        // const eventRef = db.collection("events");
        getDocs(eventRef)
            .then((resp) => {
                const list = resp.docs.map((doc) => {
                    return { ...doc.data(), id: doc.id }
                })
                const orderedItems = [...list];
                orderedItems.sort(compareByDate);
                console.log('orderedItems', orderedItems)
                // setEventList(orderedItems);
                addEvent(orderedItems)
            })  
    }

    const array = [
        {
            name: "Titulo 1"
        },
        {
            name: "Titulo 2"
        },
        {
            name: "Titulo 3"
        },
        {
            name: "Titulo 4"
        },
        {
            name: "Titulo 5a"
        }
    ]
    return (
        <div className='container-carousel'>
            <div className='carousel'>
                <div className='track'>
                    {eventListItems.map((item, index) =>
                        <div className='card' key={index}>
                            <div className='box-img'>
                                <img src={item.mainImg} alt='' />
                            </div>                            
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default CarouselEvents2