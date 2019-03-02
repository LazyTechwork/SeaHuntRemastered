// Canvas and context definitions
var canvas = document.getElementById("game");
$(".page-wrapper").hide();
var ctx = canvas.getContext("2d");

var player = {
    position: {
        x: 30,
        y: canvas.height/2
    },
    speed: 2,
    points: 0
};

var game = {
    'isRunning': true
};

var keyState = {
    'left': false,
    'right': false,
    'top': false,
    'bottom': false
};

var images = [], sharks = [], fish = [];

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
            if (loaded >= needToBeLoaded) setTimeout(() => {
                $(".page-wrapper").fadeIn()
            }, 350);
        };
    }
}

function movePlayer(direction) {
    switch (direction) {
        case DIRECTION.TOP:
            if (player.position.y - player.speed > 0) player.position.y -= player.speed;
            break;
        case DIRECTION.LEFT:
            if (player.position.x - player.speed > 0) player.position.x -= player.speed;
            break;
        case DIRECTION.BOTTOM:
            if (player.position.y + player.speed < canvas.height - images['player'].height) player.position.y += player.speed;
            break;
        case DIRECTION.RIGHT:
            if (player.position.x + player.speed < canvas.width - images['player'].width) player.position.x += player.speed;
            break;
        default:
            break;
    }
}

function isInRange(x1, x2, x3, x4) {
    console.log((x1 >= x3 || x1 <= x4 || x2 >= x3 || x2 <= x4));
    return x1 >= x3 || x1 <= x4 || x2 >= x3 || x2 <= x4;
}

function isCollides(enemy, eImg) {
    return isInRange(player.x, player.x + images['player'].width, enemy.x, enemy.x + eImg.width) && isInRange(player.y, player.y + images['player'].height, enemy.y, enemy.y + eImg.height);
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

loadImages({
    "player": "player.png",
    "shark": "shark.png",
    "fish": "fish.png"
});

images['player'].width *= .8;
images['shark'].width *= 1.3;
images['fish'].width *= .5;
images['player'].height *= .8;
images['shark'].height *= 1.3;
images['fish'].height *= .5;

player.position.y -= images['player'].height/2;

function render() {
    if(!game.isRunning) return window.requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (keyState.left) movePlayer(DIRECTION.LEFT);
    if (keyState.right) movePlayer(DIRECTION.RIGHT);
    if (keyState.bottom) movePlayer(DIRECTION.BOTTOM);
    if (keyState.top) movePlayer(DIRECTION.TOP);
    // player.position.x++; player.position.y++;
    sharks.forEach((shark, i) => {
        shark.x--;
        ctx.drawImage(images['shark'], shark.x, shark.y, images['shark'].width, images['shark'].height);
        if (shark.x < -images['shark'].width) sharks.splice(i, 1);
        if (isCollides(shark, images['shark'])) location.refresh();
    });
    fish.forEach((fishh, i) => {
        fishh.x--;
        ctx.drawImage(images['fish'], fishh.x, fishh.y, images['fish'].width, images['fish'].height);
        if (isCollides(fishh, images['fish'])) player.points++;
        if (fishh.x < -images['fish'].width) fish.splice(i, 1);
    });
    ctx.drawImage(images['player'], player.position.x, player.position.y, images['player'].width, images['player'].height);

    ctx.font = "14pt Roboto";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText("Points: "+player.points, canvas.width-10, 20);
    window.requestAnimationFrame(render);
}

function sharkSpawn() {
    sharks.push({
        x: canvas.width + images['shark'].width,
        y: randomInteger(0, canvas.width - images['shark'].width)
    });
}

function fishSpawn() {
    fish.push({
        x: canvas.width + images['fish'].width,
        y: randomInteger(0, canvas.width - images['fish'].width)
    });
}

setInterval(() => {
    sharkSpawn()
}, 2500);
setInterval(() => {
    fishSpawn()
}, 1500);

document.addEventListener("keydown", e => {
    // console.log(e.keyCode);
    switch (e.keyCode) {
        case 37:
        case 65:
            keyState.left = true;
            break;
        case 38:
        case 67:
            keyState.top = true;
            break;
        case 39:
        case 68:
            keyState.right = true;
            break;
        case 40:
        case 83:
            keyState.bottom = true;
            break;
    }
});

document.addEventListener("keyup", e => {
    // console.log(e.keyCode);
    switch (e.keyCode) {
        case 37:
        case 65:
            keyState.left = false;
            break;
        case 38:
        case 67:
            keyState.top = false;
            break;
        case 39:
        case 68:
            keyState.right = false;
            break;
        case 40:
        case 83:
            keyState.bottom = false;
            break;
        default:
            keyState.left = false;
            keyState.top = false;
            keyState.right = false;
            keyState.bottom = false;
            break;
    }
});

sharkSpawn();
fishSpawn();
window.requestAnimationFrame(render);
