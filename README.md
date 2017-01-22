e Chimet Weather data Alexa Skill

## Intro
Chimet [http://www.chimet.co.uk/] is one of a group of near real time weather data stations in Solent, Southern England, UK.  Primarly used by sailors to understnad the live weather in common stomping grounds.  Chimet is actually on a mark called "West Pole".  This is a "dolphin" - a marine term for a tripod mark.  West Pole (the marks name) is situated just south of chichest harbour entrance, and marks the endof Chichested bar sand bank.

It looks like this;

![Chichester Bar Beacon](http://www.conservancy.co.uk/cache/sidebar-assets-assets-nav_3-jpg-w=316-h=1000-t=constrain.jpg)

Image from [http://www.conservancy.co.uk/page/navigation/325]

## Chimet Raw data

The website produces gifs for each data, and the archives are not recent.

So, setting up a proxy for an iDevice and sniffing the traffic shows that the Mobile apps pull and http 'html' page down which actually only consists of coma delimited data;

[http://www.chimet.co.uk/csg/chi.html] gives (today)
`22 January,6:50 am,6.4,7.4,051,3.90, 0.59,0.68,15,1.6,,1026,`
Date, time, mean, gust, Wind Dir, tide hight, mean wave height, max wave height, wave period, air temp, sea temp, pressure, visibility


## Data areas
1. chimet [http://www.chimet.co.uk/csg/chi.html]
2. bramblement [http://www.bramblemet.co.uk/csg/bra.html]
3. Sotonmet [http://www.sotonmet.co.uk/csg/sot.html]
4. Cambermet [http://www.cambermet.co.uk/csg/cam.html]
