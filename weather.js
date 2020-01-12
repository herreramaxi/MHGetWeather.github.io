//InfoWeather
function InfoWeather(latitude, longitude) {
    this.url = "https://community-open-weather-map.p.rapidapi.com/weather";
    this.query = "?q={CITY-COUNTRY}&units=metric";
    this.city = "";
    this.country = "";
    this.cityCountry = "";
    this.cityCountryId = "";
    this.countryId = "";
    this.date = "";
    this.temperature = "";
    this.condition = "";
    this.urlimg = "http://openweathermap.org/img/wn/{ICON}@2x.png";
    this.conditionCode = "";
    this.urlWeatherImage = "";
    this.low = "";
    this.high = "";
    this.latitude = latitude;
    this.longitude = longitude;

    var getWeatherFrom = function (infoWeather) {

        var url = "https://geocodeapi.p.rapidapi.com/GetNearestCities?latitude={LATITUDE}&longitude={LONGITUDE}&range=0";
        url = url.replace("{LATITUDE}", infoWeather.latitude);
        url = url.replace("{LONGITUDE}", infoWeather.longitude);

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "geocodeapi.p.rapidapi.com",
                "x-rapidapi-key": "69b5e2598fmsh473f8f32041f929p1278bfjsn290058b3d5fe"
            }
        }

        return $.ajax(settings).then(function (responseGeodecode) {

            if (responseGeodecode) {
                console.log(responseGeodecode);
                var city = responseGeodecode[0];
                infoWeather.city = city.City;
                infoWeather.country = city.Country;
                infoWeather.countryId = city.CountryId;
                infoWeather.cityCountry = city.City + ',' + city.Country;
                infoWeather.cityCountryId = city.City + ',' + city.CountryId;

                infoWeather.query = infoWeather.query.replace("{CITY-COUNTRY}", infoWeather.cityCountryId);

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": infoWeather.url + infoWeather.query,
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
                        "x-rapidapi-key": "69b5e2598fmsh473f8f32041f929p1278bfjsn290058b3d5fe"
                    }
                }

                return $.ajax(settings).then(function (response) {
                    console.log(response);
                    var date = new Date(response.dt * 1000);
                    var condition = new ConditionCodes(response.weather[0], infoWeather);

                    return condition.getBackgroundUrlImage(infoWeather).then(function (response2) {
                        console.log(response2);
                        infoWeather.date = date.toLocaleString();
                        infoWeather.temperature = new Temperature(response.main.temp);
                        infoWeather.condition = condition;
                        infoWeather.urlWeatherImage = condition.urlImg;
                        infoWeather.urlimg = infoWeather.urlimg.replace("{ICON}", response.weather[0].icon);
                        infoWeather.low = new Temperature(response.main.temp_min);
                        infoWeather.high = new Temperature(response.main.temp_max);

                        return infoWeather;
                    });
                });
            }
            else {
                console.log("Error on responseGeodecode");
            }
        });
    }

    this.getWeather = function () { return getWeatherFrom(this); }

    function Temperature(celsiusTemperature) {
        this.celsius = celsiusTemperature;
        this.fahrenheit = Math.floor(celsiusTemperature * 9 / 5 + 32);
    };

    function ConditionCodes(weatherFromWebApi, infoWeather) {
        this.code = weatherFromWebApi.code;
        this.description = weatherFromWebApi.description;
        this.dayOrNight = weatherFromWebApi.icon.charAt(weatherFromWebApi.icon.length - 1).toLowerCase() == 'd' ? 'day' : 'night';

        var getBackgroundUrlImage = function (conditionCodes, infoWeather) {
            var urlImageApi = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=6b319e728b9bc03d6611bcca049137e5&text={QUERY}&format=json&nojsoncallback=1&content_type=1&geo_context=2&tags={TAGS}&media=photos";

            urlImageApi = urlImageApi.replace("{QUERY}", infoWeather.country + " " + conditionCodes.description + ' weather forecast ' + conditionCodes.dayOrNight);
            //&lat={LATITUDE}&lon={LONGITUDE}
            // urlImageApi = urlImageApi.replace("{LATITUDE}", infoWeather.latitude);
            // urlImageApi = urlImageApi.replace("{LONGITUDE}", infoWeather.longitude);
            urlImageApi = urlImageApi.replace("{TAGS}", infoWeather.country + "," + conditionCodes.description + 'weather,forecast,' + conditionCodes.dayOrNight);

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": urlImageApi,
                "method": "GET"
            }

            return $.ajax(settings).then(function (response) {
                var url = "https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg";
                var firstPhoto = response.photos.photo[0];

                url = url.replace("{farm-id}", firstPhoto.farm);
                url = url.replace("{server-id}", firstPhoto.server);
                url = url.replace("{id}", firstPhoto.id);
                url = url.replace("{secret}", firstPhoto.secret);

                conditionCodes.urlImg = url;
            });
        }

        this.getBackgroundUrlImage = function (infoWeather) { return getBackgroundUrlImage(this, infoWeather); }
    }
}
//End InfoWeather
