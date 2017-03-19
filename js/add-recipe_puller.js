// JavaScript Document

$("#submit-button").click(function(){
	
	"use strict";
	
	var databaseURL = "https://hrw08iio3e.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Recipes";
	
	var recipe_name = document.getElementById("recipe_name").value;
	var directions = document.getElementById("steps").value;
	var ingred = document.getElementById("ingredients").value;
	var image_link = document.getElementById("image_link").value;
				
	var to_post = JSON.stringify(
	{
		type: "POST",
		data: {
			TableName: "RecipeList",
			Item: {
				RecipeName: recipe_name,
				ImageSRC: image_link,
				IngredientsList: ingred,
				PrepDirections: directions
			}
		}
	});

	$.post(databaseURL, to_post);
	
	alert("Are you sure you want to enter this recipe?");
	
});