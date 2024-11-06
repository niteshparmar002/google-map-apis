/**
//  * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// @ts-nocheck TODO remove when fixed
function initMap() {
    const bounds = new google.maps.LatLngBounds();
    const markersArray = [];
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 55.53, lng: 9.4 },
        zoom: 10,
    });
    // initialize services
    const geocoder = new google.maps.Geocoder();
    const service = new google.maps.DistanceMatrixService();
    // build request
    const origin1 = { lat: 26.851518973778294, lng: 75.80644016968898 };
    // const origin2 = "D-21, Mahalaxmi Nagar Rd, D-Block, Malviya Nagar, Jaipur, Rajasthan 302017";
    // const destinationA = "302006, Railway, Station Rd, Gopalbari, Jaipur, Rajasthan 302006";
    const destinationB = { lat: 26.919711838341374, lng: 75.78798225434846 };
    const request = {
        origins: [origin1],
        destinations: [destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
    };

    // put request on page
    document.getElementById("request").innerText = JSON.stringify(
        request,
        null,
        2
    );
    // get distance matrix response
    service.getDistanceMatrix(request).then((response) => {
        // put response
        document.getElementById("response").innerText = JSON.stringify(
            response,
            null,
            2
        );

        // show on map
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;

        deleteMarkers(markersArray);

        const showGeocodedAddressOnMap = (asDestination) => {
            const handler = ({ results }) => {
                map.fitBounds(bounds.extend(results[0].geometry.location));
                markersArray.push(
                    new google.maps.Marker({
                        map,
                        position: results[0].geometry.location,
                        label: asDestination ? "D" : "O",
                    })
                );
            };
            return handler;
        };

        for (let i = 0; i < originList.length; i++) {
            const results = response.rows[i].elements;

            geocoder
                .geocode({ address: originList[i] })
                .then(showGeocodedAddressOnMap(false));

            for (let j = 0; j < results.length; j++) {
                geocoder
                .geocode({ address: destinationList[j] })
                .then(showGeocodedAddressOnMap(true));
            }
        }
    });
}

function deleteMarkers(markersArray) {
    for (let i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }

    markersArray = [];
}

window.initMap = initMap;
