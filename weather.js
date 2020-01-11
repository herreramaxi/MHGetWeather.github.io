//InfoWeather
function InfoWeather(latitude, longitude) {
    this.url = "https://query.yahooapis.com/v1/public/yql";
    //this.query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"" + city + ", " + country + "\") and u= \"C\"";
    this.query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"{TEXT}\") and u= \"C\"";
    this.city = "";
    this.country = "";
    this.cityCountry = "";
    this.date = "";
    this.temperature = "";
    this.condition = "";
    this.urlimg = "";
    this.conditionCode = "";
    this.urlWeatherImage = "";
    this.low = "";
    this.high = "";
    this.latitude = latitude;
    this.longitude = longitude;

    var buildQuery = function (infoWeather) {
        var text = "";

        if (infoWeather.latitude !== "" && infoWeather.longitude !== "") {
            text = "(" + infoWeather.latitude + "," + infoWeather.longitude + ")";
        }
        else {
            text = infoWeather.city + "," + infoWeather.country;
        }

        infoWeather.query = infoWeather.query.replace("{TEXT}", text);
    }

    buildQuery(this);

	var getWeather = function (infoWeather) {
		//Testing oauth on yahoo API
			
	var url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
	var method = 'GET';
	var app_id = 'anJvMP76';
	var consumer_key = 'dj0yJmk9ZkpyeTg4aDJ0N2RNJmQ9WVdrOVlXNUtkazFRTnpZbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTNh';
	var consumer_secret = 'b418ae1c47ae6fcc8840bab13f0e566cf568b5ed';
	var concat = '&';
	var query = {'location': 'sunnyvale,ca', 'format': 'json'};
	var oauth = {
		'oauth_consumer_key': consumer_key,
		'oauth_nonce': Math.random().toString(36).substring(2),
		'oauth_signature_method': 'HMAC-SHA1',
		'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
		'oauth_version': '1.0'
	};

			var merged = {}; 

			$.extend(merged, query, oauth);
			// Note the sorting here is required
			var merged_arr = Object.keys(merged).sort().map(function(k) {
			  return [k + '=' + encodeURIComponent(merged[k])];
			});
			var signature_base_str = method
			  + concat + encodeURIComponent(url)
			  + concat + encodeURIComponent(merged_arr.join(concat));

			var composite_key = encodeURIComponent(consumer_secret) + concat;
			var hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
			var signature = hash.toString(CryptoJS.enc.Base64);

			oauth['oauth_signature'] = signature;
			var auth_header = 'OAuth ' + Object.keys(oauth).map(function(k) {
			  return [k + '="' + oauth[k] + '"'];
			}).join(',');

			$.ajax({
			  url: url + '?' + $.param(query),
			  headers: {
				'Authorization': auth_header,
				'X-Yahoo-App-Id': app_id 
			  },
			  method: 'GET',
			  success: function(data){
				console.log(data);
			  }
			}); 
}
	
    var getWeather2 = function (infoWeather) {
        return $.ajax({
            url: infoWeather.url,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                q: infoWeather.query,
                format: "json"
            }
        })
        .then(function (response) {
            infoWeather.city = response.query.results.channel.location.city;
            infoWeather.country = response.query.results.channel.location.country;
            infoWeather.cityCountry = infoWeather.city + ", " + infoWeather.country;
            infoWeather.date = response.query.results.channel.item.condition.date;
            infoWeather.temperature = new Temperature(response.query.results.channel.item.condition.temp);
            infoWeather.condition = response.query.results.channel.item.condition.text;
            infoWeather.conditionCode = response.query.results.channel.item.condition.code;
            infoWeather.urlWeatherImage = weatherImages[infoWeather.conditionCode].urlImg;
            infoWeather.urlimg = getUrlImg(response);
            infoWeather.low = new Temperature(response.query.results.channel.item.forecast[0].low);
            infoWeather.high = new Temperature(response.query.results.channel.item.forecast[0].high);

            return infoWeather;
        });
    }

    this.getWeather = function () { return getWeather(this); }

    var getUrlImg = function (response) {
        var token = "<![CDATA[<img src=\"";
        var index = response.query.results.channel.item.description.indexOf(token) + token.length;
        var lastIndex = response.query.results.channel.item.description.indexOf("\"/>");

        return response.query.results.channel.item.description.substring(index, lastIndex);
    }

    function Temperature(celsiusTemperature) {
        this.celsius = celsiusTemperature;
        this.fahrenheit = Math.floor(celsiusTemperature * 9 / 5 + 32);
    };

    function ConditionCodes(code, description, urlImg) {
        this.code = code;
        this.description = description;
        this.urlImg = urlImg;
    }

    var weatherImages = [
        new ConditionCodes(0, "tornado", "https://c3.staticflickr.com/8/7596/16199403314_1cf0cd0d0f_c.jpg"),
        new ConditionCodes(1, "tropical storm", "https://c7.staticflickr.com/9/8388/8505828222_6790d72300_c.jpg"),
        new ConditionCodes(2, "hurricane", "https://c7.staticflickr.com/5/4077/4786315382_6eef785848_z.jpg"),
        new ConditionCodes(3, "severe thunderstorms", "https://c5.staticflickr.com/9/8631/15847204276_971bd78b61_c.jpg"),
        new ConditionCodes(4, "thunderstorms", "https://c3.staticflickr.com/6/5066/5632698322_1422aba72c_b.jpg"),
        new ConditionCodes(5, "mixed rain and snow", "https://c8.staticflickr.com/9/8646/16149284703_52a5c2cb09_c.jpg"),
        new ConditionCodes(6, "mixed rain and sleet", "https://c8.staticflickr.com/9/8569/16006784783_028f95ab84_k.jpg"),
        new ConditionCodes(7, "mixed snow and sleet", "https://c2.staticflickr.com/9/8391/8465062041_a8db67167b_c.jpg"),
        new ConditionCodes(8, "freezing drizzle", "https://c6.staticflickr.com/3/2836/11890455445_028b5c4018_k.jpg"),
        new ConditionCodes(9, "drizzle", "https://c6.staticflickr.com/6/5605/15667807021_a2b3221695_k.jpg"),
        new ConditionCodes(10, "freezing rain", "https://c3.staticflickr.com/6/5336/9430940674_3e4b62e370_b.jpg"),
        new ConditionCodes(11, "showers", "https://c7.staticflickr.com/4/3854/14711359358_d3bbe3de50_k.jpg"),
        new ConditionCodes(12, "showers", "https://c3.staticflickr.com/4/3939/15426987970_49f14ece1e_h.jpg"),
        new ConditionCodes(13, "snow flurries", "https://c2.staticflickr.com/7/6034/6343974385_8ca126edde_b.jpg"),
        new ConditionCodes(14, "light snow showers", "https://c7.staticflickr.com/6/5209/5291930798_fa6cfddb7a_b.jpg"),
        new ConditionCodes(15, "blowing snow", "https://c2.staticflickr.com/8/7490/15640621153_5429ed73dd_k.jpg"),
        new ConditionCodes(16, "snow", "https://c6.staticflickr.com/2/1541/24475886789_44e3b0dbb3_k.jpg"),
        new ConditionCodes(17, "hail", "https://c8.staticflickr.com/8/7716/17113538359_141db72c8c_k.jpg"),
        new ConditionCodes(18, "sleet", "https://c7.staticflickr.com/3/2922/14421902862_b57e82177a_k.jpg"),
        new ConditionCodes(19, "dust", "https://c7.staticflickr.com/6/5225/5737226174_c3c0d66cb0_b.jpg"),
        new ConditionCodes(20, "foggy", "https://c8.staticflickr.com/4/3849/14417294855_92a30e4dd2_k.jpg"),
        new ConditionCodes(21, "haze", "https://c5.staticflickr.com/9/8611/16454695092_784934622a_h.jpg"),
        new ConditionCodes(22, "smoky", "https://c8.staticflickr.com/8/7515/16017765079_3b86870bb1_h.jpg"),
        new ConditionCodes(23, "blustery", "https://c5.staticflickr.com/1/281/19125630844_9fe0d2e8c0_k.jpg"),
        new ConditionCodes(24, "windy", "https://c7.staticflickr.com/4/3783/13784175454_7d7da313b8_b.jpg"),
        new ConditionCodes(25, "cold", "https://c4.staticflickr.com/9/8512/8388027451_0c39f98cf5_h.jpg"),
        new ConditionCodes(26, "cloudy", "https://c6.staticflickr.com/9/8071/8313688965_2f6911c91a_h.jpg"),
        new ConditionCodes(27, "mostly cloudy (night)", "https://c8.staticflickr.com/6/5524/11976480255_062401d982_k.jpg"),
        new ConditionCodes(28, "mostly cloudy (day)", "https://c2.staticflickr.com/4/3921/14712879033_12cb6853d5_k.jpg"),
        new ConditionCodes(29, "partly cloudy (night)", "https://c8.staticflickr.com/4/3932/15465344655_55eb647ac8_k.jpg"),
        new ConditionCodes(30, "partly cloudy (day)", "https://c1.staticflickr.com/8/7033/13547755584_061adc5e8c_k.jpg"),
        new ConditionCodes(31, "clear (night)", "https://c6.staticflickr.com/7/6146/6196311589_0e6fab4008_b.jpg"),
        new ConditionCodes(32, "sunny", "https://c5.staticflickr.com/9/8660/16712341612_128754a03c_k.jpg"),
        new ConditionCodes(33, "fair (night)", "https://c8.staticflickr.com/6/5574/14670543775_586801c179_k.jpg"),
        new ConditionCodes(34, "fair (day)", "https://c2.staticflickr.com/6/5259/5424605601_6b3c784bf7_b.jpg"),
        new ConditionCodes(35, "mixed rain and hail", "https://c4.staticflickr.com/9/8376/8547528299_ec4dedd31f_k.jpg"),
        new ConditionCodes(36, "hot", "https://c7.staticflickr.com/2/1516/25955981454_0dcf79ba39_k.jpg"),
        new ConditionCodes(37, "isolated thunderstorms", "https://c7.staticflickr.com/8/7278/7737634142_62f0a65e62_b.jpg"),
        new ConditionCodes(38, "scattered thunderstorms", "https://c2.staticflickr.com/9/8081/8329434969_92f675400a_h.jpg"),
        new ConditionCodes(39, "scattered thunderstorms", "https://c3.staticflickr.com/8/7087/7264589002_7b9f6cfd8e_k.jpg"),
        new ConditionCodes(40, "scattered showers", "https://c2.staticflickr.com/4/3594/3423869209_533348180e_b.jpg"),
        new ConditionCodes(41, "heavy snow", "https://c3.staticflickr.com/9/8494/8380678394_850b91867a_k.jpg"),
        new ConditionCodes(42, "scattered snow showers", "https://c2.staticflickr.com/9/8660/16670306225_6a74411e11_b.jpg"),
        new ConditionCodes(43, "heavy snow", "https://c6.staticflickr.com/8/7558/15980039269_3a070f3c4a_k.jpg"),
        new ConditionCodes(44, "partly cloudy", "https://c6.staticflickr.com/4/3855/14448380621_8a6ae20d6c_k.jpg"),
        new ConditionCodes(45, "thundershowers", "https://c3.staticflickr.com/4/3680/10913085314_8d26324cbf_k.jpg"),
        new ConditionCodes(46, "snow showers", "https://c7.staticflickr.com/8/7376/11429539246_7863007a80_b.jpg"),
        new ConditionCodes(47, "isolated thundershowers", "https://c8.staticflickr.com/3/2631/3730093327_5a72b8c00f_b.jpg"),
        new ConditionCodes(3200, "not available", "https://c5.staticflickr.com/3/2851/9814955524_7fe986ebd5_k.jpg")
    ]

}
//End InfoWeather
