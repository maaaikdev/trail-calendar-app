import './App.css';
import NavBar from './components/Navbar';
import CarouselEvents from './components/CarouselEvents';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import FormCreateEvent from './components/FormCreateEvent';
import EventCardDetailComponent from './components/EventCardDetailComponent';
import Store from './store/store';


//Docs to build the structure> https://tailwindcss.com/docs/

function App() {
  return (
    <div className="App">
		<Store>
			<BrowserRouter>
				<NavBar />			
				<div className="lg:container xs:w-full lg:mx-auto sm:mx-0 xs: mx-0">
					<div>
						<Routes>
							<Route path="/" element={<CarouselEvents />} />
							<Route path="/:id" element={<EventCardDetailComponent />} />
							<Route path="/create-event" element={<FormCreateEvent />} />
						</Routes>
					</div>
				</div>
			</BrowserRouter>
		</Store>				
    </div>
  );
}

export default App;
