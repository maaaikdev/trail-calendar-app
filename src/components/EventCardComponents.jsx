import React from 'react';
import { TERipple } from 'tw-elements-react';
import "./EventCardComponents.scss"

const columns = 4

const EventCardComponent = (props) => {

    const { eventList } = props;

    console.log("EVENT LIS ------>", eventList)

    return (
        <div
            className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 my-6 mx-2 eventCard">
            <TERipple>
                <div
                    className="relative overflow-hidden bg-cover bg-no-repeat">
                    <img
                        className="rounded-t-lg"
                        src="https://tecdn.b-cdn.net/img/new/standard/nature/186.jpg"
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
                        <time datetime="2020-03-16" className="text-gray-500">{eventList.date}</time>
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
                                        <h4 className='text-base font-semibold text-gray-900'>{distance}k</h4>
                                    </div>
                                ))}
                                {/* // <div className="flex flex-col justify-center items-center rounded px-3 py-1 border border-gray-200">
                                //     <h4 className='text-base font-semibold text-gray-900'>21k</h4>
                                // </div>
                                // <div className="flex flex-col justify-center items-center rounded px-3 py-1 border border-gray-200">
                                //     <h4 className='text-base font-semibold text-gray-900'>10k</h4>
                                // </div>
                                // <div className="flex flex-col justify-center items-center rounded px-3 py-1 border border-gray-200">
                                //     <h4 className='text-base font-semibold text-gray-900'>5k</h4>
                                // </div>
                                // <div className="flex flex-col justify-center items-center rounded px-3 py-1 border border-gray-200">
                                //     <h4 className='text-base font-semibold text-gray-900'>2k</h4>
                                // </div> */}
                            </div>
                        </div>                        
                        {/* <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">Cordillera Trail Futuro regresa para celebrar su décima edición, invitando a los participantes a desafiar los senderos y las montañas de la región del Tequendama, culminando en el bosque de niebla del Parque Natural Chicaque. Una experiencia única que año tras año atrae a los mejores corredores a superar sus tiempos en una ruta de otro nivel.</p> */}
                    </div>
                    <div className="relative mt-0 flex items-center gap-x-4">
                        <img src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                        <div className="text-sm leading-6">
                            <p className="text-gray-600">Organizador</p>
                            <p className="font-semibold text-gray-900">
                                <a href="#">
                                    <span className="absolute inset-0"></span>
                                    Aire Libre y Aventura
                                </a>
                            </p>                            
                        </div>
                    </div>
                </article>
                {/* <TERipple>
                    <button
                        type="button"
                        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
                        Button
                    </button>
                </TERipple> */}
            </div>
        </div>
    );
}

export default EventCardComponent;