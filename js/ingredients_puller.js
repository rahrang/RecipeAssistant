// JavaScript Document
$(document).ready( function() {
	
	"use strict";
	
//	The URL of our Dynamo database on AWS
	var databaseURL = "https://elpwebsphe.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Recipes";
	
//	Change this if/when we publish the website
//	var webpageURL = "file:///C:/Users/Rahul/Desktop/CS160/prog03/";	
	
//	the function to pull from the database and update the html tags
	$.get(databaseURL, function(data) {
			
		// changes the content of the h2 tag with id "dish-name-INDEX" to the corresponding RecipeName in the database
		$("#recipe-title").text(data.Items[0].RecipeName);
				
		// changes the source of the img tag with id "dish-img-INDEX" to corresponding source URL in the database
		$("#recipe-image").attr("src", data.Items[0].ImageURL);  
				
		// changes the content of the p tag with id "ingredients-section" to corresponding recipe ingredients in the database
		$("#ingredients-section").text(data.Items[0].Ingredients);

	});	
	
});