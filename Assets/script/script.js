// Global variable to hold selections
var selections = {
	apps: [],
	type: [],
	genres: [],
	rating: [],
};

// This is a global variable to help keep track of the current question.
var currentQuestion = 0;

// Empty string variable that will be used to store the last movieID value from the 5 allowed API movie searches.
var lastMovieID = "";

// This is to initialize any Materialize components.
$(document).ready(function () {
	$(".sidenav").sidenav();
});

// Invoking the startSelection() function to have only the first question show upon page load.
startSelection();

// This function will only show the first question upon page load.
function startSelection() {
	for (var i = 0; i < 5; i++) {
		$("#criteria" + i).toggleClass("hideContent");
		// Invoking the nextQuestion function when "next" button is clicked.
		$("#buttonNext" + i).click(nextQuestion);
	}
	$("#criteria0").toggleClass("hideContent");
}

// Check to see if app criteria is met?
function isAppCriteriaMet(optionGroups) {
	// for loop is interating throughout the watchOption response in the data array pulled from the API
	for (var i = 0; i < optionGroups.length; i++) {
		for (var j = 0; j < optionGroups[i].watchOptions.length; j++) {
			// this if statement will assign a true if the user's app selection is in the API response
			if (optionGroups[i].watchOptions[j].primaryText === selections.apps[0]) {
				console.log("app criteria met");
				return true;
			}
		}
	}
	console.log("app criteria is not met");
	// outside of the for loop to ensure this part is executed for each watchOption interation.
	return false;
}

// Check to see if type criteria is met?
function isTypeCriteriaMet(titleType) {
	if (titleType === selections.type[0]) {
		console.log("type criteria met");
		return true;
	} else {
		console.log("type criteria is not met");
		return false;
	}
}

// Check to see if rating criteria is met?
function isRatingCriteriaMet(certificate) {
	if (
		certificate === selections.rating[0] ||
		certificate === "Not Rated" ||
		!certificate
	) {
		console.log("rating criteria met");
		return true;
	} else {
		console.log("rating criteria is not met");
		return false;
	}
}

function makeAjaxcall() {
	// 1st API Resource (A) - API key code for the IMBD website (via RapidAPI.com) @ title/find end point.
	var settings1 = {
		async: true,
		crossDomain: true,
		url: "https://imdb8.p.rapidapi.com/title/find?q=" + selections.genres[0],
		method: "GET",
		headers: {
			"x-rapidapi-host": "imdb8.p.rapidapi.com",
			"x-rapidapi-key": "5e47bf6ae1mshbf95622abb61188p16dfbcjsn7783b76209cb",
		},
	};
	// First ajax call with url source link 1
	$.ajax(settings1).done(function (response) {
		for (var i = 0; i < 5; i++) {
			var movieID = response.results[i].id;
			var movieIDArray = movieID.split("/");
			var finalMovieID = movieIDArray[2];

			// Is used to keep track of the las searched movie ID to trigger alternative recommendations.
			if (i === 4) {
				lastMovieID = finalMovieID;
				console.log("final movie ID set: " + lastMovieID);
			}

			console.log(finalMovieID);

			// setting a timeout of second per card
			setTimeout(
				function (id) {
					// 1st API resource (B) - API key code for the IMBD website (via RapidAPI.com) @ title/get-meta-data end point.
					var settings2 = {
						async: true,
						crossDomain: true,
						url: "https://imdb8.p.rapidapi.com/title/get-meta-data?&ids=" + id,
						method: "GET",
						headers: {
							"x-rapidapi-host": "imdb8.p.rapidapi.com",
							"x-rapidapi-key":
								"5e47bf6ae1mshbf95622abb61188p16dfbcjsn7783b76209cb",
						},
					};

					// Second ajax call wtih url source link 2
					$.ajax(settings2).done(function (response) {
						// invoking function to check app output - passing watch options array response through isAppCriteriaMet() function.
						console.log("checking criteria for: " + id);

						if (
							!Object.keys(response).length ||
							!Object.keys(response[id].waysToWatch).length ||
							response[id].waysToWatch["optionGroups"] === undefined
						) {
							return;
						}

						var appCriteria = isAppCriteriaMet(
							response[id].waysToWatch.optionGroups
						);
						// invoking function to check type output - passing type response through isTypeCriteriaMet() function.
						var typeCriteria = isTypeCriteriaMet(response[id].title.titleType);
						//invoking function to check rating output - passing ratingresponse through isRatingCriteriaMet() function.
						var ratingCriteria = isRatingCriteriaMet(response[id].certificate);

						if (appCriteria && typeCriteria && ratingCriteria) {
							console.log("all selection criteria is met");

							// variable with assigned JQuery data pulled items are below (building blocks for cards)
							var newCard = $("<div>").addClass("card cardWidth");
							var cardImageDiv = $("<div>").addClass("card-image");
							var cardContentDiv = $("<div>").addClass("card-content");
							var cardImage = $("<img>").attr(
								"src",
								response[id].title.image.url
							);
							var cardContentString = `${response[id].title.title} ${response[id].title.year} ${response[id].ratings.rating} ${selections.apps[0]}`;

							// Actually building the cards here
							cardImage.appendTo(cardImageDiv);
							cardContentDiv.text(cardContentString);
							cardImageDiv.appendTo(newCard);
							cardContentDiv.appendTo(newCard);
							newCard.appendTo($("#criteria4"));

							console.log("Card HTML: " + newCard.html());

							// the alternative movie listing will start here.
							// check to see if recommendations (#criteria4 div) is empty after last movies is pulled
						} else if (lastMovieID === id && $("$criteria4").is(":empty")) {
							// 2nd API resource
							var settings3 = {
								async: true,
								crossDomain: true,
								url:
									"https://api.themoviedb.org/3/movie/now_playing?api_key=eadfe5332a8e17800a0e3fe518057248&language=en-US&page=1",
								method: "GET",
							};
							// ajax call for the 2nd API - specifically for alternative flow
							$.ajax(settings3).done(function (response) {});

							// for loop to return 10 movies that from the "now playing" source
							for (var i = 0; i < 10; i++) {
								// enter the Jquery to create card elements
								response.results[i].original_title;
								response.results[i].poster_path;
								response.results[i].vote_average;
								response.results[i].release_date;
							}
						}
					});
				}.bind(this, finalMovieID),
				2000
			);
		}
	});
}

