let city;
let api = "4dbb917c4a994f2b4cadb5fb7972bcb4",
  temperature = document.querySelector(".temperature"),
  input = document.getElementById("input"),
  humidity = document.querySelector(".humidity"),
  wind = document.querySelector(".wind"),
  clearsky = document.querySelector(".clearsky"),
  clouds = document.querySelector(".cloud"),
  img = document.getElementById("img"),
  span = document.querySelector(".span"),
  content = document.querySelector(".content"),
  localTemperature = document.querySelector(".temp"),
  myCity = document.querySelector(".yourcity"),
  myCityName = document.querySelector(".localcity"),
  localClearSky = document.querySelector(".localclouds"),
  localPicture = document.getElementById("localpicture"),
  сurrencyRate = document.getElementsByClassName("сurrency"),
  removeBlock = document.getElementById("remove"),
  button = document.getElementById("button");
wrongCity = "You entered the wrong city name, please enter the correct";

async function submit() {
  city = input.value || "London";
  try {
    let urlWeatherApp = new URL(
      "https://api.openweathermap.org/data/2.5/weather"
    );
    urlWeatherApp.searchParams.set("q", city);
    urlWeatherApp.searchParams.set("appid", api);
    urlWeatherApp.searchParams.set("units", "metric");
    let response = await fetch(urlWeatherApp);
    if (response.ok) {
      let weatherinfo = await response.json();
      let cityName = weatherinfo.name;
      span.innerHTML = cityName;
      let temp1 = parseInt(weatherinfo.main.temp) + "C&#176";
      let hum = weatherinfo.main.humidity;
      let win = weatherinfo.wind.speed;
      let sky = weatherinfo.weather[0].description;
      let cloud = weatherinfo.weather[0].icon;
      city.innerHTML = input.value;
      humidity.innerHTML = "humidity: " + hum + "g/m3";
      temperature.innerHTML = temp1;
      wind.innerHTML = "wind: " + win + "m/s";
      clearsky.innerHTML = sky;
      img.src = `https://openweathermap.org/img/wn/${cloud}@2x.png`;
      removeBlock.removeAttribute("style");
    } else if (response.status === 404) {
      input.classList.add("wrongcity");
      input.placeholder = wrongCity;
      input.value = "";
    } else {
      if (response.status >= 300 && response.status < 600) {
        throw new Error("Something went wrong");
      }
    }
  } catch (error) {
    if (error.message == "Failed to fetch") {
      console.log("Something went wrong");
    } else {
      console.log(error.message);
    }
  }
}

function remove(event) {
  let target = event.target;
  if (target.tagName != "BUTTON") return;
  span.textContent = "";
  img.src = "";
  temperature.textContent = "";
  wind.textContent = "";
  clearsky.textContent = "";
  humidity.textContent = "";
  removeBlock.setAttribute("style", "position: fixed; top:309px; left:1251px");
}

function removeBackgroundInputAfterTypeInInput() {
  input.classList.remove("wrongcity");
}

function removeBackgroundInputAfterClickInInput() {
  input.classList.remove("wrongcity");
  input.placeholder = "Enter the city...";
}

submit();

document.addEventListener("keyup", function (event) {
  if (event.key == "Enter" && input.value != "") {
    submit();
  }
});

content.addEventListener("click", remove);
input.addEventListener("input", removeBackgroundInputAfterTypeInInput);
input.addEventListener("click", removeBackgroundInputAfterClickInInput);
button.addEventListener("click", submit);

navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  async function getLocalWeatherInfo() {
    let urlWeatherLocal = new URL(
      "https://api.openweathermap.org/data/2.5/weather"
    );
    urlWeatherLocal.searchParams.set("lat", latitude);
    urlWeatherLocal.searchParams.set("lon", longitude);
    urlWeatherLocal.searchParams.set("appid", api);
    urlWeatherLocal.searchParams.set("units", "metric");
    let response = await fetch(urlWeatherLocal);
    let localWeatherInfo = await response.json();
    let tempMyCity = parseInt(localWeatherInfo.main.temp) + "C&#176";
    localTemperature.innerHTML = tempMyCity;
    if (localWeatherInfo.name == "Nizhnedneprovsk") {
      myCity.innerHTML = "Dnipropetrovsk";
      myCityName.innerHTML = "Dnipropetrovsk";
    } else {
      myCity.innerHTML = localWeatherInfo.name;
      myCityName.innerHTML = localWeatherInfo.name;
    }
    localClearSky.innerHTML = localWeatherInfo.weather[0].description;
    let iconCode = localWeatherInfo.weather[0].icon;
    localPicture.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  getLocalWeatherInfo();
});

async function currencyrate() {
  try {
    let array = ["usd", "eur", "cny"];
    let myHeaders = new Headers();
    myHeaders.append("apikey", "y4y5Y46VD2Y0bgQnjr4AaQZ5AiOOoWs1");

    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    for (let i = 0; i < 3; i++) {
      let urlExchangerate = new URL(
        "https://api.apilayer.com/exchangerates_data/convert"
      );
      urlExchangerate.searchParams.set("to", array[i]);
      urlExchangerate.searchParams.set("from", array[i]);
      urlExchangerate.searchParams.set("amount", array[i]);
      let response = await fetch(urlExchangerate, requestOptions);
      if (response.ok) {
        let result = await response.json();
        сurrencyRate[i].textContent = result.result + " грн.";
      } else if (response.status == 429) {
        throw new Error("Service exchange rate is not more available");
      } else {
        throw new Error("Something went wrong");
      }
    }
  } catch (error) {
    alert(error.message);
  }
}

currencyrate();
