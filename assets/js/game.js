// Canvas and context definitions
var canvas = document.getElementById("game");
$(".page-wrapper").hide();
var ctx = canvas.getContext("2d");

var images = [];

var player = {
    position: {
        x: 0,
        y: 0
    },
    speed: 5
};

// Utilities
const DIRECTION = {
    'LEFT': 0,
    'RIGHT': 1,
    'TOP': 2,
    'BOTTOM': 3
};
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
            if (loaded >= needToBeLoaded) setTimeout(()=>{$(".page-wrapper").fadeIn()}, 350);
        };
    }
}

function movePlayer(direction) {
    switch (direction) {
        case DIRECTION.TOP:
            if(player.position.y - player.speed > 0) player.position.y -= player.speed;
            break;
        case DIRECTION.LEFT:
            if(player.position.x - player.speed > 0) player.position.x -= player.speed;
            break;
        case DIRECTION.BOTTOM:
            if(player.position.y + player.speed < canvas.height-images['player'].height) player.position.y += player.speed;
            break;
        case DIRECTION.RIGHT:
            if(player.position.x + player.speed < canvas.width-images['player'].width) player.position.x += player.speed;
            break;
        default:
            break;
    }
}

loadImages({
    "player": "player.png",
    "shark": "shark.png",
    "fish": "fish.png"
});

function render() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    // player.position.x++; player.position.y++;
    ctx.drawImage(images['player'], player.position.x, player.position.y, images['player'].width * .8, images['player'].height * .8);
    window.requestAnimationFrame(render);
}

document.addEventListener("keydown", e => {
    // console.log(e.keyCode);
    switch (e.keyCode) {
        case 37:
        case 65:
            movePlayer(DIRECTION.LEFT);
            break;
        case 38:
        case 67:
            movePlayer(DIRECTION.TOP);
            break;
        case 39:
        case 68:
            movePlayer(DIRECTION.RIGHT);
            break;
        case 40:
        case 83:
            movePlayer(DIRECTION.BOTTOM);
            break;
    }
});

window.requestAnimationFrame(render);