// This is to start toggling through the criteria questions.
function nextQuestion() {
	// this is a local variable to store the data key value.
	var dataKey = "";
	// Using this portion to push any user selections to the selectedChoices array.
	$("#criteria" + currentQuestion + " input").each(function () {
		// console.log("checking checkbox");
		var isChecked = $(this).is(":checked");
		// reassigning the dataKey variable to store the data-key array associated with the selection input.
		dataKey = $(this).attr("data-key");
		if (isChecked) {
			console.log(dataKey);
			selections[dataKey].push($(this).val());
		}
	});
	// moved console.log and local storage outside anonymous function to call local storage after all checkboxes per question are itterated through.
	console.log("selected choices:" + " " + selections[dataKey]);
	localStorage.setItem("selections", JSON.stringify(selections));

	// If-statement that will only allow users to proceed to the next question if they select only one item per criteria.This is done to control for ballooing API data pulls.
	if (selections[dataKey].length === 0 || selections[dataKey].length >= 2) {
		// console.log("no checkboxes checked");
		selections[dataKey] = [];
		var elem = document.getElementById("modal1");
		var instance = M.Modal.init(elem);
		instance.open();
	} else {
		// These JQuery selectors use currentQuestion variable to toggle between questions.
		// console.log("at least one checkbox checked");
		$("#criteria" + currentQuestion).toggleClass("hideContent");
		$("#criteria" + (currentQuestion + 1)).toggleClass("hideContent");
		currentQuestion += 1;
		if (currentQuestion === 4) {
			makeAjaxcall();
		}
	}
}

//local storage attempt

//   selectedChoices = selectionCriteria;

// $("buttonNext0").click(function (){
// 	localStorage.setItem("selectedChoices", json.stringify(selectionCriteria));
// }

// this function is to store user selections

// function userSelections() {
//   var appSelected = `${$("#app1").val()}`;

//   selectionCriteria.push(appSelected);
//   localStorage.setItem("selectionCriteria", json.stringify(selectionCriteria));
// }

//  QUESTIONS FOR TUTOR:

// WHERE SHOULD WE PUT THE LOCAL STORAGE CODE

//WHY IS IT NOT WORKING

// next button only to get to next page

// buttons that change color instead of check boxes and are connected to local storage
