//
// [http://www.chimet.co.uk/csg/chi.html]
// `22 January,6:50 am,6.4,7.4,051,3.90, 0.59,0.68,15,1.6,,1026,`
// Date, time, mean, gust, Wind Dir, tide hight, mean wave height, max wave height, wave period, air temp, sea temp, pressure, visibility

var URI = 'http://www.chimet.co.uk/csg/chi.html'
var http = require('http');
var chiData = [];
var chiDataTime = 0;


console.time('http-request');

http.get(URI, function (res) {
  var chiResponseString = '';
  console.log('HTTP response for Status Code: '+res.statusCode+', for: '+URI);

  // if for some reason we did not get a HTTP 200 OK
  if (res.statusCode != 200) {
    forecastResponseCallback(new Error("Non 200 Response for: "+URI));
    console.timeEnd('http-request');
  }

  // got some more data to append
  res.on('data', function (data) {
    chiResponseString += data;
  });

  // in theory finished!
  res.on('end', function () {
    // should have a sensible result
    chiDataTime = new Date().getTime();
	chiData = chiResponseString.split(',');
    console.log("res.on done");
    console.timeEnd('http-request');
    alexaResponse();  
  });
}).on('error', function (e) {
  console.timeEnd('http-request');
  console.log("Communications error: " + e.message);
  forecastResponseCallback(new Error(e.message));
});

function alexaResponse() {
var response = 'Chimet.  '+chiData[1]+'.  '+chiData[0]+'.  '
  +'Wind mean '+chiData[2]+', gusting '+chiData[3]+', direction '+chiData[4]+'.  '
  +'Tide height '+chiData[5]+'.  '
  +'Air temp '+chiData[9]+' degrees.'

  console.log('response is: '+response);
}


//var chimetString = "22 January,6:50 am,6.4,7.4,051,3.90, 0.59,0.68,15,1.6,,1026,";
//chidata = chimetString.split(',');

