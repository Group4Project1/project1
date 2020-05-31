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

// This is to activate the side nav.
$(document).ready(function () {
	$(".sidenav").sidenav();
});

// This is to start toggling through the criteria questions.
function nextQuestion() {}

// if (i === 3) {
// 	clearInterval(timerInterval);
// 	quizcontentDiv.classList.toggle("collapse");
// 	quizscoreDiv.classList.toggle("collapse");
// 	activeDiv = quizscoreDiv;
// 	finalScore.innerHTML = secondsLeft;
// 	timerNav.innerHTML = secondsLeft;
// } else {
// 	i = i + 1;
// 	loadQuestion(i);
// }
