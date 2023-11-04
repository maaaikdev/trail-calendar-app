import React, { useState, useEffect } from 'react';
import { TERipple } from 'tw-elements-react';
import "./EventCardComponents.scss"
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const columns = 4

const EventCardComponent = (props) => {   

    const { eventList } = props;
    const [ dateEvent, setDateEvent ] = useState("")

    useEffect(() => {
        const date = new Date(eventList.date.seconds * 1000);
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        const formatDate = `${month} ${day}, ${year}`;
        setDateEvent(formatDate)
    }, [dateEvent])

    return (
        <Link to={`/${eventList.id}`}>
            <div
            className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 mt-2 mb-6 mx-2 eventCard">
                <TERipple>
                    <div
                        className="relative overflow-hidden bg-cover bg-no-repeat mainImg">
                        <img
                            className="rounded-t-lg"
                            src={eventList.mainImg}
                            alt="" />
                        <a href="#!">
                        <div
                            className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                        </a>
                    </div>
                </TERipple>
                <div className="p-6 text-left">
                    <article className="flex max-w-xl flex-col items-start justify-between">
                        <div className="flex items-center gap-x-4 text-xs">
                            <time datetime="2020-03-16" className="text-gray-500">{dateEvent}</time>
                            <a href="#" className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">{eventList.level}</a>
                        </div>
                        <div className="group relative">
                            <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                <a href="#">
                                    <span className="absolute inset-0"></span>
                                    {eventList.title}
                                </a>
                            </h3>
                            <h4 className='text-xs text-gray-900 mt-1'>{eventList.location}</h4>
                            <div className='distances flex flex-col px-0'>
                                <h3 className='text-xs font-semibold text-gray-900 mb-2'>Distancias</h3>
                                <div className={`grid grid-cols-${eventList.distances.length} gap-4 text-center`}>
                                    {eventList.distances.map((distance, index) => (
                                        <div key={index} className="flex flex-col justify-center items-center rounded px-3 py-1 border border-gray-200">
                                            <h4 className='text-base font-semibold text-gray-900'>{distance.long}k</h4>
                                        </div>
                                    ))}
                                </div>
                            </div>                        
                        </div>
                        <div className="relative mt-0 flex items-center gap-x-4">
                            <img src={eventList.logoEvent} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                            <div className="text-sm leading-6">
                                <p className="text-gray-600">Organizador</p>
                                <p className="font-semibold text-gray-900">
                                    <a href="#">
                                        <span className="absolute inset-0"></span>
                                        {eventList.organizer}
                                    </a>
                                </p>                            
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </Link>        
    );
}

export default EventCardComponent;