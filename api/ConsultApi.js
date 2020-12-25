export default async function getCurrentWeather(locationCoords){

    const axios = require('axios')

    //const lat = -16.9180263
    //const log = -47.7114333
    const lat = locationCoords.latitude
    const log =locationCoords.longitude

    var results = []

    await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=5af019f60f25a5f2cd684aae11e6b999`)
        .then(function (response){
            
            const data = response.data    
            console.log(data);
            const chuva = data.weather[0].description
            //const chuva = "Mostra Info da API"
            const locationName = (data.sys.country + ', ' + ' ' + data.name)
            const temperatureMin = data.main.temp_min
            const temperatureMax = data.main.temp_max
            const wind = data.wind.speed
            const humidity = data.main.humidity
            const currentTemperature = data.main.temp

            //results = [locationName]
            results = [chuva, currentTemperature, temperatureMin, temperatureMax, locationName, wind, humidity]
            
        })
        .catch(function (error) {
            console.log(error)
        })

        return results
}