import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import EventCardComponent from "./EventCardComponents";
import "./CarouselEvents.scss"
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase/config";
import { useEventsContext } from './../store/store'

const CarouselEvents = () => {
    
    const { eventListItems, addEvent } = useEventsContext();
    const [ windowWidth, setWindowWidth ] = useState(window.innerWidth);
    const [ eventList, setEventList ] = useState([])

    useEffect(() => {
		// Manejar cambios en el ancho de la ventana
		function handleResize() {
			setWindowWidth(window.innerWidth);
		}		
		window.addEventListener('resize', handleResize);

        const eventRef = collection(db, "events");
        // const eventRef = db.collection("events");
        getDocs(eventRef)
            .then((resp) => {
                const list = resp.docs.map((doc) => {
                    return { ...doc.data(), id: doc.id }
                })
                const orderedItems = [...list];
                orderedItems.sort(compareByDate);
                // setEventList(orderedItems);
                addEvent(orderedItems)
            })  

		return () => {
			window.removeEventListener('resize', handleResize);
		};        

	}, [windowWidth]); 

    // Función de comparación para ordenar por fecha
    function compareByDate(a, b) {
        return a.date - b.date;
    }

    const categories = [];

    // eventList.forEach(item => {
    //     if (!categories[item.month]) {
    //         categories[item.month] = [];
    //     }
    //     categories[item.month].push(item);
    // });

    eventListItems.forEach(item => {
        if (!categories[item.month]) {
            categories[item.month] = [];
        }
        categories[item.month].push(item);
    });

    console.log("CATEGORIA", categories)

    var settings = {
        className: "center",
        centerMode: windowWidth < 768 ? true : false,
        centerPadding: "28px",
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

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
            name: "Titulo 5"
        }
    ]
    return (
        <div className='carousel-events'>
            <h2> Multiple items </h2>
            {Object.keys(categories).map(month => (
                <div key={month}>
                    <h2 className='sm:text-sm lg:text-lg font-semibold leading-7 text-gray-900 text-left margin-title'>{`${month}`}</h2>
                    <Slider {...settings}>
                        {                            
                            categories[month].map((item, index) => (
                                <EventCardComponent key={item.id} eventList={item}/>
                            ))
                        }                
                    </Slider>
                </div>
            ))}
            {/* <Slider {...settings}>
                {
                    eventList.length > 0 && eventList.map((item, index) => (
                        <EventCardComponent key={item.id} eventList={item}/>
                    ))
                }                
            </Slider> */}
        </div>
    )
}
export default CarouselEvents