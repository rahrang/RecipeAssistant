"use strict";

var SKILL_STATES = {
    START: "_STARTMODE",
    RECIPE: "_RECIPEMODE",
    INGREDIENTS: "_INGREDIENTSMODE",
    DIRECTIONS: "_DIRECTIONSMODE"
};

var languageString = {
    "en-US": {
        "translation": {
            "SKILL_NAME" : "Recipe Assistant",
            "RECIPE_PROMPT": "What recipe would you like to make?",
            "UNFOUND_RECIPE": "I couldn't find that recipe. Is there another recipe you would like to make?",
            "TRANSITION": "Let me pull up the recipe for %s.",
            "ING_DIR_PROMPT": "Would you like the ingredients or the directions?",
            "WHAT_CAN_I_SAY": "Try asking for a recipe you would like to make.",
            "WHAT_CAN_I_SAY_RECIPE": "You can ask for the ingredients, the directions, or ask for a different recipe.",
            "WHAT_CAN_I_SAY_ING": "You can ask for the previous, next, or current ingredients, the directions, or ask for a different recipe.",
            "WHAT_CAN_I_SAY_DIR": "You can ask for the previous, next, or current directions, the ingredients, or ask for a different recipe.",
            "STOP_MESSAGE": "Hope you have a great meal."
        }
    }
};

const Alexa = require("alexa-sdk");
var APP_ID = undefined;
const rp = require("request-promise");
const database = [];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startStateHandlers, recipeStateHandlers, ingredientStateHandlers, directionStateHandlers);
    alexa.execute();
};

var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Start");
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = SKILL_STATES.START;
        loadDatabase.call(this);
        this.emitWithState("AMAZON.HelpIntent");
    },
    "Unhandled": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Start");
    }
};

var startStateHandlers = Alexa.CreateStateHandler(SKILL_STATES.START,{
    "Start": function () {
        var speechOutput = this.t("SKILL_NAME") + ", " + this.t("RECIPE_PROMPT");
        var repromptText = this.t("RECIPE_PROMPT");
        this.emit(":askWithCard", speechOutput, repromptText, this.t("SKILL_NAME"), repromptText);
    },
    "RecipeIntent": function () {
        transitionRecipeState.call(this);
    },
    // "DontKnowIntent": function () {
    //     var speechOutput = this.t("WHAT_CAN_I_SAY");
    //     this.emit(":ask", speechOutput, speechOutput);
    // },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Start");
    },
    "AMAZON.RepeatIntent": function () {
        var speechOutput = this.t("RECIPE_PROMPT");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.HelpIntent": function () {
        var speechOutput = this.t("WHAT_CAN_I_SAY");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.StopIntent": function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(":tell", speechOutput, speechOutput);
    },
    "AMAZON.CancelIntent": function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(":tell", speechOutput, speechOutput);
    },
    "Unhandled": function () {
        var speechOutput = "I couldn't understand that. " + this.t("SKILL_NAME") + ", " + this.t("RECIPE_PROMPT");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in state: " + this.event.request.reason);
    }
});

function transitionRecipeState()
{
    var recipeName = String(this.event.request.intent.slots.recipeName.value);
    var self = this;
    rp({
        uri: "https://hrw08iio3e.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=RecipeList",
        json: true
    })
    .catch(error => {
        speechOutput += "Sorry, an error occured while getting the recipes.";
        self.emit(":tell", speechOutput, speechOutput);
    })
    .then(data =>
    {
        speechOutput += "success";
        data['Items'].forEach(recipe => {
            const name = recipe['RecipeName'].toLowerCase();
            database[name] = recipe;
        });
        if(recipeName in database) {
            // on success
            var recipe = database[recipeName];
            Object.assign(this.attributes, {
                "name": recipeName,
                "directions": recipe['Directions'].split("\n").filter(function(e1) {return e1.length!=0;}),
                "dirPos": 0,
                "ingredients": recipe['Ingredients'].split("\n").filter(function(e1) {return e1.length!=0;}),
                "ingPos": 0
            });
            this.handler.state = SKILL_STATES.RECIPE;
            this.emitWithState("Start", true);
        } else {
            // on failure
            var speechOutput = this.t("UNFOUND_RECIPE");
            this.handler.state = SKILL_STATES.START;
            this.emit(":ask", speechOutput, speechOutput);
        }
    });
}

var recipeStateHandlers = Alexa.CreateStateHandler(SKILL_STATES.RECIPE, {
    "Start": function (newInst) {
        var speechOutput = newInst ? this.t("TRANSITION", this.attributes['name']) + " " + this.t("ING_DIR_PROMPT") : this.t("ING_DIR_PROMPT");
        var repromptText = this.t("ING_DIR_PROMPT");
        this.emit(":askWithCard", speechOutput, repromptText, this.t("SKILL_NAME"), repromptText);
    },
    "IngredientsIntent": function () {
        this.handler.state = SKILL_STATES.INGREDIENTS;
        this.emitWithState("Start");
    },
    "DirectionsIntent": function () {
        this.handler.state = SKILL_STATES.DIRECTIONS;
        this.emitWithState("Start");
    },
    "RecipeIntent": function () {
        transitionRecipeState.call(this);
    },
    // "DontKnowIntent": function () {
    //     var speechOutput = this.t("WHAT_CAN_I_SAY_RECIPE");
    //     this.emit(":ask", speechOutput, speechOutput);
    // },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Start", false);
    },
    "AMAZON.RepeatIntent": function () {
        this.emitWithState("Start", false);
    },
    "AMAZON.HelpIntent": function () {
        var speechOutput = this.t("WHAT_CAN_I_SAY_RECIPE");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.StopIntent": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Start");
    },
    "AMAZON.CancelIntent": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Start");
    },
    "Unhandled": function () {
        var speechOutput = "I couldn't understand that. " + " " + this.t("ING_DIR_PROMPT");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in state: " + this.event.request.reason);
    }
});

