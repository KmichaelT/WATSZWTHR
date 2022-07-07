const cityForm = document.querySelector("form");
const card = document.querySelector(".card");
const details = document.querySelector(".details");
const time = document.querySelector("img.time");
const icon = document.querySelector(".icon img");
const key='zPZJNtIhAeV3HtHZzhJAkplqxJPwxP0Z';


// gets city info
const getCity= async(city)=>{
    const base='https://dataservice.accuweather.com/locations/v1/cities/search';
    const query=`?apikey=${key}&q=${city}`;
    const response = await fetch(base+query);
    const data = await response.json();
    return data[0];
};
// gets current weather condition
const getWeather=async(id)=>{
    const base='https://dataservice.accuweather.com/currentconditions/v1/';
    const query=`${id}?apikey=${key}`;
    const response = await fetch(base+query);
    const data = await response.json();
    return data[0];
};

const updateUi = (data) => {
  const cityData = data.cityData;
  const weather = data.weather;
  details.innerHTML = `
        <h5 class="my-3">${cityData.EnglishName}</h5>
        <div class="my-3">${weather.WeatherText}</div>
        <div class="display-1 my-4">
            <span>${weather.Temperature.Metric.Value}</span>
            <span>&deg;C</span>
        </div>
        `;
  //update icons
  console.log(data);
  const iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
  icon.setAttribute("src", iconSrc);
  //update day and night
  let timeSrc = null;
  if (weather.IsDayTime) {
    timeSrc = "img/day.svg";
  } else {
    timeSrc = "img/night.svg";
  }
  time.setAttribute("src", timeSrc);

  if (card.classList.contains("d-none")) {
    card.classList.remove("d-none");
    time.classList.remove("p-5");
  }
};
const updateCity = async (city) => {
  const cityData = await getCity(city);

  const weather = await getWeather(cityData.Key);
  return {
    cityData: cityData,
    weather: weather,
  };
};

cityForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // grab city input from form
  const city = cityForm.city.value.trim();
  cityForm.reset();

  //update ui with new city
  updateCity(city)
    .then((data) => updateUi(data))
    .catch((err) => {
        Swal.fire({
            width: 380,
            padding: '3em',
            icon: 'error',
            title: 'Oops...',
            text: 'Double check your input!',
            showConfirmButton: false
          })
    });
});
