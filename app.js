const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
require('dotenv').config();

console.log(process.env);

const app = express();

app.use(bodyParser.urlencoded({extended : true}))

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.post('/', (req, res) => {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const units = 'metric';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`;
  https.get(url, (response) => {

    response.on('data', (data) => {
      const weathData = JSON.parse(data);
      const temp = weathData.main.temp;
      const weatherDescription = weathData.weather[0].description;
      const icon = weathData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      res.write(`<p>The weather is currently ${weatherDescription}</p>`);
      res.write(`<h1>The temperature in ${query} is ${temp} degrees.</h1>`);
      res.write(`<img src="${imageURL}">`);
      res.send();
      
    })
  })
})

 

app.listen(3000, () => console.log('The server is running on port 3000.'));