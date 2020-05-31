// This is to activate the side nav.
$(document).ready(function () {
	$(".sidenav").sidenav();
});

// This is to start toggling through the criteria questions. 
if (i === 3) {
	clearInterval(timerInterval);
	quizcontentDiv.classList.toggle("collapse");
	quizscoreDiv.classList.toggle("collapse");
	activeDiv = quizscoreDiv;
	finalScore.innerHTML = secondsLeft;
	timerNav.innerHTML = secondsLeft;
} else {
	i = i + 1;
	loadQuestion(i);
}
