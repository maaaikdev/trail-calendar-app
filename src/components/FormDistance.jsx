import { useState } from 'react';
import { useForm } from "react-hook-form";

const FormDistance = (props) => {

    const [long, setLong] = useState(0);
    const [ascent, setAscent] = useState(0);
    const [descent, setDescent] = useState(0);
    const [averageTime, setAverageTime] = useState("");
    const [highestPoint, setHighestPoint] = useState(0);
    const [lowestPoint, setLowestPoint] = useState(0);
    const [estimatedAverageSpeed, setEstimatedAverageSpeed] = useState("");
    const [averageInclination, setAverageInclination] = useState(0);

    const send = (data) => {

        // const event = {
        //     title: data.nameEvent,
        //     date: mes,
        //     level: selected.name,
        //     category: selectedCategory.name,
        //     description: data.description
        // }
        console.log("FORM", data);
    }

    const handleSendCreateDistance = () => {
        const distance = {
            long: long,
            averageTime: averageTime,
            ascent: ascent,
            descent: descent,
            highestPoint: highestPoint,
            lowestPoint: lowestPoint,
            EstimatedAverageSpeed: estimatedAverageSpeed,
            averageInclination: averageInclination,
            technicalDifficulty: 0,
            fitnessRequired: 0,
        }
        console.log("Form distance:", distance);
    }

    return (
        <div className='col-span-12 grid grid-cols-12 gap-x-8 gap-y-6'>
            <div className="col-span-4">
                <label htmlFor="long" className="block text-sm font-semibold leading-6 text-gray-900">Distancia</label>
                <div className="mt-2.5">
                    <input 
                        type="number" 
                        name="long" 
                        id="long"                        
                        placeholder="Distancia" 
                        autoComplete="Distancia"
                        value={long}
                        onChange={(e) => setLong(e.target.value)}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    />
                </div>
            </div>
            <div className="col-span-4">
                <label htmlFor="ascent" className="block text-sm font-semibold leading-6 text-gray-900">Ascenso en m</label>
                <div className="mt-2.5">
                    <input 
                        type="number" 
                        name="ascent" 
                        id="ascent" 
                        placeholder="1000" 
                        autoComplete="Ascenso en m" 
                        value={ascent}
                        onChange={(e) => setAscent(e.target.value)}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    />
                </div>
            </div>
            <div className="col-span-4">
                <label htmlFor="descent" className="block text-sm font-semibold leading-6 text-gray-900">Descenso en m</label>
                <div className="mt-2.5">
                    <input 
                        type="number" 
                        name="descent" 
                        id="descent" 
                        placeholder="650" 
                        autoComplete="Descenso en m" 
                        value={descent}
                        onChange={(e) => setDescent(e.target.value)}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    />
                </div>
            </div>
            <div className="col-span-4">
                <label htmlFor="averageTime" className="block text-sm font-semibold leading-6 text-gray-900">Tiempo promedio</label>
                <div className="mt-2.5">
                    <input 
                        type="text" 
                        name="averageTime" 
                        id="averageTime" 
                        placeholder="5h 55min" 
                        autoComplete="Tiempo promedio" 
                        value={averageTime}
                        onChange={(e) => setAverageTime(e.target.value)}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    />
                </div>
            </div>
            <div className="col-span-4">
                <label htmlFor="highestPoint" className="block text-sm font-semibold leading-6 text-gray-900">Punto más alto</label>
                <div className="mt-2.5">
                    <input 
                        type="number" 
                        name="highestPoint" 
                        id="highestPoint" 
                        placeholder="1000" 
                        autoComplete="Punto más alto" 
                        value={highestPoint}
                        onChange={(e) => setHighestPoint(e.target.value)}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    />
                </div>
            </div>
            <div className="col-span-4">
                <label htmlFor="LowestPoint" className="block text-sm font-semibold leading-6 text-gray-900">Punto más bajo</label>
                <div className="mt-2.5">
                    <input 
                        type="number" 
                        name="lowestPoint" 
                        id="lowestPoint" 
                        placeholder="650" 
                        autoComplete="Punto más bajo"
                        value={lowestPoint}
                        onChange={(e) => setLowestPoint(e.target.value)}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    />
                </div>
            </div>
            <div className="col-span-4">
                <label htmlFor="EstimatedAverageSpeed" className="block text-sm font-semibold leading-6 text-gray-900">Velocidad promedio</label>
                <div className="mt-2.5">
                    <input 
                        type="text" 
                        name="estimatedAverageSpeed" 
                        id="estimatedAverageSpeed" 
                        placeholder="5.6 km/h" 
                        autoComplete="Lugar del evento" 
                        value={estimatedAverageSpeed}
                        onChange={(e) => setEstimatedAverageSpeed(e.target.value)}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    />
                </div>
            </div>
            <div className="col-span-4">
                <label htmlFor="averageInclination" className="block text-sm font-semibold leading-6 text-gray-900">Inclinació promedio (%)</label>
                <div className="mt-2.5">
                    <input 
                        type="number" 
                        name="averageInclination" 
                        id="averageInclination" 
                        placeholder="20" 
                        autoComplete="Inclinació promedio"
                        value={averageInclination}
                        onChange={(e) => setAverageInclination(e.target.value)}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    />
                </div>
            </div>
            <button 
                onClick={handleSendCreateDistance}
                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
            >Crear Distancia</button>
        </div>
    )
}

export default FormDistance;