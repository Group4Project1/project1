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

// This is a global variable to help keep track of the current question.
var currentQuestion = 0;

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
		// Involing the nextQuestion function when "next" button is clicked.
		$("#buttonNext" + i).click(nextQuestion);
	}
	$("#criteria0").toggleClass("hideContent");
}

// This is to start toggling through the criteria questions.
function nextQuestion() {
	// These JQuery selectors use currentQuestion variable to toggle between questions.
	$("#criteria" + currentQuestion).toggleClass("hideContent");
	$("#criteria" + (currentQuestion + 1)).toggleClass("hideContent");
	currentQuestion += 1;
}
