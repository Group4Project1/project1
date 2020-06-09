$(document).ready(function () {
	// Global variable to hold selections
	var selections = {
		apps: [],
		type: [],
		genres: [],
		rating: [],
	};

	//   execute this function to make something wait
	const wait = (time) => {
		time = time ? time : 300;
		return new Promise((resolve) => {
			console.log(`executing set time out with the delay ${time}.`);
			return setTimeout(resolve, time);
		});
	};
	// This is a global variable to help keep track of the current question.
	var currentQuestion = 0;
	// Empty string variable that will be used to store the last movieID value from the 5 allowed API movie searches.
	var lastMovieID = "";
	// This is to initialize any Materialize components.
	$(".sidenav").sidenav();
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
				//    ensure to validate if this is a truthy value/string before trying to ren tolowerCase on it.
				if (
					optionGroups[i].watchOptions[j].primaryText &&
					optionGroups[i].watchOptions[j].primaryText.toLowerCase() ===
						selections.apps[0].toLowerCase()
				) {
					console.log(
						"Primary Text:",
						optionGroups[i].watchOptions[j].primaryText
					);
					console.log("Selection App:", selections.apps[0]);
					return true;
				}
			}
		}
		console.log("app criteria is not met for group:", optionGroups);
		// outside of the for loop to ensure this part is executed for each watchOption interation.
		return false;
	}

	// Check to see if type criteria is met?
	function isTypeCriteriaMet(titleType) {
		if (titleType.toLowerCase() === selections.type[0].toLowerCase()) {
			console.log("type criteria met");
			return true;
		} else {
			console.log("titleType:", titleType);
			console.log("selection type:", selections.type[0]);
			console.log("type criteria is not met");
			return false;
		}
	}

	// Check to see if rating criteria is met?
	function isRatingCriteriaMet(certificate) {
		if (
			(certificate &&
				selections.rating[0] &&
				certificate.toLowerCase() === selections.rating[0].toLowerCase()) ||
			certificate === "Not Rated" ||
			!certificate
		) {
			console.log("rating criteria met");
			return true;
		} else {
			console.log("certificate:", certificate);
			console.log("selections rating:", selections.rating[0]);
			console.log("rating criteria is not met");
			return false;
		}
	}

	function triggerAltMovieFlow(id) {
		if (lastMovieID === id && $("#altRecs").is(":empty")) {
			$("#message").toggleClass("hideContent");
			// 2nd API resource
			var settings3 = {
				async: true,
				crossDomain: true,
				url:
					"https://api.themoviedb.org/3/movie/now_playing?api_key=eadfe5332a8e17800a0e3fe518057248&language=en-US&page=1",
				method: "GET",
			};
			// ajax call for the 2nd API - specifically for alternative flow
			$.ajax(settings3).done(function (response) {
				// for loop to return 10 movies that from the "now playing" source
				for (var i = 0; i < 10; i++) {
					// variable with assigned JQuery data pulled items are below (building blocks for cards)
					var newCard2 = $("<div>").addClass("card cardWidth col s8 m5 l3");
					var cardImageDiv2 = $("<div>").addClass("card-image");
					var cardContentDiv2 = $("<div>").addClass("card-content");
					var cardImage2 = $("<img>").attr(
						"src",
						"https://image.tmdb.org/t/p/original" +
							response.results[i].poster_path
					);
					var cardContentString2 = `${response.results[i].original_title}<br/>Released: ${response.results[i].release_date}<br/>Rating: ${response.results[i].vote_average}`;

					// Actually building the cards here
					cardImage2.appendTo(cardImageDiv2);
					cardContentDiv2.html(cardContentString2);
					cardImageDiv2.appendTo(newCard2);
					cardContentDiv2.appendTo(newCard2);
					newCard2.appendTo($("#altRecs"));
				}
			});
		}
	}

	async function makeAjaxcall() {
		// 1st API Resource (A) - API key code for the IMBD website (via RapidAPI.com) @ title/find end point.
		var settings1 = {
			async: true,
			crossDomain: true,
			url: "https://imdb8.p.rapidapi.com/title/find?q=" + selections.genres[0],
			method: "GET",
			headers: {
				"x-rapidapi-host": "imdb8.p.rapidapi.com",
				"x-rapidapi-key": "456154aefamsha20a54fea9424ecp16446fjsncf802b97ec90",
			},
		};
		// First ajax call with url source link 1
		$.ajax(settings1).done(async (response) => {
			for (var i = 0; i < 5; i++) {
				var titleURL = response.results[i].id;
				var titleArray = titleURL.split("/");
				var movieID = titleArray[2];

				// Is used to keep track of the las searched movie ID to trigger alternative recommendations.
				if (i === 4) {
					lastMovieID = movieID;
					console.log("final movie ID set: " + lastMovieID);
				}
				await apiCallAsync(movieID);
				await wait(500);
			}
		});
		// Gage- to test only 1 movie
		// await apiCallAsync("tt0194314");
	}
	let apiCallAsync = async (id) => {
		// setting a timeout of second per card
		console.log("performing API call for ID: ", id);
		// 1st API resource (B) - API key code for the IMBD website (via RapidAPI.com) @ title/get-meta-data end point.
		var settings2 = {
			async: true,
			crossDomain: true,
			url: "https://imdb8.p.rapidapi.com/title/get-meta-data?&ids=" + id,
			method: "GET",
			headers: {
				"x-rapidapi-host": "imdb8.p.rapidapi.com",
				"x-rapidapi-key": "456154aefamsha20a54fea9424ecp16446fjsncf802b97ec90",
			},
		};

		// Second ajax call wtih url source link 2
		$.ajax(settings2).done((response) => {
			// invoking function to check app output - passing watch options array response through isAppCriteriaMet() function.

			if (
				!Object.keys(response).length ||
				!Object.keys(response[id].waysToWatch).length ||
				response[id].waysToWatch["optionGroups"] === undefined
			) {
				console.log("invalid output, breaking out. Response:", response); //gage
				triggerAltMovieFlow(id);
				return;
			}

			var appCriteria = isAppCriteriaMet(response[id].waysToWatch.optionGroups);
			// invoking function to check type output - passing type response through isTypeCriteriaMet() function.
			var typeCriteria = isTypeCriteriaMet(response[id].title.titleType);
			//invoking function to check rating output - passing ratingresponse through isRatingCriteriaMet() function.
			var ratingCriteria = isRatingCriteriaMet(response[id].certificate);

			if (appCriteria && typeCriteria && ratingCriteria) {
				// console.log("all selection criteria is met");

				// variable with assigned JQuery data pulled items are below (building blocks for cards)
				var newCard = $("<div>").addClass("card cardWidth col s8 m5 l3");
				var cardImageDiv = $("<div>").addClass("card-image");
				var cardContentDiv = $("<div>").addClass("card-content");
				var cardImage = $("<img>").attr("src", response[id].title.image.url);
				var cardContentString = `${response[id].title.title}<br/>Released: ${response[id].title.year}<br/>Rating: ${response[id].ratings.rating}<br/>Available: ${selections.apps[0]}`;

				// Actually building the cards here
				cardImage.appendTo(cardImageDiv);
				cardContentDiv.html(cardContentString);
				cardImageDiv.appendTo(newCard);
				cardContentDiv.appendTo(newCard);
				newCard.appendTo($("#altRecs"));

				console.log("Card HTML: " + newCard.html());

				// the alternative movie listing will start here.
				// check to see if recommendations (#criteria4 div) is empty after last movies is pulled
			} else {
				triggerAltMovieFlow(id);
			}
		});
	};
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

	//  QUESTIONS FOR TUTOR:
	// WHERE SHOULD WE PUT THE LOCAL STORAGE CODE
	// WHY IS IT NOT WORKING
	// next button only to get to next page
	// buttons that change color instead of check boxes and are connected to local storage
});
