function insertImg(imgUrl, element) {
    var src = document.getElementById(element);
    var img = document.createElement("img");
    img.src = imgUrl;
    src.appendChild(img);
}


//These tapOrClick funtions prevent a tap from triggering an event twice
//They also help eliminate the 300ms delay between a tap being registered as a click 

// Load the image of the day
function tapOrClickImage(event) {
    imageOfTheDay();
    myButtonImage.className = "active";
    myButtonPeople.className = "";
    myButtonISS.className = "";
    subHeader.className = "daily-image-sub-header";
    event.preventDefault();
    return false;
}

// Load people in space
function tapOrClickPeople(event) {
    peopleInSpace();
    myButtonPeople.className = "active";
    myButtonImage.className = "";
    myButtonISS.className = "";
    subHeader.className = "people-sub-header";
    event.preventDefault();
    return false;
}

// Load ISS location
function tapOrClickISS(event) {
    iss();
    myButtonISS.className = "active";
    myButtonImage.className = "";
    myButtonPeople.className = "";
    subHeader.className = "space-station-sub-header";
    event.preventDefault();
    return false;
}

/* Load NASA Astronomy Image of the Day */

function imageOfTheDay() {
    document.getElementById("sub-header").innerHTML = "NASA Image of the Day";
    // Clear any previous content
    document.getElementById("primary-content").innerHTML = "";
    document.getElementById("secondary-content").innerHTML = "";
    var myJSON = new XMLHttpRequest();
    var address = "https://api.nasa.gov/planetary/apod?api_key=QbBQagRXZ6lfosDU5fiS5itVP7JzHENQ0EvnxC6y";
    myJSON.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var data = JSON.parse(this.responseText);
            var imageUrl = data.url;
            insertImg(imageUrl, "primary-content");
            var title = data.title;
            var date = data.date;
            var explanation = data.explanation;
            var copyright = data.copyright;
            var text = "<h3>" + title + "</h3><br><p>" + explanation + "</p><br><p>" + copyright + "</p>";
            document.getElementById("secondary-content").innerHTML = text;
        }
    };
    myJSON.open("GET", address, true);
    myJSON.send();
}

function peopleInSpace() {
    document.getElementById("sub-header").innerHTML = "People in Space";

    // Clear any previous content
    document.getElementById("primary-content").innerHTML = "";
    document.getElementById("secondary-content").innerHTML = "";

    // carousel
    var myJSON = new XMLHttpRequest();
    var address = "http://api.open-notify.org/astros.json";

    myJSON.onreadystatechange = function () {
        var text = '<section class="carousel-container"><div id="carousel">';
        if (this.readyState === 4 && this.status === 200) {
            var data = JSON.parse(this.responseText);
            var numPeople = data.number;

            for (var i = 0; i < numPeople; i++) {
                text = text + '<figure>' + data.people[i].name + "</figure>";
            }
            text = text + '</div></section><br>';


            // add embed code for ISS live feed
            text = text + '  <div class="video-container"><iframe src="https://www.youtube.com/embed/RtU_mdL2vBM?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe></div>';
            document.getElementById("primary-content").innerHTML = text;
        }
    }
    myJSON.open("GET", address, true);
    myJSON.send();
}



/* check for language for use in Google map */
if (document.querySelector("html").lang)
    lang = document.querySelector("html").lang;
else
    lang = "en";
/* load Google map api */
var newScript = document.createElement("script");
newScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDUUci-mhVirncUmRJ_LXXlTvDiJnjzjqI&language=" + lang;
document.head.appendChild(newScript);

/* Function to get International Space Station current location */

    function getISSLocation() {
        var myJSON = new XMLHttpRequest();
        var address = "http://api.open-notify.org/iss-now.json";
        var map;
        myJSON.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var data = JSON.parse(this.responseText);
                var latitude = parseFloat(data.iss_position.latitude);
                var longitude = parseFloat(data.iss_position.longitude);

                function initMap() {
                    map = new google.maps.Map(document.getElementById('map'), {
                        center: {
                            lat: latitude,
                            lng: longitude
                        },
                        zoom: 4,
                        mapTypeId: 'hybrid'
                    });
                    var marker = new google.maps.Marker({
                        position: {
                            lat: latitude,
                            lng: longitude
                        },
                        icon: {
                            url: "images/iss-tiny.png"
                        },
                        map: map
                    });
                }

                initMap();
            }
        }
        myJSON.open("GET", address, true);
        myJSON.send();
    }


function iss() {

    document.getElementById("sub-header").innerHTML = "Current ISS Location";
    // Erase previous content and create map div
    document.getElementById("primary-content").innerHTML = "";
    document.getElementById("secondary-content").innerHTML = "";
    var text = '<div id="clock"></div><div id="update" onclick="getISSLocation()">Update Map</div><div id="map"></div>';
    document.getElementById("primary-content").innerHTML = text;

    // Update clock every second
    var myVar = setInterval(myClock, 1000);

    function myClock() {
        var d = new Date();
        document.getElementById("clock").innerHTML = d.toLocaleTimeString();
    }
    
    getISSLocation();
    /* Get International Space Station current location */
      

}

/* Add event listeners */

var myButtonImage = document.getElementById("daily-image");
var myButtonPeople = document.getElementById("people");
var myButtonISS = document.getElementById("space-station");
var subHeader = document.getElementById("sub-header")

myButtonImage.addEventListener("click", tapOrClickImage, false);
myButtonImage.addEventListener("touchend", tapOrClickImage, false);
myButtonImage.addEventListener("DOMContentLoaded", imageOfTheDay(), false);
myButtonPeople.addEventListener("click", tapOrClickPeople, false);
myButtonPeople.addEventListener("touchend", tapOrClickPeople, false);
myButtonISS.addEventListener("click", tapOrClickISS, false);
myButtonISS.addEventListener("touchend", tapOrClickISS, false);


