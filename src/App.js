import './App.css';
import NavBar from './components/Navbar';
import EventCard from './components/EventCard';
import EventCardComponent from './components/EventCardComponents';
import CarouselEvents from './components/CarouselEvents';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import FormCreateEvent from './components/FormCreateEvent';


//Docs to build the structure> https://tailwindcss.com/docs/

function App() {
  return (
    <div className="App">
		<BrowserRouter>
			<NavBar />			
			<div className="lg:container xs:w-full lg:mx-auto sm:mx-0 xs: mx-0">
				<div>
					<Routes>
						<Route path="/" element={<CarouselEvents />} />
						<Route path="/:id" element={<CarouselEvents />} />
						<Route path="/create-event" element={<FormCreateEvent />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>		
    </div>
  );
}

export default App;
