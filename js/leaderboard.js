var skip = 0;
var raitinglist = document.getElementById("rating-list");
var latestReq = '';
const searchbox = document.getElementById("userSearch");

searchbox.addEventListener("input", function (e) {
    onInputChange(this.value);
});

getLeaderboard();

function listMaker(data) {
    for (var i = 0; i < data.length; i++) {
        rankingSlotMaker(i, data[i].username, data[i].elo);
    }
    skip += data.length;
    window.onscroll = function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            getLeaderboard();
        }
    };
}
function rankingSlotMaker(listpos, name, elo){
    listpos += skip;
    var temp = document.getElementsByTagName("template")[0];
    var clone = temp.content.firstElementChild.cloneNode(true);

    var placment = clone.getElementsByClassName("placement")[0];
    var nameTag = clone.getElementsByClassName("rated-name")[0];
    var eloTag = clone.getElementsByClassName("rated-elo")[0];
    var suptext = clone.getElementsByClassName("suptext")[0];

    clone.classList.add(classgiver(listpos));
    suptext.innerText = superscriptMaker(listpos + 1);
    placment.innerText = listpos + 1;
    nameTag.innerText = name;
    nameTag.setAttribute("href",`/user/${name}`)
    eloTag.innerText = elo;
    raitinglist.appendChild(clone);
}
function getLeaderboard() {
    window.onscroll = '';
    fetch(`/api/leaderboard?skip=${skip}`).then(response => response.json()).then(data => listMaker(data));
}
function superscriptMaker(number){
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
    else if(number === 2){
        return "second-place";
    }
    else if (number === 3) {
        return "third-place"
    } else {
        return "nth-place"
    }
}

function onInputChange(value) {
    //TODO fetch request and stuff
    fetch(`/api/search?name=${value}`).then(response => response.json()).then(data => console.log(data));
}