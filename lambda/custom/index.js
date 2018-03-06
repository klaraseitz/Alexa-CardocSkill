/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.d048eeab-3989-429b-94c3-baa5d399edd6';

const HELLO_MESSAGE = ' Hi, I\'m carDoc, I am you personal doctor for your car.';
const HELP_MESSAGE = ' You can ask me about the condition of your car or let me analyze weird noises... What can I help you with?';
const HELP_REPROMPT = ' What can I help you with?';
const STOP_MESSAGE = ' Goodbye!';

const states = {
	DEFAULTMODE: '_DEFAULTMODE', // User doesnt need to respond to alexa
	APPOINTMENTMODE: '_APPOINTMENTMODE', // Prompt the user if appointment is wanted
  ANALYSISMODE: '_ANALYSISMODE' // Promt user if sound should be analzed
};

//=========================================================================================================================================
// Data used to build responses
//=========================================================================================================================================
const conditionData = [
    'You are low on oil.',
    'Your brakes are worn off.',
		'There are no issues with your car.'
];

const requestForSilence = [
    'Silence please. I will analyze in ',
    'To get the best result please turn off your radio. I will start the recording in ',
    'I am starting sound recording in '
];

const noiseData = [
    'I am very sure that you have a problem with ',
    'It sounds like this could be ',
    'Your car may have a problem with '
];

const problem = 'the water pump.'

//=========================================================================================================================================
// Intents of the skill with their handlers
//=========================================================================================================================================

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(sessionHandlers, defaultHandlers, appointmentModeHandlers, analysisModeHandlers);
    alexa.execute();
};

const sessionHandlers = {
		'LaunchRequest': function () {
				this.handler.state = '_DEFAULTMODE';
        this.response.speak('Hi, I am Cardoc. What can I help you with?')
										 .listen('Ask me to check the status or analyse noise.');
        this.emit(':responseReady');
    },
		'CheckStatusIntent': function () {
				this.handler.state = "_DEFAULTMODE";
				this.emitWithState('CheckStatusIntent');
		},
		'AnalyzeSoundIntent': function () {
				this.handler.state = "_DEFAULTMODE";
				this.emitWithState('AnalyzeSoundIntent');
		},
		'AMAZON.HelpIntent': function () {
				this.handler.state = "_DEFAULTMODE";
				this.emitWithState('AMAZON.HelpIntent');
		}
}

const defaultHandlers = Alexa.CreateStateHandler("_DEFAULTMODE"	, {
    'CheckStatusIntent': function () {
	      const conditionIndex = Math.floor(Math.random() * conditionData.length);
				this.handler.state = "_ANALYSISMODE";
				this.response.speak(conditionData[conditionIndex] + " Do you want me to analyze the sound of your car also?")
										 .listen("Say yes to start the noise analysis.");

	      this.emit(':responseReady');
    },
    'AnalyzeSoundIntent': function () {
	      const silenceIndex = Math.floor(Math.random() * requestForSilence.length);
	      const noiseIndex = Math.floor(Math.random() * noiseData.length);
	      var speechOutput = requestForSilence[silenceIndex] + '3... 2... 1 <break time="5s" /> Done.';
	      speechOutput += ' ' + noiseData[noiseIndex] + problem;
	      speechOutput += ' You should have this checked at your car workshop.';

	      var question = ' Do you want me to send you a push notification with suggestions for an appointment?';
				this.handler.state = "_APPOINTMENTMODE";
	      this.response.speak(speechOutput+' Do you want me to send you a push notification with suggestions for an appointment?')
	                   .listen("Repeat please.");
	      // this.emit(':ask', speechOutput + question, 'Repeat please');
	      this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
		'AMAZON.YesIntent': function () {
				this.response.speak('Sorry, this was not a yes or no question.');
				this.emit(':responseReady');
		},
		'AMAZON.NoIntent': function () {
				this.response.speak('Sorry, this was not a yes or no question.');
				this.emit(':responseReady');
		}
});

const appointmentModeHandlers = Alexa.CreateStateHandler("_APPOINTMENTMODE"	, {
		'AMAZON.YesIntent': function () {
				this.response.speak('Ok, I sent you some suggestions for an appointment to your phone.');
				this.emit(':responseReady');
		},
		'AMAZON.NoIntent': function () {
				this.response.speak('Ok, I won\'t send you appointment suggestions.');
				this.emit(':responseReady');
		}
});

const analysisModeHandlers = Alexa.CreateStateHandler("_ANALYSISMODE"	, {
		'AMAZON.YesIntent': function () {
				this.handler.state = "_DEFAULTMODE";
				this.emitWithState("AnalyzeSoundIntent");
		},
		'AMAZON.NoIntent': function () {
				this.response.speak('Ok.');
				this.emit(':responseReady');
		}
});
