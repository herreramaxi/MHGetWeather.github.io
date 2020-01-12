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
                    var date = new Date(response.dt * 1000);

                    console.log(response);
                    // infoWeather.city = response.query.results.channel.location.city;
                    // infoWeather.country = response.query.results.channel.location.country;
                    // infoWeather.cityCountry = infoWeather.city + ", " + infoWeather.country;
                    infoWeather.date = date.toLocaleString();
                    infoWeather.temperature = new Temperature(response.main.temp);
                    infoWeather.condition = weatherImages(response.weather[0]);
                    // infoWeather.conditionCode = response.query.results.channel.item.condition.code;
                    infoWeather.urlWeatherImage = infoWeather.condition.urlImg;
                    infoWeather.urlimg = infoWeather.urlimg.replace("{ICON}", response.weather[0].icon);
                    infoWeather.low = new Temperature(response.main.temp_min);
                    infoWeather.high = new Temperature(response.main.temp_max);

                    return infoWeather;
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

    function ConditionCodes(code, description, urlImg) {
        this.code = code;
        this.description = description;
        this.urlImg = urlImg;
    }

    var weatherImages = function (weather) {

        var isDayTime = weather.icon.charAt(weather.icon.length - 1).toLowerCase() == 'd';

        //TODO: Add conditionCodes for night

        if (weather.id >= 200 && weather.id < 300) {
            return new ConditionCodes(200, "thunderstorm", "https://c3.staticflickr.com/6/5066/5632698322_1422aba72c_b.jpg");
        }
        else if (weather.id >= 300 && weather.id < 500) {
            return new ConditionCodes(300, "drizzle", "https://c4.staticflickr.com/9/8376/8547528299_ec4dedd31f_k.jpg");
        }
        else if (weather.id >= 500 && weather.id < 600) {
            new ConditionCodes(500, "rain", "https://c3.staticflickr.com/6/5336/9430940674_3e4b62e370_b.jpg");
        }
        else if (weather.id >= 600 && weather.id < 700) {
            new ConditionCodes(600, "snow", "https://c6.staticflickr.com/6/5605/15667807021_a2b3221695_k.jpg");
        }
        else if (weather.id == 800) {
            return new ConditionCodes(800, "clear", "https://c5.staticflickr.com/9/8660/16712341612_128754a03c_k.jpg");
        }

        else if (weather.id > 800) {
            return new ConditionCodes(801, "clouds", "https://c6.staticflickr.com/9/8071/8313688965_2f6911c91a_h.jpg");
        }

        // new ConditionCodes(0, "tornado", "https://c3.staticflickr.com/8/7596/16199403314_1cf0cd0d0f_c.jpg"),
        // new ConditionCodes(1, "tropical storm", "https://c7.staticflickr.com/9/8388/8505828222_6790d72300_c.jpg"),
        // new ConditionCodes(2, "hurricane", "https://c7.staticflickr.com/5/4077/4786315382_6eef785848_z.jpg"),
        // new ConditionCodes(3, "severe thunderstorms", "https://c5.staticflickr.com/9/8631/15847204276_971bd78b61_c.jpg"),
        // new ConditionCodes(4, "thunderstorms", "https://c3.staticflickr.com/6/5066/5632698322_1422aba72c_b.jpg"),
        // new ConditionCodes(5, "mixed rain and snow", "https://c8.staticflickr.com/9/8646/16149284703_52a5c2cb09_c.jpg"),
        // new ConditionCodes(6, "mixed rain and sleet", "https://c8.staticflickr.com/9/8569/16006784783_028f95ab84_k.jpg"),
        // new ConditionCodes(7, "mixed snow and sleet", "https://c2.staticflickr.com/9/8391/8465062041_a8db67167b_c.jpg"),
        // new ConditionCodes(8, "freezing drizzle", "https://c6.staticflickr.com/3/2836/11890455445_028b5c4018_k.jpg"),
        // new ConditionCodes(9, "drizzle", "https://c4.staticflickr.com/9/8376/8547528299_ec4dedd31f_k.jpg"),"),
        // new ConditionCodes(10, "freezing rain", "https://c3.staticflickr.com/6/5336/9430940674_3e4b62e370_b.jpg"),
        // new ConditionCodes(11, "showers", "https://c7.staticflickr.com/4/3854/14711359358_d3bbe3de50_k.jpg"),
        // new ConditionCodes(12, "showers", "https://c3.staticflickr.com/4/3939/15426987970_49f14ece1e_h.jpg"),
        // new ConditionCodes(13, "snow flurries", "https://c2.staticflickr.com/7/6034/6343974385_8ca126edde_b.jpg"),
        // new ConditionCodes(14, "light snow showers", "https://c7.staticflickr.com/6/5209/5291930798_fa6cfddb7a_b.jpg"),
        // new ConditionCodes(15, "blowing snow", "https://c2.staticflickr.com/8/7490/15640621153_5429ed73dd_k.jpg"),
        // new ConditionCodes(16, "snow", "https://c6.staticflickr.com/2/1541/24475886789_44e3b0dbb3_k.jpg"),
        // new ConditionCodes(17, "hail", "https://c8.staticflickr.com/8/7716/17113538359_141db72c8c_k.jpg"),
        // new ConditionCodes(18, "sleet", "https://c7.staticflickr.com/3/2922/14421902862_b57e82177a_k.jpg"),
        // new ConditionCodes(19, "dust", "https://c7.staticflickr.com/6/5225/5737226174_c3c0d66cb0_b.jpg"),
        // new ConditionCodes(20, "foggy", "https://c8.staticflickr.com/4/3849/14417294855_92a30e4dd2_k.jpg"),
        // new ConditionCodes(21, "haze", "https://c5.staticflickr.com/9/8611/16454695092_784934622a_h.jpg"),
        // new ConditionCodes(22, "smoky", "https://c8.staticflickr.com/8/7515/16017765079_3b86870bb1_h.jpg"),
        // new ConditionCodes(23, "blustery", "https://c5.staticflickr.com/1/281/19125630844_9fe0d2e8c0_k.jpg"),
        // new ConditionCodes(24, "windy", "https://c7.staticflickr.com/4/3783/13784175454_7d7da313b8_b.jpg"),
        // new ConditionCodes(25, "cold", "https://c4.staticflickr.com/9/8512/8388027451_0c39f98cf5_h.jpg"),
        // new ConditionCodes(26, "cloudy", "https://c6.staticflickr.com/9/8071/8313688965_2f6911c91a_h.jpg"),
        // new ConditionCodes(27, "mostly cloudy (night)", "https://c8.staticflickr.com/6/5524/11976480255_062401d982_k.jpg"),
        // new ConditionCodes(28, "mostly cloudy (day)", "https://c2.staticflickr.com/4/3921/14712879033_12cb6853d5_k.jpg"),
        // new ConditionCodes(29, "partly cloudy (night)", "https://c8.staticflickr.com/4/3932/15465344655_55eb647ac8_k.jpg"),
        // new ConditionCodes(30, "partly cloudy (day)", "https://c1.staticflickr.com/8/7033/13547755584_061adc5e8c_k.jpg"),
        // new ConditionCodes(31, "clear (night)", "https://c6.staticflickr.com/7/6146/6196311589_0e6fab4008_b.jpg"),
        // new ConditionCodes(32, "sunny", "https://c5.staticflickr.com/9/8660/16712341612_128754a03c_k.jpg"),
        // new ConditionCodes(33, "fair (night)", "https://c8.staticflickr.com/6/5574/14670543775_586801c179_k.jpg"),
        // new ConditionCodes(34, "fair (day)", "https://c2.staticflickr.com/6/5259/5424605601_6b3c784bf7_b.jpg"),
        // new ConditionCodes(35, "mixed rain and hail", "https://c4.staticflickr.com/9/8376/8547528299_ec4dedd31f_k.jpg"),
        // new ConditionCodes(36, "hot", "https://c7.staticflickr.com/2/1516/25955981454_0dcf79ba39_k.jpg"),
        // new ConditionCodes(37, "isolated thunderstorms", "https://c7.staticflickr.com/8/7278/7737634142_62f0a65e62_b.jpg"),
        // new ConditionCodes(38, "scattered thunderstorms", "https://c2.staticflickr.com/9/8081/8329434969_92f675400a_h.jpg"),
        // new ConditionCodes(39, "scattered thunderstorms", "https://c3.staticflickr.com/8/7087/7264589002_7b9f6cfd8e_k.jpg"),
        // new ConditionCodes(40, "scattered showers", "https://c2.staticflickr.com/4/3594/3423869209_533348180e_b.jpg"),
        // new ConditionCodes(41, "heavy snow", "https://c3.staticflickr.com/9/8494/8380678394_850b91867a_k.jpg"),
        // new ConditionCodes(42, "scattered snow showers", "https://c2.staticflickr.com/9/8660/16670306225_6a74411e11_b.jpg"),
        // new ConditionCodes(43, "heavy snow", "https://c6.staticflickr.com/8/7558/15980039269_3a070f3c4a_k.jpg"),
        // new ConditionCodes(44, "partly cloudy", "https://c6.staticflickr.com/4/3855/14448380621_8a6ae20d6c_k.jpg"),
        // new ConditionCodes(45, "thundershowers", "https://c3.staticflickr.com/4/3680/10913085314_8d26324cbf_k.jpg"),
        // new ConditionCodes(46, "snow showers", "https://c7.staticflickr.com/8/7376/11429539246_7863007a80_b.jpg"),
        // new ConditionCodes(47, "isolated thundershowers", "https://c8.staticflickr.com/3/2631/3730093327_5a72b8c00f_b.jpg"),
        // new ConditionCodes(3200, "not available", "https://c5.staticflickr.com/3/2851/9814955524_7fe986ebd5_k.jpg")


    }
}
//End InfoWeather
