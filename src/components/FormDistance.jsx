import { useState } from 'react';
import "./FormDistance.scss";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase/config" 

const FormDistance = ({deleteComponent, dataFormDistance}) => {

    const [long, setLong] = useState(0);
    const [ascent, setAscent] = useState(0);
    const [descent, setDescent] = useState(0);
    const [averageTime, setAverageTime] = useState("");
    const [highestPoint, setHighestPoint] = useState(0);
    const [lowestPoint, setLowestPoint] = useState(0);
    const [estimatedAverageSpeed, setEstimatedAverageSpeed] = useState("");
    const [averageInclination, setAverageInclination] = useState(0);
    const [gpxFile, setGpxFile] = useState("");

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
            gpx: gpxFile
        }
        console.log("Form distance:", distance);
        dataFormDistance(distance)
    }

    const handleFileChange = async(event) => {
        const file = event.target.files[0];
        console.log("FILE", file)

        const refGpxFile = ref(storage, `gpxMap/${file.name}`);
        await uploadBytes(refGpxFile, file);
        const resultGpx = await getDownloadURL(refGpxFile)
        console.log("GPX", resultGpx)
        setGpxFile(resultGpx)

        // const imagenURL = URL.createObjectURL(file);
        // setShowFile(imagenURL);

        // if (file) {
        //     const reader = new FileReader();
        //     reader.onload = (e) => {
        //         const gpxData = e.target.result;
        //         setGpxFile(gpxData);
        //     };
        //     reader.readAsText(file);
        // }
    };

    return (
        <div className='col-span-12 grid grid-cols-12 gap-x-8 gap-y-6 py-6 border-b border-gray-900/10'>            
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
            <div className="col-span-12">
                <label htmlFor="gpx" className="block text-sm font-semibold leading-6 text-gray-900">Cargar archivo GPX</label>
                <div className="mt-2.5">
                    <input 
                        type="file" 
                        name="gpx" 
                        id="gpx" 
                        accept=".gpx"
                        placeholder="Cargar ruta en gpx" 
                        autoComplete="Cargar ruta en gpx"
                        onChange={handleFileChange}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    />
                </div>
            </div>
            <div className='btn-content col-span-12'>
                <a 
                    onClick={handleSendCreateDistance}
                    className="block w-40 rounded-md bg-green-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 mt-4"
                >Crear Distancia</a>
                <a onClick={deleteComponent} className='delete-btn'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    {/* Eliminar Componente */}
                </a>
            </div>
        </div>
    )
}

export default FormDistance;