
//Variables
var level = 1;
var completed = [];
var numOfOpenedImages = 0;
var lastOpenedImg;
var timeDecreasingInterval;
var startingTime;
var greenColorSaturation;



//Functions for game starting and images loading
window.onload = nextLevel;

function loadingImages() {
    let noOfImages = level * 4;
    let game = document.getElementById("game-row");
    for (let i = 1; i <= noOfImages; i++) {
        game.innerHTML +=
            `<div class="square" id="sq${i}" onclick="showImage(event)" ></div>`;
    }
    let imagePlacesArray = [];
    for (let i = 1; i <= noOfImages / 2; i++) {
        let placesArraySize = imagePlacesArray.length;
        do {
            let place = Math.floor(Math.random() * noOfImages) + 1;
            if (!imagePlacesArray.includes(place)) {
                imagePlacesArray.push(place);
                let div = document.getElementById(`sq${place}`);
                div.innerHTML = `<img class="game-images" id="sq${place}img" src="../img/${i}.png" alt="" >`;


            }
        } while (imagePlacesArray.length !== placesArraySize + 2)
    }
    updateInGameStats();
    changeAllClickableState(false);
}
function startGame() {
    let button = document.getElementById("btn-game-started");
    if (button.getAttribute("value") != "GAME STARTED") {
        startTime();
        button.setAttribute("value", "GAME STARTED");
    }
    changeAllClickableState(true);
}
function startTime() {
    let timeDiv = document.getElementById("time");
    let time = getTime();
    timeDecreasingInterval = setInterval(() => {
        if (--time === 0) {
            finishGame();
            //When time runs up all images lose clickable state and stats show up.


        }
        setTime(time);
        updateTimeBar();
    }, 1000)
}
function finishGame() {
    if (timeDecreasingInterval) {
        clearInterval(timeDecreasingInterval);
    }
    changeAllClickableState(false);
    showStats();
}


function newGame() {
    location.reload();
}
function nextLevel() {
    if(level===4){
        newGame();
        return;
    }
    clearGame();
    setTime(level * 7 + Math.pow(2, level));
    level++;
    refreshVariables();
    loadingImages();
    hideStats();
    refreshBtnGameStart();
    updateInGameStats();
    refreshGameStatsAnimation();
    refreshTimeBar();
    startingTime=getTime();
    greenColorSaturation=200;
}


//Functions for refreshing window

function refreshBtnGameStart() {
    document.getElementById("btn-game-started").setAttribute("value", "START GAME");
}
function clearGame() {
    let game = document.getElementById("game-row");
    game.innerHTML = "";
}

function refreshGameButton() {
    document.getElementById("btn-game-started").setAttribute("value", "START GAME");
}

function setTime(time) {
    let timeDiv = document.getElementById("time");
    let minutes = Math.floor(time / 60)
    timeDiv.innerHTML = minutes > 9 ? minutes : `0${minutes}` + ":" + (time % 60 > 9 ? time % 60 : "0" + time % 60);
}
function getTime() {
    let timeDiv = document.getElementById("time");
    let time = timeDiv.textContent;
    time = time.split(":");
    time = (Number(time[0]) * 60) + Number(time[1]);
    return time;
}
function refreshVariables() {
    completed = [];
    numOfOpenedImages = 0;
    lastOpenedImg = undefined;

}
function refreshGameStatsAnimation() {
    let element = document.getElementsByClassName("game-stats")[0];
    addElementClass(element,"running");
}
function refreshTimeBar(){
    let timeBar=document.getElementById("time-bar");
    timeBar.style.paddingLeft="0px";
    timeBar.style.width=0+"px";
}
function updateTimeBar(){
    let percentage=1/startingTime;
    let timeBar=document.getElementById("time-bar");

    
    timeBar.style.width=String(timeBar.offsetWidth+(percentage*timeBar.parentElement.offsetWidth)-0.5)+"px";
    greenColorSaturation-=(percentage*200);
    timeBar.style.backgroundColor=`rgb(247,${greenColorSaturation},0)`;
}


