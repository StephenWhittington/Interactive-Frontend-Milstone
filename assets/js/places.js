// initAutocomplete function that is called from a source link in the HTML that runs the map
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 46.619261, lng: -33.134766 },
    zoom: 3,
    mapTypeId: 'roadmap',
    streetViewControl: false,
    mapTypeControl: false,
    styles: [{
        "elementType": "geometry.fill",
        "stylers": [{
          "weight": 2
        }]
      },
      {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [{
          "color": "#000000"
        }]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.government",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.medical",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.school",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      }
    ]
  });

  // Variables that are called in the code below

  var markers = [];

  var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';

  var hostnameRegexp = new RegExp('^https?://.+?/');

  var places, infoWindow;

  var autocomplete;


  var clearResult = {
    center: { lat: 46.619261, lng: -33.134766 },
    zoom: 3
  };

  // Button that resets the users input in the map to start again

  document.getElementById("resetSearch").onclick = function() {
    clearResults();
    clearMarkers();
    $('#category')[0].selectedIndex = 0;
    $("#searchMapInput").val("");
    $('#searchResult').html("");
    $('#listing').hide();
    $('#hr').hide();
    $('#place-info').hide();
    $('#place-photo-spot').hide();
    $('#place-photo-spot2').hide();
    $('#place-photo-spot3').hide();
    $('#place-photo-spot4').hide();
    $('#place-photo-spot5').hide();
    $('#place-photo-spot6').hide();
    $('#place-photo-spot7').hide();
    $('#hidePhotobox').hide();
    map.setZoom(clearResult.zoom);
    map.setCenter(clearResult.center);
    place = "";
  };

  // An onclick function that calls the go button and scrolls to the map

  document.getElementById('scrollToMap').onclick = function() {
    var scroll = document.getElementById("map-Scroll");
    scroll.scrollIntoView();
  };

  // An onclick function that calls the make another search button and scrolls back to search bar
  
  document.getElementById('scrollToMapSearch').onclick = function() {
    var scrollSearch = document.getElementById("backToSearch");
    scrollSearch.scrollIntoView();
    $("#searchMapInput").val("");
  };


  // Hides these ID's unless they have been called or selected 

  $('#place-photo-spot').hide();
  $('#place-photo-spot2').hide();
  $('#place-photo-spot3').hide();
  $('#place-photo-spot4').hide();
  $('#place-photo-spot5').hide();
  $('#place-photo-spot6').hide();
  $('#place-photo-spot7').hide();
  $('#listing').hide();
  $('#hr').hide();
  $('#hidePhotobox').hide();


  // A call to the autocomplete with only cities as a type to select


  autocomplete = new google.maps.places.Autocomplete(
    (
      document.getElementById('searchMapInput')), {
      types: ['(cities)']
    });
  places = new google.maps.places.PlacesService(map);

  // A Listener that listens from the call of place changed and onPlaceChanged function
  autocomplete.addListener('place_changed', onPlaceChanged);
  document.getElementById('category').addEventListener('change', onPlaceChanged);

  // Creates an infowidow that pops up when the user selects a marker

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });

  // This is a if/else statement that calls on the getPlace callback returning accommondation, bars/restaurants and tourist attractions only

  function onPlaceChanged() {
    var place = autocomplete.getPlace();

    if ($("#accommodation").is(':selected')) {
      if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(14);
        var search = {
          bounds: map.getBounds(),
          types: ['lodging']
        };
        searchNearby(search);
      }
      else {
        $('#searchMapInput').attr("placeholder", "Where to?");
      }
    }
    else if ($("#bars").is(':selected')) {
      if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(14);
        search = {
          bounds: map.getBounds(),
          types: ['bar', 'restaurant']
        };
        searchNearby(search);
      }
      else {
        $('#searchMapInput').attr("placeholder", "Where to?");
      }
    }
    else if ($("#tourist").is(':selected')) {
      if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(14);
        search = {
          bounds: map.getBounds(),
          types: ['museum', 'amusement_park', 'art_gallery', 'aquarium', 'zoo', 'movie_theater']
        };
        searchNearby(search);
      }
      else {
        $('#searchMapInput').attr("placeholder", "Where to?");
      }
    }
  }

  var bounds = new google.maps.LatLngBounds();


  // This is a function that does a nearby search of the location from the onPlaceChange function

  function searchNearby(search) {
    places.nearbySearch(search, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        clearResults();
        clearMarkers();
        $('#listing').show();
        $('#hr').show();

        // Create a marker for each hotel,bar/restaurant,tourist attraction found and
        // assign a letter of the alphabetic to each marker icon.
        for (var i = 0; i < results.length; i++) {
          var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
          var markerIcon = MARKER_PATH + markerLetter + '.png';
          markers[i] = new google.maps.Marker({
            position: results[i].geometry.location,
            animation: google.maps.Animation.DROP,
            icon: markerIcon
          });
          markers[i].placeResult = results[i];
          google.maps.event.addListener(markers[i], 'click', showInfoWindow);
          setTimeout(dropMarker(i), i * 100);
          addResult(results[i], i);
        }
        window.scrollTo(0, 1000);
      }
    });
  }

  // function that clears all markers from the map 

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i]) {
        markers[i].setMap(null);
      }
    }
    markers = [];
  }

  // function that drops the markers onto the map

  function dropMarker(i) {
    return function() {
      markers[i].setMap(map);
    };
  }

  // A function that returns the results to a created table

  function addResult(result, i) {
    var results = document.getElementById('searchResult');
    var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
    var markerIcon = MARKER_PATH + markerLetter + '.png';
    var img;

    if (result.photos) {
      img = result.photos[0].getUrl({ maxWidth: 45, maxHeight: 45 });
    }
    else {
      img = "";
    }

    var tr = document.createElement('tr');
    tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    tr.onclick = function() {
      google.maps.event.trigger(markers[i], 'click');

      // scrolls to the map results when the user selects a result
      var scroll = document.getElementById("map");
      scroll.scrollIntoView();
    };

    var iconTd = document.createElement('td');
    var icon2Td = document.createElement('td');
    var nameTd = document.createElement('td');
    var icon = document.createElement('img');
    var icon2 = document.createElement('img');

    icon.src = markerIcon;
    icon.setAttribute('class', 'placeIcon');
    icon.setAttribute('className', 'placeIcon');
    icon2.src = img;
    icon2.setAttribute('class', 'placeImage');
    icon2.setAttribute('imagePlace', 'placeImage');
    var name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    icon2Td.appendChild(icon2);
    tr.appendChild(iconTd);
    tr.appendChild(icon2Td);
    tr.appendChild(nameTd);
    results.appendChild(tr);
  }



  // function that clears all of the results 

  function clearResults() {
    var results = document.getElementById('searchResult');
    while (results.childNodes[0]) {
      results.removeChild(results.childNodes[0]);
    }
  }

  // function that shows the infoWindow

  function showInfoWindow() {
    var marker = this;
    places.getDetails({ placeId: marker.placeResult.place_id },
      function(place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
      });
  }

  // function built to hold all of the infoWindow content shown, and pictures with place information

  function buildIWContent(place) {
    $('#place-photo-spot').show();
    $('#place-photo-spot2').show();
    $('#place-photo-spot3').show();
    $('#place-photo-spot4').show();
    $('#place-photo-spot5').show();
    $('#place-photo-spot6').show();
    $('#place-photo-spot7').show();

    document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
      'src="' + place.icon + '"/>';
    document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
      '">' + place.name + '</a></b>';
    document.getElementById('iw-address').textContent = place.vicinity;

    if (place.formatted_phone_number) {
      document.getElementById('iw-phone-row').style.display = '';
      document.getElementById('iw-phone').textContent =
        place.formatted_phone_number;
    }
    else {
      document.getElementById('iw-phone-row').style.display = 'none';
    }


    if (place.rating) {
      var ratingHtml = '';
      for (var i = 0; i < 5; i++) {
        if (place.rating < (i + 0.5)) {
          ratingHtml += '&#10025;';
        }
        else {
          ratingHtml += '&#10029;';
        }
        document.getElementById('iw-rating-row').style.display = '';
        document.getElementById('iw-rating').innerHTML = ratingHtml;
      }
    }
    else {
      document.getElementById('iw-rating-row').style.display = 'none';
    }


    // The regexp isolates the first part of the URL (domain plus subdomain)
    // to give a short URL for displaying in the info window.
    if (place.website) {
      var fullUrl = place.website;
      var website = hostnameRegexp.exec(place.website);
      if (website === null) {
        website = 'http://' + place.website + '/';
        fullUrl = website;
      }
      document.getElementById('iw-website-row').style.display = '';
      document.getElementById('iw-website').textContent = website;
    }
    else {
      document.getElementById('iw-website-row').style.display = 'none';
    }


    // if statement that calls on the google photos array

    if (place.photos) {
      for (let i = 0; i < place.photos.length; i++)

        if (place.photos.length < 3) {
          var photoUrl = place.photos[0].getUrl({ maxWidth: 1000, maxHeight: 1250 });
          var photoUrl2 = place.photos[1].getUrl({ maxWidth: 1000, maxHeight: 1250 });
          document.getElementById('place-photo-spot').src = photoUrl;
          document.getElementById('place-photo-spot2').src = photoUrl2;
          document.getElementById('place-photo-spot3').style.display = 'none';
          document.getElementById('place-photo-spot4').style.display = 'none';
          document.getElementById('place-photo-spot5').style.display = 'none';
          document.getElementById('place-photo-spot6').style.display = 'none';
          document.getElementById('place-photo-spot7').style.display = 'none';
        }
      else if (place.photos.length > 3) {
        photoUrl = place.photos[0].getUrl({ maxWidth: 1000, maxHeight: 1250 });
        photoUrl2 = place.photos[1].getUrl({ maxWidth: 1000, maxHeight: 1250 });
        var photoUrl3 = place.photos[2].getUrl({ maxWidth: 1000, maxHeight: 1250 });
        var photoUrl4 = place.photos[3].getUrl({ maxWidth: 1000, maxHeight: 1250 });
        var photoUrl5 = place.photos[4].getUrl({ maxWidth: 1000, maxHeight: 1250 });
        var photoUrl6 = place.photos[5].getUrl({ maxWidth: 1000, maxHeight: 1250 });
        var photoUrl7 = place.photos[6].getUrl({ maxWidth: 1000, maxHeight: 1250 });
        document.getElementById('place-photo-spot').src = photoUrl;
        document.getElementById('place-photo-spot2').src = photoUrl2;
        document.getElementById('place-photo-spot3').src = photoUrl3;
        document.getElementById('place-photo-spot4').src = photoUrl4;
        document.getElementById('place-photo-spot5').src = photoUrl5;
        document.getElementById('place-photo-spot6').src = photoUrl6;
        document.getElementById('place-photo-spot7').src = photoUrl7;
      }
      $('#place-info').show();
      $('#hidePhotobox').show();
    }
    else {
      document.getElementById('place-photo-spot').style.display = 'none';
      document.getElementById('place-photo-spot2').style.display = 'none';
      document.getElementById('place-photo-spot3').style.display = 'none';
      document.getElementById('place-photo-spot4').style.display = 'none';
      document.getElementById('place-photo-spot5').style.display = 'none';
      document.getElementById('place-photo-spot6').style.display = 'none';
      document.getElementById('place-photo-spot7').style.display = 'none';
      document.getElementById('place-info').style.display = 'none';
      document.getElementById('hidePhotobox').style.display = 'none';
    }


    // Function that adds information to the main picture from the search

    insertPlaceInfo(place);

    function insertPlaceInfo(place) {
      let markup = '<div>' +
        '<h1>Name: <a href="' + place.url + '">' + place.name + '</a></h1>' + '<h2>Address: ' + place.vicinity + '</h2>' +
        '<h3>Phone Number: ' + place.formatted_phone_number + '</h3>' + '<h5 class="smallMobile">' + place.website + '</h5></div>';


      document.getElementById('place-info').innerHTML = markup;
    }
  }


  if (places.geometry) {
    bounds.union(places.geometry);
  }
  else {
    bounds.extend(places.geometry.location);
  }
  map.fitBounds(bounds);
}
