import { Fragment, useState } from 'react';
import { useForm } from "react-hook-form";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import "./FormCreateEvent.scss"
import FormDistance from './FormDistance';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase/config" 

const people = [
    {
        id: 1,
        name: 'Fácil',
        avatar:
        'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        id: 2,
        name: 'Moderado',
        avatar:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        id: 3,
        name: 'Dificil',
        avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    }
]

const category = [
    {
        id: 1,
        name: 'Trailrunning',
        avatar:
        'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        id: 2,
        name: 'Running',
        avatar:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        id: 3,
        name: 'Bike',
        avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    }
]

const FormCreateEvent = (props) => {

    const [startDate, setStartDate] = useState(new Date());
    const [selected, setSelected] = useState(people[0]);
    const [selectedCategory, setSelectedCategory] = useState(category[0]);
    const [showNestedForm, setShowNestedForm] = useState(false);
    const [file, setFile] = useState(null);
    const [showFile, setShowFile] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [showLogoFile, setShowLogoFile] = useState(null);
    const [formDistance, setFormDistance] = useState([]);
    const [eventForm, setEventForm] = useState({
        id: crypto.randomUUID(),
        date: "",
        level: "",
        title: "",
        category: "",
        month: "",
        mainImg: "",
        logoEvent: "",
        lon: "",
        lat: "", 
        location: "",
        description: "",
        edition: "",
        distances: [],        
        organizer: "",
        webEvent: "",
        emailEvent: "",
        instagramEvent: "",
        phoneEvent: 0
    });
    const[distances, setDistances] = useState([])

    const { register, handleSubmit } = useForm();

    const send = async(data) => {
        console.log("DATA BEFORE FORM", data)
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const fecha = new Date(startDate);
        const mes = meses[fecha.getMonth()];

        const eventFormContent = {
            id: crypto.randomUUID(),
            date: fecha,
            title: data.nameEvent,
            level: selected.name,
            category: selectedCategory.name,
            month: mes, 
            mainImg: file,
            logoEvent: logoFile,
            long: "",
            lat:"",
            location: data.location,
            description: data.description,
            distances: distances,
            edition: data.edition,
            organizer: data.organizer,
            webEvent: data.webEvent,
            emailEvent: data.emailEvent,
            instagramEvent: data.instagramEvent,
            phoneEvent: data.phoneEvent
        };
        console.log("DATA ------> 3", eventFormContent);

        try {
            await addDoc(collection(db, "events"),{
                ...eventFormContent
            })
        } catch (error) {
            console.log("Error catch", error)
        }    
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    // Hero Image
    const handleUploadFile = async (e) => {
        const selectedFile = e.target.files[0];

        const refImgFile = ref(storage, `eventImages/${selectedFile.name}`);
        await uploadBytes(refImgFile, selectedFile);
        const resultImg = await getDownloadURL(refImgFile)
        setFile(resultImg)

        const imagenURL = URL.createObjectURL(selectedFile);
        setShowFile(imagenURL);
    }

    const handleDeleteImage = () => {
        setShowFile(null)
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    };
    
    const handleDrop = async (e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];

        const refImgFile = ref(storage, `eventImages/${selectedFile.name}`);
        await uploadBytes(refImgFile, selectedFile);
        const resultImg = await getDownloadURL(refImgFile)
        setFile(resultImg);

        const imagenURL = URL.createObjectURL(selectedFile);
        setShowFile(imagenURL);
    };
     // Hero Image

     // Logo Image
    const handleUploadLogoFile = async (e) => {
        const selectedFile = e.target.files[0];

        const refImgFile = ref(storage, `logoEvents/${selectedFile.name}`);
        await uploadBytes(refImgFile, selectedFile);
        const resultImg = await getDownloadURL(refImgFile)
        setLogoFile(resultImg)

        const imagenURL = URL.createObjectURL(selectedFile);
        setShowLogoFile(imagenURL);
    }

    const handleDeleteLogoImage = () => {
        setShowLogoFile(null)
    }

    const handleDragOverLogo = (e) => {
        e.preventDefault();
    };
    
    const handleDropLogo = async (e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];

        const refImgFile = ref(storage, `logoEvents/${selectedFile.name}`);
        await uploadBytes(refImgFile, selectedFile);
        const resultImg = await getDownloadURL(refImgFile)
        setLogoFile(resultImg);

        const imagenURL = URL.createObjectURL(selectedFile);
        setShowLogoFile(imagenURL);
    };
     // Logo Image

    const getDataFormDistance = (data) => {
        const temp = [...distances];
        temp.push(data);        
        setDistances(temp)
    }

    const addComponents = () => {
        const newKey = formDistance.length; 
        setFormDistance([...formDistance, <FormDistance key={newKey} deleteComponent={() => deleteComponent(newKey)} dataFormDistance={getDataFormDistance} />]);
    };

    const deleteComponent = (key) => {
        const newComponent = formDistance.filter((component) => component.key !== key);
        setFormDistance(newComponent);
    };

    return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 text-left lg:px-8">
            <p>Form Event</p>
            <form onSubmit={handleSubmit(send)} className="mx-auto mt-16 max-w-xl sm:mt-20">
                <fieldset>
                    <legend className="mb-6">Crear Evento</legend>
                    <div className="grid grid-cols-12 gap-x-8 gap-y-6">
                        <div className="col-span-12">
                            <label 
                                htmlFor="nameEvent" 
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >Nombre del evento</label>
                            <div className="mt-2.5">
                                <input 
                                    type="text" 
                                    id="nameEvent"
                                    name="nameEvent"
                                    placeholder="Nombre del evento" 
                                    {...register("nameEvent")}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                                />
                            </div>                            
                        </div>                        
                        <div className="col-span-6">
                            <label id="level" className="block text-sm font-medium leading-6 text-gray-900">Tipo de evento</label>
                            <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                                {({ open }) => (
                                    <>                                    
                                    <div className="relative mt-2">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                            <span className="flex items-center">
                                                <img src={selectedCategory.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                <span className="ml-3 block truncate">{selectedCategory.name}</span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {category.map((person) => (
                                            <Listbox.Option
                                                key={person.id}
                                                className={({ active }) =>
                                                classNames(
                                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                )}
                                                value={person}
                                            >
                                                {({ selected, active }) => (
                                                <>
                                                    <div className="flex items-center">
                                                        <img src={person.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                        <span
                                                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                        >
                                                            {person.name}
                                                        </span>
                                                    </div>

                                                    {selected ? (
                                                        <span
                                                            className={classNames(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                            )}
                                                        >
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                                )}
                                            </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                        </Transition>
                                    </div>
                                    </>
                                )}
                                </Listbox>
                        </div>
                        <div className="col-span-6">
                            <label id="level" className="block text-sm font-medium leading-6 text-gray-900">Nivel de dificultad</label>
                            <Listbox value={selected} onChange={setSelected}>
                                {({ open }) => (
                                    <>                                    
                                    <div className="relative mt-2">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                            <span className="flex items-center">
                                                <img src={selected.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                <span className="ml-3 block truncate">{selected.name}</span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {people.map((person) => (
                                            <Listbox.Option
                                                key={person.id}
                                                className={({ active }) =>
                                                classNames(
                                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                )}
                                                value={person}
                                            >
                                                {({ selected, active }) => (
                                                <>
                                                    <div className="flex items-center">
                                                        <img src={person.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                        <span
                                                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                        >
                                                            {person.name}
                                                        </span>
                                                    </div>

                                                    {selected ? (
                                                        <span
                                                            className={classNames(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                            )}
                                                        >
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                                )}
                                            </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                        </Transition>
                                    </div>
                                    </>
                                )}
                                </Listbox>
                        </div>
                        <div className="col-span-12">
                            <label htmlFor="location" className="block text-sm font-semibold leading-6 text-gray-900">Lugar del evento</label>
                            <div className="mt-2.5">
                                <input 
                                    type="text" 
                                    name="location" 
                                    id="location" 
                                    placeholder="Lugar del evento" 
                                    autoComplete="Lugar del evento"
                                    {...register("location")}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                                />
                            </div>
                        </div>
                        <div className="col-span-12">
                            <label htmlFor="description" className="block text-sm font-semibold leading-6 text-gray-900">Descripción del evento</label>
                            <div className="mt-2.5">
                                <textarea
                                    id="description"
                                    name="description"
                                    {...register("description")}
                                    rows="4"
                                    cols="50"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="col-span-4">
                            <label htmlFor="dateEvent" className="block text-sm font-semibold leading-6 text-gray-900">Fecha del evento</label>
                            <DatePicker
                                showIcon
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}                        
                                icon={
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 48 48"
                                    >
                                    <mask id="ipSApplication0">
                                        <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
                                        <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                                        <path
                                            fill="#fff"
                                            d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                                        ></path>
                                        </g>
                                    </mask>
                                    <path
                                        fill="currentColor"
                                        d="M0 0h48v48H0z"
                                        mask="url(#ipSApplication0)"
                                    ></path>
                                    </svg>
                                }
                                className="datapicker-custom"
                            />
                        </div>
                        <div className="col-span-4">
                            <label htmlFor="organizer" className="block text-sm font-semibold leading-6 text-gray-900">Organizador del evento</label>
                            <div className="mt-2.5">
                                <input 
                                    type="text" 
                                    name="organizer" 
                                    id="organizer" 
                                    placeholder="Organizador del evento" 
                                    autoComplete="Organizador del evento"
                                    {...register("organizer")}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                                />
                            </div>
                        </div>
                        <div className="col-span-4">
                            <label htmlFor="edition" className="block text-sm font-semibold leading-6 text-gray-900">No. Edición</label>
                            <div className="mt-2.5">
                                <input 
                                    type="number" 
                                    name="edition" 
                                    id="edition" 
                                    placeholder="Edición del evento" 
                                    autoComplete="Edición del evento"
                                    {...register("edition")}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                                />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Imágenes evento</label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10" onDrop={handleDrop} onDragOver={handleDragOver}>
                                <div className="text-center">                                    
                                    {showFile ? (
                                        <>
                                            <img src={showFile} alt="Imagen cargada" className="w-32 h-32 object-cover border border-gray-300" />
                                            <button onClick={handleDeleteImage}>Delete image</button>
                                        </>                                        
                                    ) : (
                                        <>
                                        <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                        </svg>
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label 
                                                    htmlFor="file-upload" 
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                                    <span>Upload a file</span>
                                                    <input 
                                                        id="file-upload" 
                                                        name="file-upload" 
                                                        type="file" 
                                                        accept=".jpg, .jpeg, .png" 
                                                        className="sr-only"                                                         
                                                        onChange={handleUploadFile}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </>                                        
                                    )}                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-span-6">
                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Logo del evento</label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10" onDrop={handleDropLogo} onDragOver={handleDragOverLogo}>
                                <div className="text-center">                                    
                                    {showLogoFile ? (
                                        <>
                                            <img src={showLogoFile} alt="Imagen cargada" className="w-32 h-32 object-cover border border-gray-300" />
                                            <button onClick={handleDeleteLogoImage}>Delete image</button>
                                        </>                                        
                                    ) : (
                                        <>
                                        <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                        </svg>
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label 
                                                    htmlFor="file-upload" 
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                                    <span>Upload a file</span>
                                                    <input 
                                                        id="file-upload" 
                                                        name="file-upload" 
                                                        type="file" 
                                                        accept=".jpg, .jpeg, .png" 
                                                        className="sr-only"                                                         
                                                        onChange={handleUploadLogoFile}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </>                                        
                                    )}                                    
                                </div>
                            </div>
                        </div>
                        <div className='col-span-12'>
                            {
                                distances.length > 0 && distances.map((item, index) => (
                                    <a href="#" key={index} className="relative z-10 rounded-lg bg-green-600 px-3 py-1.5 font-medium text-white mr-2">{item.long}k</a>
                                ))
                            }
                        </div>
                        <div className='col-span-12 mb-6'>                            
                            <button type="button" onClick={addComponents} className='btn-add-form text-sm font-semibold'>
                                {showNestedForm ? 'Ocultar distancia' : 'Añadir distancia'}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                            <div>
                                {formDistance}
                            </div>
                        </div>
                    </div>                    
                </fieldset>
                <fieldset>
                    <legend className="mb-6">Contacto del Evento</legend>
                    <div className="grid grid-cols-12 gap-x-8 gap-y-6">
                        <div className="col-span-6">
                            <label 
                                htmlFor="webEvent" 
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >Web del evento</label>
                            <div className="mt-2.5">
                                <input 
                                    type="text" 
                                    id="webEvent"
                                    name="webEvent"
                                    placeholder="Web del evento" 
                                    {...register("webEvent")}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                                />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <label 
                                htmlFor="webEvent" 
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >Email del evento</label>
                            <div className="mt-2.5">
                                <input 
                                    type="email" 
                                    id="emailEvent"
                                    name="emailEvent"
                                    placeholder="Email del evento" 
                                    {...register("emailEvent")}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                                />
                            </div>
                        </div> 
                        <div className="col-span-6">
                            <label 
                                htmlFor="instagramEvent" 
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >Instagram del evento</label>
                            <div className="mt-2.5">
                                <input 
                                    type="text" 
                                    id="instagramEvent"
                                    name="instagramEvent"
                                    placeholder="Instagram del evento" 
                                    {...register("instagramEvent")}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                                />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <label 
                                htmlFor="phoneEvent" 
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >Teléfono del evento</label>
                            <div className="mt-2.5">
                                <input 
                                    type="phone" 
                                    id="phoneEvent"
                                    name="phoneEvent"
                                    placeholder="Teléfono del evento" 
                                    {...register("phoneEvent")}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                                />
                            </div>
                        </div> 
                    </div>
                </fieldset>
                <button 
                    className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
                >Crear evento</button>
            </form>
        </div>
    )
}

export default FormCreateEvent;