//Functions for manipulating events
function changeAllClickableState(state) {
    let divArray = document.getElementsByClassName("square");
    if (!state) {
        for (let i = 0; i < divArray.length; i++) {
            addElementClass(divArray[i],"unclickable");
            addElementClass(divArray[i].childNodes[0],"unclickable");
        }
    } else {
        for (let i = 0; i < divArray.length; i++) {
            removeElementClass(divArray[i],"unclickable");
            removeElementClass(divArray[i].childNodes[0],"unclickable");
            
        }
    }
}


function showImage(e) {
    let img = document.getElementById(`${e.target.id}${e.target.id.includes("img") ? "" : "img"}`);
    if (numOfOpenedImages === 2) {
        let images = document.getElementsByClassName("game-images");
        for (let i = 0; i < images.length; i++) {
            if (img.id !== images[i].id && !completed.includes(images[i].id)) {
                removeElementClass(images[i],"visible");
            }
        }
        lastOpenedImg = undefined;
        numOfOpenedImages = 0;
    }
    if (!img.className.includes("visible")) {
        addElementClass(img,"visible");
    }
    if (lastOpenedImg != undefined) {
        if (checkImages(lastOpenedImg, img)) {
            setImagesCompleted(lastOpenedImg, img);
            lastOpenedImg = undefined;
            numOfOpenedImages = -1;
            if (completed.length === level * 4) {
                finishGame();
            }
        } else {
            lastOpenedImg = img;
        }
    }
    else {
        lastOpenedImg = img;
    }
    numOfOpenedImages++;
}


//Functions for completing game logic

function checkImages(img1, img2) {
    if ((img1.src == img2.src) && (img1.id != img2.id)) {
        return true;
    }
    return false
}
function setImagesCompleted(img1, img2) {


    addElementClass(img1,"unclickable");
    addElementClass(img1.parentElement,"unclickable");
    addElementClass(img1.parentElement,"completed");



    addElementClass(img2,"unclickable");
    addElementClass(img2.parentElement,"unclickable");
    addElementClass(img2.parentElement,"completed");

    completed.push(img1.id);
    completed.push(img2.id);
    updateInGameStats();
}





//Functions for manipulation of final and in-game stats
function showStats() {
    let element = document.getElementsByClassName("game-stats")[0];
    element.className += " running visible";
    if (level * 2 === completed.length / 2) {
        document.getElementById("final-stats-title").innerHTML = "CONGRATS";
        document.getElementById("btn-next-level").setAttribute("style", "display:inline");
    }
    else {
        document.getElementById("final-stats-title").innerHTML = "GAME OVER";
        document.getElementById("btn-next-level").setAttribute("style", "display:none");
    }
    updateFinalStats();
}

function hideStats() {
    let element = document.getElementsByClassName("game-stats")[0];
    removeElementClass(element," running visible");
}

function updateFinalStats() {
    let remainingElement = document.getElementById("remaining-stats");
    let completedElement = document.getElementById("completed-stats");
    remainingElement.innerHTML = String(level * 2 - completed.length / 2);
    completedElement.innerHTML = String(completed.length / 2);
}
function updateInGameStats() {
    let remainingElement = document.getElementById("remaining-number");
    let completedElement = document.getElementById("completed-number");
    let levelElement=document.getElementById("level");
    remainingElement.innerHTML = String(level * 2 - completed.length / 2);
    completedElement.innerHTML = String(completed.length / 2);
    levelElement.innerHTML=`Level: ${level-1} ***Max: 3 levels (for now)***`;
}

//Generic funtions for adding and removing classes from elements

function addElementClass(element,newClassName){
    element.className+=" "+newClassName;
}
function removeElementClass(element,removedClassName){
    element.className=element.className.replace(new RegExp(`${removedClassName}`),"");
}