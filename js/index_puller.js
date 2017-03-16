// JavaScript Document
$(document).ready( function() {
	
	"use strict";
	
//	The URL of our Dynamo database on AWS
	var databaseURL = "https://elpwebsphe.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Recipes";
	
//	Change this if/when we publish the website
	var webpageURL = "";
	
	// data == the entire table
	// data.Items == the items in the table (each dish/recipe)
	// data.Count == the number of items in the table (the number of dishes/recipes)
	// data.Items[0] == the first item in the table (the first dish/recipe)
	// data.Items[0].RecipeName == the name of the first item in the table (e.g. Cheese and Crackers)
	// data.Items[0].ImageURL == the image of the first item in the table, as a URL
	// data.Items[0].Ingredients == the list of ingredients necessary for the first item in the table
	// data.Items[0].Directions == the list of directions to prepare the first item in the table
	
	/*
		{"Items":
			
			[
				{
					"RecipeName":"Cheese and Crackers",
					"Directions":"Open The Cracker Box \n Spread Cheese on Crackers",
					"Ingredients":"Cheese \n Crackers",
					"ImageURL":"http://www.wikihow.com/images/5/59/Make-Cheese-Crackers-Intro.jpg"
				},

				{
					"RecipeName":"Bacon and Eggs",
					"Directions":"Crack eggs \n Scramble eggs \n Put bacon in pan \n Cook 10 minutes \n Add eggs \n Cook 3 minutes",
					"Ingredients":"Bacon \n Eggs",
					"ImageURL":"https://s-media-cache-ak0.pinimg.com/originals/53/61/61/5361615a85829c30d92fb2d8662a6ae9.jpg"
				}
			],
			
			"Count":2,
			"ScannedCount":2
		}
	
	/* we want to iterate through every dish in the table, then pull the data from that dish
	in order to 'fill out' the corresponding id's (example: dish-img-1) with the correct values
	from that dish */	
	
//	Get the number of dishes/recipes in the database
	var databaseSize = 0;
	$.get(databaseURL, function(data) {
		databaseSize = data.Count;
//		alert(databaseSize);
	});
	
	
//	variables to help us in creating hyperlinks
	var recipeName = "";
	var shortName = "";
	
//	variables to help us update corresponding html tags
	var dishImg = "#dish-img-";
	var dishName = "#dish-name-";
	var dishIngr = "#dish-ingredients-";
	var dishRec = "#dish-recipe-";
	
	
//	the function to pull from the database and update the html tags
	$.get(databaseURL, function(data) {
		
		for (var index = 0; index < databaseSize; index++) {
			
//			alert("index" + index);

			// changes the source of the img tag with id "dish-img-INDEX" to corresponding source URL in the database
			$(dishImg + index).attr("src", data.Items[index].ImageURL);  

			// changes the content of the h2 tag with id "dish-name-INDEX" to the corresponding RecipeName in the database
			recipeName = data.Items[index].RecipeName;
			$(dishName + index).text(recipeName);

			// removes the 'spaces' in the recipe name -- used to create a new web page
			shortName = recipeName.replace(/\s+/g, '');

			// changes the href of the a tag with id "dish-ingredients-INDEX"
			var tempIngredientURL = webpageURL + "ingredients/" + shortName;
			$(dishIngr + index).attr("href", tempIngredientURL);
			
			// changes the href of the a tag with id "dish-recipes-INDEX"
			var tempRecipeURL = webpageURL + "recipes/" + shortName;
			$(dishRec + index).attr("href", tempRecipeURL);

		}

	});	
	
});