import './App.css';
import NavBar from './components/Navbar';
import EventCard from './components/EventCard';


//Docs to build the structure> https://tailwindcss.com/docs/

function App() {
  return (
    <div className="App">
		<NavBar />
		<div className="container">
			<div className="grid grid-cols-12 gap-4">
				<div className='col-span-9'>
					<EventCard />
				</div>
				<div>09</div>
			</div>
		</div>
    </div>
  );
}

export default App;
