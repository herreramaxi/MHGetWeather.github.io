//TODO: Change to requirejs
$.getScript("weather.js");

//Document Ready
var infoWeather;
$(document).ready(function () {
    $('#btnRefresh').on("click", function () {
        getWeather();
    });

     getWeather();

    $('#fahrenheitUnit').on("click", fahrenheitOnClick);
    $('#celsiusUnit').on("click", celsiusOnClick);
});
//End Document Ready

//GetWeather functions

function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getInfoWeather, geolocationErrorHandler);
    } else {
        printErrorMessage("Geolocation is not supported by this browser.");
    }
}

function getInfoWeather(position) {
    infoWeather = new InfoWeather(position.coords.latitude, position.coords.longitude);
    infoWeather.getWeather()
        .done(x=> assignValues(x))
        .fail(function (jqxhr, textStatus, error) {
            printErrorMessage("Error getting weather information");
        });
}

function geolocationErrorHandler(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            printErrorMessage("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            printErrorMessage("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            printErrorMessage("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            printErrorMessage("An unknown error occurred.");
            break;
    }
}

//GetWeather functions end

//General Functions

function assignValues(infoWeather) {
    $('.to-hidde').removeAttr("hidden");
    $("#errorMessage").text("");
    $('#cityCountry').html(infoWeather.cityCountry);
    $('#date').html(infoWeather.date);

    assignTemperature(infoWeather);

    $('#condition').html(infoWeather.condition);
    $('#weatherImg').attr("src", infoWeather.urlimg);
    $('body').css("background-image", 'url(' + infoWeather.urlWeatherImage + ')');
}

function assignTemperature(infoWeather) {
    if ($('#temperature').hasClass('celsius')) {
        $('#temperature').html(infoWeather.temperature.celsius);
        $('#lowTemperature').html(infoWeather.low.celsius + '°');
        $('#highTemperature').html(infoWeather.high.celsius + '°');
    }
    else {
        $('#temperature').html(infoWeather.temperature.fahrenheit);
        $('#lowTemperature').html(infoWeather.low.fahrenheit + '°');
        $('#highTemperature').html(infoWeather.high.fahrenheit + '°');
    }
}

function celsiusOnClick() {
    $(this).addClass("active").removeAttr("href");
    $('#fahrenheitUnit').removeClass("active").attr("href", "#");
    $('#temperature').addClass("celsius");

    assignTemperature(infoWeather);
}

function fahrenheitOnClick() {
    $(this).addClass("active").removeAttr("href");
    $('#celsiusUnit').removeClass("active").attr("href", "#");
    $('#temperature').removeClass("celsius");

    assignTemperature(infoWeather);
}

function printErrorMessage(error) {
    $('.to-hidde').attr("hidden", "true");
    $("#errorMessage").text(error);
}
//End General Functions