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

// Empty array variable to store user's criteria selections.
var selectedChoices = [];

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

// This is to start toggling through the criteria questions.
function nextQuestion() {
	// Using this portion to push any user selections to the selectedChoices array.
	$("#criteria" + currentQuestion + " input").each(function () {
		// console.log("checking checkbox");
		var isChecked = $(this).is(":checked");
		if (isChecked) {
			selectedChoices.push($(this).val());
			console.log($(this).attr("data-key"));
			selections[$(this).attr("data-key")].push($(this).val());

			console.log("selected choices" + selectedChoices);

			localStorage.setItem(
				"selectionCriteria",
				JSON.stringify(selectedChoices)
			);
		}
	});
	// If-statement that will only allow users to proceed if they make at least one criteria selection per question.
	if (selectedChoices.length === 0) {
		// console.log("no checkboxes checked");
		var elem = document.getElementById("modal1");
		var instance = M.Modal.init(elem);
		instance.open();
	} else {
		// These JQuery selectors use currentQuestion variable to toggle between questions.
		// console.log("at least one checkbox checked");
		$("#criteria" + currentQuestion).toggleClass("hideContent");
		$("#criteria" + (currentQuestion + 1)).toggleClass("hideContent");
		currentQuestion += 1;
	}
	makeAjaxcall();
}

function makeAjaxcall() {
	// API key / code for the IMBD website (via RapidAPI.com)
	var settings = {
		async: true,
		crossDomain: true,
		url: "https://imdb8.p.rapidapi.com/title/get-meta-data?region=US",
		method: "GET",
		headers: {
			"x-rapidapi-host": "imdb8.p.rapidapi.com",
			"x-rapidapi-key": "5e47bf6ae1mshbf95622abb61188p16dfbcjsn7783b76209cb",
		},
	};

	$.ajax(settings).done(function (response) {
    
		// $("recommendations").toggleClass("hideContent");
		// $("#recommendations").html(
		// 	response.tt4154756.waysToWatch.optionGroups[0].displayName.watchOptions[0]
		// 		.primaryText
    // );
    
		/* if (selections are selected) {
      output matching API data
    } else {error message}
    */
	});
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
