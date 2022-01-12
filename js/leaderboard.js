var skip = 0;
var latestReq = Date.now();
const searchbox = document.getElementById("userSearch");
const resultCard = document.getElementById("searchCard");
const raitinglist = document.getElementById("rating-list");
const resultZone = document.getElementById("resultWrapper");
const title = document.getElementById("leaderboardTitle");
searchbox.addEventListener("input", function (e) {
    onInputChange(this.value);
});

getLeaderboard();

function listMaker(data) {
    for (var i = 0; i < data.length; i++) {
        rankingSlotMaker(i, data[i].username, data[i].elo);
    }
    skip += data.length;
    window.onscroll = function () {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            getLeaderboard();
        }
    };
}
function rankingSlotMaker(listpos, name, elo) {
    listpos += skip;
    var temp = document.getElementById("leaderboardCard");
    var clone = temp.content.firstElementChild.cloneNode(true);

    var placment = clone.getElementsByClassName("placement")[0];
    var nameTag = clone.getElementsByClassName("rated-name")[0];
    var eloTag = clone.getElementsByClassName("rated-elo")[0];
    var suptext = clone.getElementsByClassName("suptext")[0];

    clone.classList.add(classgiver(listpos));
    suptext.innerText = superscriptMaker(listpos + 1);
    placment.innerText = listpos + 1;
    nameTag.innerText = name;
    nameTag.setAttribute("href", `/user/${name}`)
    eloTag.innerText = elo;
    raitinglist.appendChild(clone);
}
function getLeaderboard() {
    window.onscroll = '';
    fetch(`/api/leaderboard?skip=${skip}`).then(response => response.json()).then(data => listMaker(data));
}
function superscriptMaker(number) {
    if ((number % 100) - number % 10 === 10) {
        return "th";
    }
    else if (number % 10 === 1) {
        return "st";
    }
    else if (number % 10 === 2) {
        return "nd";
    }
    else if (number % 10 === 3) {
        return "rd";
    }
    else {
        return "th";
    }
}
function classgiver(number) {
    number = number + 1;
    if (number === 1) {
        return "first-place";
    }
    else if (number === 2) {
        return "second-place";
    }
    else if (number === 3) {
        return "third-place"
    } else {
        return "nth-place"
    }
}

function onInputChange(value) {
    if (value == '') {
        latestReq = Date.now();
        raitinglist.setAttribute("style", "display: grid;");
        title.innerText = "Player Leaderboard";
        title.setAttribute("class", "leaderboard-title");
        searchbox.setAttribute("class", "user-search user-search-slide-down");
        resultZone.setAttribute("class", "search-results-wrapper");
        raitinglist.setAttribute("class", "rating-list");

    }
    else {
        fetch(`/api/search?input=${value}&reqTime=${Date.now()}`).then(response => response.json()).then(data => searchFormater(data));
        // setTimeout(() => {  },0);
        resultZone.setAttribute("class", "search-results-wrapper slide-up")
        title.setAttribute("class", "hidden-title");
        searchbox.setAttribute("class", "user-search-slide-up");
        raitinglist.setAttribute("class", "rating-list-hidden");
    }
}

function searchFormater(data) {
    if (data.reqTime > latestReq) {
        resultZone.innerHTML = "";
        if (data.users.length === 0) {
            console.log("nothing"); //add no results page
            let noResTemp = document.getElementById("noResults");
            let clone = noResTemp.content.firstElementChild.cloneNode(true);
            resultZone.appendChild(clone);
        }
        else {
            for (let i = 0; i < data.users.length; i++) {
                let clone = resultCard.content.firstElementChild.cloneNode(true);
                let name = clone.getElementsByClassName("name-wrapper")[0];
                let elo = clone.getElementsByTagName("p")[0];

                name.innerText = data.users[i].username;
                name.setAttribute("href", `/user/${data.users[i].username}`)
                elo.innerText = `${data.users[i].elo} ELO`;

                resultZone.appendChild(clone);
            }
        }
    }
}