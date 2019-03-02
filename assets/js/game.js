// Canvas and context definitions
var canvas = document.getElementById("game");
$("body").hide();
var ctx = canvas.getContext("2d");

var images = [];

// Utilities
function loadImages(imageArray) {
    let loaded = 0, needToBeLoaded = 0;
    for (let key in imageArray) {
        if (!imageArray.hasOwnProperty(key)) continue;
        needToBeLoaded++;
        console.log(imageArray[key] + " " + key);
        images[key] = new Image();
        images[key].src = "assets/img/" + imageArray[key];
        images[key].onload = function () {
            loaded++;
            if (loaded >= needToBeLoaded) $("body").fadeIn();
        };
    }
}

loadImages({
    "player": "player.png",
    "shark": "shark.png",
    "fish": "fish.png"
});

function render() {
    ctx.drawImage(images['player'], 10, 10, images['player'].width * .8, images['player'].height * .8);
    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);
