// JavaScript Document
$(document).ready( function() {
	
	"use strict";
	
//	The URL of our Dynamo database on AWS
	var databaseURL = "https://elpwebsphe.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Recipes";
	
	var main_index = sessionStorage.getItem("global_index");
		
//	the function to pull from the database and update the html tags
	
	$.get(databaseURL, function(data) {

		// changes the content of the h2 tag with id "dish-name-INDEX" to the corresponding RecipeName in the database
		$("#recipe-title").text(data.Items[main_index].RecipeName);

		// changes the source of the img tag with id "dish-img-INDEX" to corresponding source URL in the database
		$("#recipe-image").attr("src", data.Items[main_index].ImageURL);  

		// changes the content of the p tag with id "ingredients-section" to corresponding recipe ingredients in the database
		$("#ingredients-section").text(data.Items[main_index].Ingredients);

	});
		
});