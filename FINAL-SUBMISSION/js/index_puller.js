// JavaScript Document
$(document).ready( function() {
	
	"use strict";
	
//	The URL of our Dynamo database on AWS
	var databaseURL = "https://hrw08iio3e.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=RecipeList";
	
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
*/	
	
	//	Get the number of dishes/recipes in the database
	var databaseSize = 0;
	$.get(databaseURL, function(data) {
		databaseSize = data.Count;
	});
		
	//	variables to help us update corresponding html tags
	var dishImg = "#dish-img-";
	var dishName = "#dish-name-";
	var dishIngr = "#dish-ingredients-";
	var dishRec = "#dish-recipe-";
	
	
	//	the function to pull from the database and update the html tags
	$.get(databaseURL, function(data) {
		
		for (var index = 0; index < databaseSize; index++) {
			
			// changes the source of the img tag with id "dish-img-INDEX" to corresponding source URL in the database
			$(dishImg + index).attr("src", data.Items[index].ImageSRC);  

			// changes the content of the h2 tag with id "dish-name-INDEX" to the corresponding RecipeName in the database
			$(dishName + index).text(data.Items[index].RecipeName);

		}

	});
	
	// for the ingredient links on the index page
			
	$(dishIngr+"0").click(function(){
		sessionStorage.setItem("global_index", 0);
	});
	
	$(dishIngr+"1").click(function(){
		sessionStorage.setItem("global_index", 1);
	});
	
	$(dishIngr+"2").click(function(){
		sessionStorage.setItem("global_index", 2);
	});
	
	$(dishIngr+"3").click(function(){
		sessionStorage.setItem("global_index", 3);
	});
	
	$(dishIngr+"4").click(function(){
		sessionStorage.setItem("global_index", 4);
	});	
	
	$(dishIngr+"5").click(function(){
		sessionStorage.setItem("global_index", 5);
	});
	
	
	// for the recipe links on the index page
	
	$(dishRec+"0").click(function(){
		sessionStorage.setItem("global_index", 0);
	});
	
	$(dishRec+"1").click(function(){
		sessionStorage.setItem("global_index", 1);
	});
	
	$(dishRec+"2").click(function(){
		sessionStorage.setItem("global_index", 2);
	});
	
	$(dishRec+"3").click(function(){
		sessionStorage.setItem("global_index", 3);
	});
	
	$(dishRec+"4").click(function(){
		sessionStorage.setItem("global_index", 4);
	});	
	
	$(dishRec+"5").click(function(){
		sessionStorage.setItem("global_index", 5);
	});
		
});