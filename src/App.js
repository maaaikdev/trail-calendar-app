import './App.css';
import NavBar from './components/Navbar';
import EventCard from './components/EventCard';
import EventCardComponent from './components/EventCardComponents';
import CarouselEvents from './components/CarouselEvents';


//Docs to build the structure> https://tailwindcss.com/docs/

function App() {
  return (
    <div className="App">
		<NavBar />
		<div className="lg:container xs:w-full lg:mx-auto sm:mx-0 xs: mx-0">
			<div>
				{/* <EventCard /> */}
				<CarouselEvents />
			</div>
		</div>
    </div>
  );
}

export default App;
