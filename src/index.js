/**
 * App ID for the skill
 */
//var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var APP_ID = "amzn1.ask.skill.69248e8b-2456-4937-9227-94773ceb34de";

// [http://www.chimet.co.uk/csg/chi.html]
// `22 January,6:50 am,6.4,7.4,051,3.90, 0.59,0.68,15,1.6,,1026,`
// Date, time, mean, gust, Wind Dir, tide hight, mean wave height, max wave height, wave period, air temp, sea temp, pressure, visibility

var URI = 'http://www.chimet.co.uk/csg/chi.html';
var http = require('http');
var chiData = [];
var chiDataTime = 0;


// from; https://github.com/kanbara/beaufort/blob/master/beaufort.js
// http://about.metservice.com/assets/downloads/learning/winds_poster_web.pdf
var knotLimits = [1,3,6,10,16,21,27,33,40,47,55,63,512];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Chimet = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Chimet.prototype = Object.create(AlexaSkill.prototype);
Chimet.prototype.constructor = Chimet;

Chimet.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Chimet.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    //console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleChiMetRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Chimet.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Chimet.prototype.intentHandlers = {
    "GetChiMetIntent": function (intent, session, response) {
		handleChiMetRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */

function handleChiMetRequest(response) {

  var speechOutput = '';
  var cardTitle = 'Chimet';
  var chiResponseString = '';

  console.time('http-request');

  http.get(URI, function (res) {

    console.log('handleChiMetRequest: HTTP response for Status Code: '+res.statusCode+', for: '+URI);

    // if for some reason we did not get a HTTP 200 OK
    if (res.statusCode != 200) {
	  console.log("handleChiMetRequest: Non 200 Response for: "+URI);
      forecastResponseCallback(new Error("handleChiMetRequest: Non 200 Response for: "+URI));
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
      console.log("handleChiMetRequest: res.on done");
      console.timeEnd('http-request');

      speechOutput = chiData[1]+'.  '+chiData[0]+'.  '
        +getBeaufort(chiData[2])+', gusting '+getBeaufort(chiData[3])+', direction '+chiData[4]+'.  '
        +'Tide height '+chiData[5]+'.  '
        +'Air temp '+chiData[9]+' degrees.';

	  console.log("handleChiMetRequest: speechOutput is: "+speechOutput);
	  response.tellWithCard('Chai met.  '+speechOutput, cardTitle, 'Chimet.  '+speechOutput);

    });
  }).on('error', function (e) {
    console.timeEnd('http-request');
    console.log("handleChiMetRequest: Communications error: " + e.message);
  });

}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var chimet = new Chimet();
    // Create an instance of the chimet skill.
    chimet.execute(event, context);
};

function getBeaufort(knots) {

  knots = parseFloat(knots); 
  // https://forum.freecodecamp.com/t/can-somebody-help-with-a-simple-javascript-problem/56010/2
  var beaufort = '';
  switch (knots) {
    case knots < 1:
      beaufort = 'Calm';
      break;
    case knots < 4:
      beaufort = 'Force 1';
      break;
    case knots < 7:
      beaufort = 'Force 2';
      break;
    case knots < 11:
      beaufort = 'Force 3';
      break;
    case knots < 17:
      beaufort = 'Force 4';
      break;
    case knots < 22:
      beaufort = 'Force 5';
      break;
    case knots < 28:
      beaufort = 'Force 6';
      break;
    case knots < 34:
      beaufort = 'Force 7';
      break;
    case knots < 41:
      beaufort = 'Force 8';
      break;
    case knots < 48:
      beaufort = 'Force 9';
      break;
    case knots < 56:
      beaufort = 'Force 10';
      break;
    case knots < 64:
      beaufort = 'Force 11';
      break;
  }
  beaufort = 'Force 12';
  return beaufort; 
  // on this line I added a return statement so the function would return the results of the calculation
  // you can either return the beaufort calculation here like I did
  // or you could do the DOM update here if you want the function  to just change the DOM
}


