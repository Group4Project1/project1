// Global array variable for criteria questions
var criteriaQuestions = [
	{
		question: "Please select your streaming apps.",
		options: {
			option: "Netflix",
			option: "Amazon Prime Video",
			option: "Hulu",
		},
	},
	{
		question: "Prefer a movie or series?",
		options: {
			option: "Movie",
			option: "TV Series",
		},
	},
	{
		question: "Select your favorite genres?",
		options: {
			option: "Action",
			option: "Drama",
			option: "Romance",
			option: "SciFi",
			option: "Thriller",
			option: "Children",
			option: "Comedy",
			option: "Other",
		},
	},
	{
		question: "Select prefered content rating.",
		options: {
			option: "G (Family Friendly)",
			option: "PG (Parental Guidance)",
			option: "PG-13 (Inappropriate for children under 13)",
			option: "R (Adult supervision for under 17)",
			option: "NC-17 (No one 17 and under)",
		},
	},
];

// Global variable to hold selections
var selections = {
	apps: [],
	type: [],
	genres: [],
	rating: [],
};
// Global array variable to store user selection
// var selectionCriteria = [];

// This is a global variable to help keep track of the current question.
var currentQuestion = 0;

// // Empty array variable to store user's criteria selections.
// var selectedChoices = [];

// This is to initialize any Materialize components.
$(document).ready(function () {
	$(".sidenav").sidenav();
});

// Invoking the startSelection() function to have only the first question show upon page load.
startSelection();

// This function will only show the first question upon page load.
function startSelection() {
	for (var i = 0; i < criteriaQuestions.length; i++) {
		$("#criteria" + i).toggleClass("hideContent");
		// Invoking the nextQuestion function when "next" button is clicked.
		$("#buttonNext" + i).click(nextQuestion);
	}
	$("#criteria0").toggleClass("hideContent");
}

// Check to see if app criteria is met?
function isAppCriteriaMet(watchOptions) {
	// for loop is interating throughout the watchOption response in the data array pulled from the API
	for (var i = 0; i < watchOptions.length; i++) {
		// this if statement will assign a true if the user's app selection is in the API response
		if (watchOptions[i].primaryText === selections.apps[0]) {
			return true;
		}
	}
	// outside of the for loop to ensure this part is executed for each watchOption interation.
	return false;
}

// Check to see if type criteria is met?
function isTypeCriteriaMet(titleType) {
	if (titleType === selections.type[0]) {
		return true;
	} else {
		return false;
	}
}

// Check to see if rating criteria is met?
function isRatingCriteriaMet(certificate) {
	if (certificate === selections.rating[0]) {
		return true;
	} else {
		return false;
	}
}

function makeAjaxcall() {
	// API key code for the IMBD website (via RapidAPI.com) @ title/find end point.
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
			var finalMovieID = movieIDArray[1];

			// API key code for the IMBD website (via RapidAPI.com) @ title/get-meta-data end point.
			var settings2 = {
				async: true,
				crossDomain: true,
				url:
					"https://imdb8.p.rapidapi.com/title/get-meta-data?&ids=" +
					finalMovieID,
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
				var appCriteria = isAppCriteriaMet(
					response[finalMovieID].waysToWatch.optionGroups[0].watchOptions
				);
				// invoking function to check type output - passing type response through isTypeCriteriaMet() function.
				var typeCriteria = isTypeCriteriaMet(
					response[finalMovieID].title.titleType
				);
				//invoking function to check rating output - passing ratingresponse through isRatingCriteriaMet() function.
				var ratingCriteria = isRatingCriteriaMet(
					response[finalMovieID].certificate
				);

				if (appCriteria && typeCriteria && ratingCriteria) {
					// JQuery data pull items are below
					
				}
			});
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
			// makeAjaxcall();
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
