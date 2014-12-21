
var initialized = false;

function initialize() {
  var fenway = new google.maps.LatLng(48.997467, 15.352922);

  // Note: constructed panorama objects have visible: true
  // set by default.
  var panoOptions = {
    position: fenway,
    addressControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER
    },
    addressControl: false,
    linksControl: true,
    panControl: false,
    pov: {
      heading: 44,
      pitch: 8
    },
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    },
    enableCloseButton: true
  };

  var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('gmap'), panoOptions);

  var map = new google.maps.Map(document.getElementById('gmap'), {
    zoom: 15,
    center: fenway
  });  

  var marker = new google.maps.Marker({
      position: fenway,
      map: map,
      animation: google.maps.Animation.DROP,
      title: 'Besidka'
  });  

  var infowindow = new google.maps.InfoWindow({
      content: "<div style='height: 100px;'><a href='index.html'>Besídka</a><br /> Horní náměstí 522<br /> 378 81 Slavonice<br /> Tel.: +420 384 493 293</div>"
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });  
}

function initializegMap() {
  if (initialized) {
    return;
  }
  initialized = true;

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
      'callback=initialize';
  document.body.appendChild(script);
}