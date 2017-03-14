// JavaScript Document
$(document).ready( function() {
	
	"use strict";
	
	$.get("https://elpwebsphe.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Recipes", function(data) {
		alert(JSON.stringify(data.Items.length)); // returns '2' because there are two items in the table
	});
	
	// data == the entire table
	// data.Items == the items in the table (each dish/recipe)
	// data.Items.length == the number of items in the table (the number of dishes/recipes)
	// data.Items[0] == the first item in the table (the first dish/recipe)
	
	/* what we want to do is iterate through every dish in the table, then pull the data from that dish
	in order to 'fill out' the corresponding id's (example: dish-image-1) with the correct values from
	that dish */
	
});