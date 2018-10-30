var geocoder;
var map;
function initialize() {
  geocoder = new google.maps.Geocoder();
  // Center Google Map on following coordinates
  var latlng = new google.maps.LatLng(40.743502,-73.987409);
  var myOptions = {
    zoom: 6,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  
  // Create Google Map!
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

$('#Location').keydown(function(e){
  if (e.keyCode == 13){
    // Grab address specified by user
    var address = document.getElementById("Location").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      // Calculate bounding box
      var north = results[0].geometry.location.lat() + 1;
      var south = results[0].geometry.location.lat() - 1;
      var east = results[0].geometry.location.lng() + 1;
      var west = results[0].geometry.location.lng() - 1;
      
      var earthquake = 'http://api.geonames.org/earthquakesJSON?north=' + north + '&south=' + south + '&east=' + east + '&west=' + west + '&username=gerardogtz';
      // Call Recent Earthquakes API
      $.getJSON(earthquake, function(data) {
        // Iterate through result and setup a marker on each
        $.each(data, function(key, val) {
          for (var i = 0; i < data.earthquakes.length; i++) {   
            var myLatlng = new google.maps.LatLng(val[i].lat,val[i].lng);
            var marker = new google.maps.Marker({
                          map: map, 
                          position: myLatlng,
                          // Info on the quake
                          title:'Magnitude: ' + val[i].magnitude + ' Depth: ' + val[i].depth + ' Date: ' + val[i].datetime
                        });
          }
        });
      });
      // Center map on user provided address and place marker
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
                    map: map, 
                    animation: google.maps.Animation.DROP,
                    position: results[0].geometry.location,
                    title:address
                  });
      } 
      else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
});

$('#update').click(function(){
  $('#table-earthquake').empty();
  var today = new Date();
  var day   = today.getDate();
  var month = today.getMonth() + 1;
  var year  = today.getFullYear();
  var today = year + '-' + month + '-' + day;
  
  var row = 0;
  var table = $('#table-earthquake').html();
  var earthquake = 'http://api.geonames.org/earthquakesJSON?north=90&south=-90&east=180&west=-180&date=' + today +'&username=gerardogtz';
  // Call Recent Earthquakes API
  $.getJSON(earthquake, function(data) {
    //console.log(data);
    // Iterate through result         
    for (var i = 0; i < 10; i++){
      table += `<tr>
                  <th scope="row"> ${i+1} </th>
                  <td> ${data.earthquakes[i].magnitude} </td>
                  <td> ${data.earthquakes[i].depth} </td>
                  <td> ${data.earthquakes[i].datetime} </td>
                </tr>`;
    }
    $('#table-earthquake').append(table);
  });
});