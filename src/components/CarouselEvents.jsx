import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import EventCardComponent from "./EventCardComponents";
import "./CarouselEvents.scss"
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase/config"

const CarouselEvents = () => {

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
                console.log("DATABASE", resp.docs);
                const list = resp.docs.map((doc) => {
                    return { ...doc.data(), id: doc.id }
                })
                setEventList(list)
            })  

		return () => {
			window.removeEventListener('resize', handleResize);
		};        

	}, [windowWidth]); 

    

    console.log("EVENT LIST", eventList)

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
        <div>
            <h2> Multiple items </h2>
            <Slider {...settings}>
                {
                    eventList.length > 0 && eventList.map((item, index) => (
                        <EventCardComponent key={item.id} eventList={item}/>
                    ))
                }                
            </Slider>
        </div>
    )
}
export default CarouselEvents