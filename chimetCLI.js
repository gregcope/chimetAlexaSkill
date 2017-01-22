
//
//
//
//
//
// [http://www.chimet.co.uk/csg/chi.html]
// `22 January,6:50 am,6.4,7.4,051,3.90, 0.59,0.68,15,1.6,,1026,`
// Date, time, mean, gust, Wind Dir, tide hight, mean wave height, max wave height, wave period, air temp, sea temp, pressure, visibility

var chimetURI = 'http://www.chimet.co.uk/csg/chi.html'
var chimetString = "22 January,6:50 am,6.4,7.4,051,3.90, 0.59,0.68,15,1.6,,1026,";
var chimetURItime = 0;

var chidata = [];

chidata = chimetString.split(',');

var response = '';

var response = 'Chimet.  '+chidata[1]+'.  '+chidata[0]+'.  '
  +'Wind mean '+chidata[2]+', gusting '+chidata[3]+', direction '+chidata[4]+'.  '
  +'Tide height '+chidata[5]+'.  '
  +'Air temp '+chidata[9]+' degrees.'

console.log('response is: '+response);
