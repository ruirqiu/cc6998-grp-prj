let map, infoWindow;
function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 41.85, lng: -87.65 },
    });

    infoWindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        }, () => {
            // Browser supports geolocation, but user has denied permission
            handleLocationError(true, infoWindow);
        });
    } else {
        // Browser doesn't support geolocation
        handleLocationError(false, infoWindow);
    }

    directionsRenderer.setMap(map);
    document.getElementById("button_submit").addEventListener("click", () => {
        // calculateAndDisplayRoute(directionsService, directionsRenderer);
        url = 'https://w3qv272dkh.execute-api.us-east-1.amazonaws.com/underdevelopment/planRoute'
        //test data
        data = {
            "params": {
                "querystring": {
                    "user_id": "claire_luo",
                    "route_option": "SHORT",
                    "lat": 40.777523,
                    "lon": -73.987952
                }
            }
        }
        // idToken = result.getIdToken().getJwtToken();
        // getCognitoIdentityCredentials();

        // let config = {
        //     headers:{
        //         "Content-Type": 'application/json',
        //         "Authorization": idToken
        //     }
        // };
        // axios.post(url,data,config).then(response=>{
        //     console.log(response.data)
        //     alert("Post successful!!");
        // })
        calculateAndDisplayRoute(directionsService, directionsRenderer);
        drawBackToHomeRoute(directionsService, directionsRenderer);
    });
}

//mock response data
let resp = {
    "statusCode": 200,
    "body": {
        "total_price_dollar": "$25.450000000000003",
        "total_duration_min": "169 min",
        "total_distance_mile": "30 km",
        "geo_list": [
            [
                40.777523,
                -73.987952
            ],
            [
                40.758052,
                -73.985552
            ],
            [
                40.729552,
                -73.996552
            ]
        ]
    }
}

let routedata = resp['body']['geo_list']
var pointdata = new Array(routedata.length)
//console.log(routedata)
for (let i = 0; i < routedata.length; i++) {
    pointdata[i] = {lat: routedata[i][0], lng: routedata[i][1]}
};
console.log(pointdata)

// Handle a geolocation error
function handleLocationError(browserHasGeolocation, infoWindow) {
    // Set default location to campus
    pos = {lat: 40.8106604, lng: -73.9573358};
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 13
    });
//    directionsRenderer.setMap(map);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const waypts = [];
    //const selectedMode = document.getElementById("mode").value
    selectedMode ="DRIVING";
    for (let i = 0; i < pointdata.length; i++) {
            waypts.push({
                location: pointdata[i],
                stopover: true,
            });
            //console.log(pointdata[i]);
    };

    directionsService
        .route({
            origin: pointdata[0],
            destination: pointdata[pointdata.length-1],
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode[selectedMode],
        })
        .then((response) => {
            directionsRenderer.setDirections(response);

            const route = response.routes[0];
            const summaryPanel = document.getElementById("directions-panel");

            summaryPanel.innerHTML = "";

            // For each route, display summary information.
            for (let i = 0; i < route.legs.length; i++) {
                const routeSegment = i + 1;

                summaryPanel.innerHTML +=
                    "<b>Route Segment: " + routeSegment + "</b><br>";
                summaryPanel.innerHTML += route.legs[i].start_address + " to ";
                summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
                summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
            }
        })
        .catch((e) => window.alert("Directions request failed due to " + status));
}


function drawBackToHomeRoute(directionsService, directionsRenderer) {
    //const selectedMode = document.getElementById("mode").value
    selectedMode ="DRIVING"

    directionsService
        .route({
            origin: pointdata[pointdata.length-1],
            destination: pointdata[0],
            travelMode: google.maps.TravelMode[selectedMode],
        })
        .then((response) => {
            directionsRenderer.setDirections(response);
         })
        .catch((e) => window.alert("Directions request failed due to " + status));
}