var ingredientStateHandlers = Alexa.CreateStateHandler(SKILL_STATES.INGREDIENTS, {
    "Start": function () {
        var speechOutput = "The first ingredient is " + this.attributes['ingredients'][0];
        this.attributes['ingPos'] = 1;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "NextIntent": function () {
        if(this.attributes['previous']) {
            this.attributes['ingPos'] = this.attributes['ingPos'] + 1;
        }
        this.attributes['previous'] = false;
        var pos = this.attributes['ingPos'];
        if(pos < this.attributes['ingredients'].length - 1) {
            var speechOutput = "The next ingredient is " + this.attributes['ingredients'][pos];
            this.attributes['ingPos'] = pos + 1;
            this.emit(":ask", speechOutput, speechOutput);
        } else if(pos == this.attributes['ingredients'].length - 1) {
            var speechOutput = "The last ingredient is " + this.attributes['ingredients'][pos] + ". When you are ready for the directions, say start.";
            this.handler.state = SKILL_STATES.DIRECTIONS;
            this.emit(":ask", speechOutput, speechOutput);
        } else {
            var speechOutput = "You have finished the ingredients. The first direction is to " + this.attributes['directions'][0];
            this.handler.state = SKILL_STATES.DIRECTIONS;
            this.emit(":ask", speechOutput, speechOutput);
        }
    },
    "PreviousIntent": function () {
        this.attributes['previous'] = true;
        var pos = this.attributes['ingPos'];
        if(pos > 0) {
            var speechOutput = "The previous ingredient was " + this.attributes['ingredients'][pos-1];
            this.attributes['ingPos'] = pos - 1;
            this.emit(":ask", speechOutput, speechOutput);
        } else {
            var speechOutput = "You have reached the beginning of the ingredients. For the first ingredient, say next."
            this.emit(":ask", speechOutput, speechOutput);
        }
    },
    "DirectionsIntent": function () {
        this.handler.state = SKILL_STATES.DIRECTIONS;
        this.emitWithState("Start");
    },
    "RecipeIntent": function () {
        transitionRecipeState.call(this);
    },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Start");
    },
    "AMAZON.RepeatIntent": function () {
        this.attributes['ingPos'] = this.attributes['ingPos'] - 1;
        this.emitWithState("NextIntent");
    },
    "AMAZON.HelpIntent": function () {
        var speechOutput = this.t("WHAT_CAN_I_SAY_ING");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.StopIntent": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Start", true);
    },
    "AMAZON.CancelIntent": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Start", true);
    },
    "Unhandled": function () {
        var speechOutput = "I couldn't understand that. Say next for the next ingredient.";
        this.emit(":ask", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in state: " + this.event.request.reason);
    }
});

var directionStateHandlers = Alexa.CreateStateHandler(SKILL_STATES.DIRECTIONS, {
    "Start": function () {
        var speechOutput = "You must first " + this.attributes['directions'][0];
        this.attributes['dirPos'] = 1;
        this.emit(":ask", speechOutput, speechOutput);
    },
    "NextIntent": function () {
        if(this.attributes['previous']) {
            this.attributes['dirPos'] = this.attributes['dirPos'] + 1;
        }
        this.attributes['previous'] = false;
        var pos = this.attributes['dirPos'];
        if(pos < this.attributes['directions'].length - 1) {
            var speechOutput = this.attributes['dirPos']==0 ? "You must first, " : "Then, ";
            speechOutput += this.attributes['directions'][pos];
            this.attributes['dirPos'] = pos + 1;
            this.emit(":ask", speechOutput, speechOutput);
        } else if(pos == this.attributes['directions'].length - 1) {
            var speechOutput = "Finally, " + this.attributes['directions'][pos] + " " + this.t("STOP_MESSAGE");
            this.emit(":tell", speechOutput, speechOutput);
        } else {
            var speechOutput = "You have finished the directions. " + this.t("STOP_MESSAGE");
            this.emit(":tell", speechOutput, speechOutput);
        }
    },
    "PreviousIntent": function () {
        this.attributes['previous'] = true;
        var pos = this.attributes['dirPos'];
        if(pos > 0) {
            var speechOutput = "The previous direction was to " + this.attributes['directions'][pos-1];
            this.emit(":ask", speechOutput, speechOutput);
        } else {
            var speechOutput = "You have reached the beginning of the directions. For the first direction, say next."
            this.emit(":ask", speechOutput, speechOutput);
        }
    },
    "IngredientsIntent": function () {
        this.handler.state = SKILL_STATES.INGREDIENTS;
        this.emitWithState("Start");
    },
    "RecipeIntent": function () {
        transitionRecipeState.call(this);
    },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Start");
    },
    "AMAZON.RepeatIntent": function () {
        this.attributes['dirPos'] = this.attributes['dirPos'] - 1;
        this.emitWithState("NextIntent");
    },
    "AMAZON.HelpIntent": function () {
        var speechOutput = this.t("WHAT_CAN_I_SAY_DIR");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.StopIntent": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Start", true);
    },
    "AMAZON.CancelIntent": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Start", true);
    },
    "Unhandled": function () {
        var speechOutput = "I couldn't understand that. Say next for the next direction.";
        this.emit(":ask", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in state: " + this.event.request.reason);
    }
});