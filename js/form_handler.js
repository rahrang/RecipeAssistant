// JavaScript Document

var databaseURL = "https://elpwebsphe.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Recipes";

$("#submit-button").click(function() {
	
	"use strict";

	alert("button clicked!");
	
	var recipe_name = document.getElementById("#recipe_name");
	var directions = document.getElementById("#directions");
	var ingredients = document.getElementById("#ingredients");
	var image_link = document.getElementById("#image_link");

	alert(recipe_name);

	$.post(databaseURL, JSON.stringify(
	{
		"type": "POST",
		"data": {
			"TableName": "Recipes",
			"Items": {
				"RecipeName": recipe_name,
				"Directions": directions,
				"Ingredients": ingredients,
				"ImageURL": image_link
			}
		}
	}),
	function(data, status) {
		alert(status);
	});
});