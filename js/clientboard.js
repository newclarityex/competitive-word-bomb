fetch('/api/leaderboard').then(response => response.json()).then(data => listmaker(data));
var raitinglist = document.getElementById("rating-list")
function listmaker(data) {
    for (var i = 0; i < data.length; i++) {
        rankingSlotMaker(i, data[i].username, data[i].elo);
    }
}
function rankingSlotMaker(listpos, name, elo){
    var temp = document.getElementsByTagName("template")[0];
    var clone = temp.content.firstElementChild.cloneNode(true);
    var spans = clone.querySelectorAll("span");
    var suptext = spans[1].querySelectorAll("sub");
    clone.classList.add(classgiver(listpos))
    suptext[0].innerText = superscriptMaker(listpos + 1);
    spans[0].innerText = listpos + 1;
    spans[2].innerText = name;
    spans[3].innerText = elo;
    raitinglist.appendChild(clone);
}
function superscriptMaker(number){
    number = Math.floor((number / Math.pow(10, 1 - 1)) % 10); // this returns the first digit of a number
    if (number === 1) {
        return "st";
    }
    else if (number === 2) {
        return "nd";
    }
    else if (number === 3) {
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