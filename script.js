const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".input");

searchBtn.addEventListener("click", async function() {
    const location = searchInput.value;
    if (location !== "") {
        const data = await fetchWeather(location);

        if (data != null) {
            updateDOM(data);
            searchInput.value = ""; // Clear the input after fetching data
        }
    }
});

const temperatureElem = document.querySelector(".temperature");
const locationElem = document.querySelector(".city");
const emojiImg = document.querySelector(".emoji");
const timeElem = document.querySelector(".time");
const dayElem = document.querySelector(".Day");
const dateElem = document.querySelector(".Date");
const conditionElem = document.querySelector(".condition");

function updateDOM(data) {
    /***********************filter required data*********************/
    console.log("i will update the dom", data);
    const temp = data.current.temp_c;
    const location = data.location.name;
    const timeData = data.location.localtime;
    const [date, time] = timeData.split(" ");
    const iconLink = data.current.condition.icon;
    const condition = data.current.condition.text;
    /*********************update the dom*************************/
    temperatureElem.textContent = temp + "°C";
    locationElem.textContent = location;
    emojiImg.src = iconLink;
    dateElem.innerText = date;
    timeElem.innerText = time;
    conditionElem.innerText = condition;

    changeBackground(condition);
}

async function fetchWeather(location) {
    const url = `http://api.weatherapi.com/v1/current.json?key=6fc74cf82bc44773a8a171855241407&q=${location}&aqi=no`;
    const response = await fetch(url);
    if (response.status == 400) {
        alert("Location is invalid");
        return null;
    } else if (response.status == 200) {
        const json = await response.json();
        console.log(json);
        return json;
    }
}



//Clock function

function showTime()
{
    let date = new Date();
    let hrs = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    let session = "AM";


    if(hrs>12)
    {
        hrs =  hrs - 12;
    }

    if(hrs>=12)
    {
        session = "PM"
    }

    hrs= hrs<10 ? "0"+hrs : hrs;
    min= min<10 ? "0"+min : min;
    sec= sec<10 ? "0"+sec : sec;

    let clockTime = hrs + " : "+ min + " : " + sec + " " + session;
    document.getElementsByTagName('h1')[0].innerHTML = clockTime;
    setTimeout(showTime,1000)
}


    