/**
 * App ID for the skill
 */
//var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var APP_ID = "amzn1.ask.skill.69248e8b-2456-4937-9227-94773ceb34de";

// [http://www.chimet.co.uk/csg/chi.html]
// `22 January,6:50 am,6.4,7.4,051,3.90, 0.59,0.68,15,1.6,,1026,`
// Date, time, mean, gust, Wind Dir, tide hight, mean wave height, max wave height, wave period, air temp, sea temp, pressure, visibility

var URI = 'http://www.chimet.co.uk/csg/chi.html'
var http = require('http');
var chiData = [];
var chiDataTime = 0;

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
var chimet = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
chimet.prototype = Object.create(AlexaSkill.prototype);
chimet.prototype.constructor = chimet;

chimet.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

chimet.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    //console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
chimet.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

chimet.prototype.intentHandlers = {
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

  console.time('http-request');

  http.get(URI, function (res) {
    var chiResponseString = '';
    console.log('handleChiMetRequest: HTTP response for Status Code: '+res.statusCode+', for: '+URI);

    // if for some reason we did not get a HTTP 200 OK
    if (res.statusCode != 200) {
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

      speechOutput = 'Chimet.  '+chiData[1]+'.  '+chiData[0]+'.  '
        +'Wind mean '+chiData[2]+', gusting '+chiData[3]+', direction '+chiData[4]+'.  '
        +'Tide height '+chiData[5]+'.  '
        +'Air temp '+chiData[9]+' degrees.';

	  console.log("handleChiMetRequest: speechOutput is: "+speechOutput);

    });
  }).on('error', function (e) {
    console.timeEnd('http-request');
    console.log("handleChiMetRequest: Communications error: " + e.message);
  });

  response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    chimet.execute(event, context);
};

