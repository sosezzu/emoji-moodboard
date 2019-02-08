const plants = ['🌵', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🥬', '🍓', '🍎', '🍀', '🎋', '🍃', '🍂', '🍁', '🍄', '🌾',
    '🌷', '🌹', '🌺', '🌸', '🌼', '🌻', '🥦', '🌰', '💩', '🦊', '🐹', '🐰', '🦉', '🐞', '🐝', '🐛', '🐿', '🦔', '🦝',];
let forest = [];
let pinned = {};

//simplified appending of text elements to DOM
function elt(type) {
    const ele = document.createElement(type);
    for (let i = 1; i < arguments.length; i++) {
        let child = arguments[i];
        if (typeof child === "string") {
            child = document.createTextNode(child);
        }
        ele.appendChild(child);
    }
    return ele;
}

//generates random forest
function forestation() {
    //if forest was inputed, use that forest
    if (document.getElementById("inputForest").value !== "" && forest.length === 0) {
        forest = [...document.getElementById("inputForest").value];
    }
    //if a forest wasn't inputed by user, randomize
    else {
        for (let i = 0; i < 64; i++) {
            forest[i] = plants[Math.floor(Math.random() * plants.length)];
        }
        //if old forest had pinned elements, keep pinned elements
        const oldForest = document.getElementsByClassName("cell");
        for (let i = 0; i < oldForest.length; i++) {
            if (oldForest[i].classList.contains("pinned")) {
                pinned[i] = oldForest[i];
                forest[i] = oldForest[i].value;
            }
        }
    }
}

//clearing appended DOM nodes
function clear() {
    while (document.getElementById("sim").hasChildNodes()) {
        document.getElementById("sim").removeChild(document.getElementById("sim").lastChild);
    }
    if (document.querySelector("#pushtray div")) {
        document.getElementById("pushtray").removeChild(document.querySelector("#pushtray div"));
    }
}

//calculates simpsons index of forest, displays notification if index is too low
function simpsons() {
    const index = 1 - Object.entries(
        forest.reduce((counts, emoji) =>
            ({ ...counts, [emoji]: (counts[emoji] || 0) + 1 }),
            {}
        )).reduce(([top, bottom], [species, count]) =>
            [top + (count * (count - 1)), bottom + count], [0, 0]).reduce((sumLilN, bigN) =>
                sumLilN / (bigN * (bigN - 1)));
    const notif = document.getElementById("pushtray");
    if (index < .7) {
        notif.appendChild(elt('div')).appendChild(elt('p', "WARNING: Simpson's Index Dropped to " + index));
        notif.style.display = 'block';
        notif.style.background = 'red';
        notif.style.color = 'white';
        notif.style.position = 'fixed';
        notif.style.position = 'fixed';
        notif.style.top = '0';
        notif.style.right = '0';
        notif.style.zIndex = '100';
    }
    else {
        notif.style.display = 'none';
    }
    return index;
}

//toggles pinning
function pin() {
    const cell = window.event.target;
    if (cell.classList.contains("cell")) {
        if (cell.classList.contains("pinned")) {
            cell.classList.remove("pinned");
        }
        else {
            cell.classList.add("pinned");
        }
    }
}

//when restart button is clicked, reset
function restart() {
    //clear everything
    clear();
    pinned = {};
    forest = [];

    //hide and make visible
    document.getElementById("sim").classList.add("hidden");
    document.getElementById("intro").classList.remove("hidden");
    document.getElementById("inputForest").value = "";
}
//when generate button is clicked, generate forest and display it
function generate() {
    //handles the cell randomization and checking for pinned cells/user input
    forestation();

    //clears unneeded DOM elements 
    clear();
    //on click, makes intro invisible, sim visible
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("sim").classList.remove("hidden");

    //adding new DOM elements
    //simpsons
    document.querySelector("#sim").appendChild(elt('p', "current Simpson's index is: " + simpsons()));
    //forest
    const forestDiv = elt('div');
    forestDiv.id = "forest";
    document.querySelector("#sim").appendChild(forestDiv);
    for (let i = 0; i < 8; i++) {
        const row = elt('p');
        for (let j = 0; j < 8; j++) {
            //if not a pinned cell, create new cell using array
            if (!pinned[8 * i + j]) {
                const cell = elt('span', forest[8 * i + j]);
                cell.classList.add("cell");
                row.appendChild(cell);
            }
            //if a pinned cell, use pinned cell
            else {
                row.appendChild(pinned[8 * i + j]);
            }
        }
        row.classList.add("row");
        row.onclick = function () { pin(); };
        document.querySelector("#forest").appendChild(row);
    }
    //generate button
    const generateButton = elt('BUTTON', 'generate');
    generateButton.addEventListener("click", generate, false);
    document.querySelector("#sim").appendChild(generateButton);
    //restart button
    const restartButton = elt('BUTTON', 'restart');
    restartButton.addEventListener("click", restart, false);
    document.querySelector("#sim").appendChild(restartButton);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementsByTagName("button")[0].addEventListener("click", generate, false);
});
