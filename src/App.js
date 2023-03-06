import './App.css';
import Search from './components/search/search.js'
import CurrentWeather from './components/current-weather/current-weather';
import { useState } from 'react';
import Forecast from './components/forecast/forecast';

function App() {

  const[currentWeather,setCurrentWeather]=useState(null);
  const[forecast,setForecast]=useState(null);

  const handleOnSearchChange=(searchData)=>{
    const [lat,long]=searchData.value.split(" ");
    const currentWeatherFetch=fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=936661c4b0abd2a5647f7efdf6b5f409&units=metric`);
    const forecastWeatherFetch=fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=936661c4b0abd2a5647f7efdf6b5f409&units=metric`);
    
    Promise.all([currentWeatherFetch,forecastWeatherFetch])
    .then(async(response)=>{
      const weatherResponse = await response[0].json();
      const forecastResponse = await response[1].json();

      setCurrentWeather({city: searchData.label, ...weatherResponse});
      setForecast({city: searchData.label, ...forecastResponse});
    })
    .catch((err)=>console.log(err));

    console.log(currentWeather);
    console.log(forecast);
  } 
  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange}/>
      {currentWeather && <CurrentWeather data={currentWeather}/>}
      {forecast && <Forecast data={forecast}/>}
    </div>
  );
}

export default App;
