import './App.css';
import Search from './components/search/search.js'
import CurrentWeather from './components/current-weather/current-weather';
import { useState } from 'react';
import Forecast from './components/forecast/forecast';

function App() {

  const [isDefault,setIsDefault]=useState(true);
  const getLocation = async () => {

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b7951dec1bmsh10c92dcb46f7efcp1514fdjsn1f58e3c32830',
        'X-RapidAPI-Host': 'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com'
      }
    };

    const response = await fetch('https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation?apikey=873dbe322aea47f89dcf729dcc8f60e8', options)
    const data = await response.json();
    const currentWeatherFetch = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&appid=936661c4b0abd2a5647f7efdf6b5f409&units=metric`);
    const forecastWeatherFetch = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.latitude}&lon=${data.longitude}&appid=936661c4b0abd2a5647f7efdf6b5f409&units=metric`);

    Promise.all([currentWeatherFetch, forecastWeatherFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: `${data.city}, ${data.countryISO2}`, ...weatherResponse });
        setForecast({ city: `${data.city}, ${data.countryISO2}`, ...forecastResponse });
      })
      .catch((err) => console.log(err));

    console.log(currentWeather);
    console.log(forecast);
  }

  if(isDefault)
  {
    getLocation();
    setIsDefault(false);
  }

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleOnSearchChange = (searchData) => {
    const [lat, long] = searchData.value.split(" ");
    const currentWeatherFetch = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=936661c4b0abd2a5647f7efdf6b5f409&units=metric`);
    const forecastWeatherFetch = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=936661c4b0abd2a5647f7efdf6b5f409&units=metric`);

    Promise.all([currentWeatherFetch, forecastWeatherFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.log(err));

    console.log(currentWeather);
    console.log(forecast);
  }
  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
