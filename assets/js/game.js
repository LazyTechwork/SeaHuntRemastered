// Canvas and context definitions
var canvas = document.getElementById("game");
$(".page-wrapper").hide();
var ctx = canvas.getContext("2d");

var player = {
    position: {
        x: 30,
        y: canvas.height / 2
    },
    speed: 4,
    points: 0
};

var game = {
    'isRunning': false,
    'entity_speed': 3,
    'isGameOver': false
};

var keyState = {
    'left': false,
    'right': false,
    'top': false,
    'bottom': false
};

var images = [], sharks = [], fish = [], movableObjects = [];

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
            if (loaded >= needToBeLoaded) setTimeout(startGame, 350);
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

function isInRange(min1, min2, rangeIn, rangeOut) {
    return (min1 >= rangeIn && min1 <= rangeOut) || (min2 >= rangeIn && min2 <= rangeOut);
}

function isCollides(enemy, eImg) {
    return isInRange(player.position.x, player.position.x + images['player'].width, enemy.x, enemy.x + eImg.width) && isInRange(player.position.y - images['player'].height, player.position.y, enemy.y - eImg.height, enemy.y);
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function restartGame() {
    $('.page-wrapper').fadeOut(100);
    destroyGame();
    startGame();
}

function startGame() {
    setTimeout(() => {
        sharkSpawn();
        fishSpawn();
        window.requestAnimationFrame(render);
        game.isRunning = true;
        $(".page-wrapper").fadeIn();
    }, 250);
}

function gameOver() {
    if (!game.isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showPoints();
    ctx.font = "100px Roboto";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.fillText("Game over", canvas.width / 2, canvas.height / 2);
    destroyGame();
}

function showPoints() {
    ctx.font = "16px Roboto";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("Points: " + player.points, 20, 30);
}

function destroyGame() {
    game.isRunning = false;
    game.isGameOver = false;
    keyState = {
        'left': false,
        'right': false,
        'top': false,
        'bottom': false
    };
    sharks = [];
    fish = [];
    movableObjects = [];
    player = {
        position: {
            x: 30,
            y: canvas.height / 2
        },
        speed: 4,
        points: 0
    };
    game = {
        isRunning: false,
        entity_speed: 3,
        isGameOver: false
    };
    player.position.y -= images['player'].height / 2;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (keyState.left) movePlayer(DIRECTION.LEFT);
    if (keyState.right) movePlayer(DIRECTION.RIGHT);
    if (keyState.bottom) movePlayer(DIRECTION.BOTTOM);
    if (keyState.top) movePlayer(DIRECTION.TOP);
    movableObjects = [{obj: {x: player.position.x, y: player.position.y}, image: images['player']}];
    sharks.forEach((shark, i) => {
        shark.x -= game.entity_speed;
        ctx.drawImage(images['shark'], shark.x, shark.y, images['shark'].width, images['shark'].height);
        if (shark.x < -images['shark'].width) sharks.splice(i, 1);
        movableObjects.push({
            obj: shark,
            image: images['shark']
        });
        if (isCollides(shark, images['shark'])) {
            game.isGameOver = true;
        }
    });
    fish.forEach((fishh, i) => {
        fishh.x -= game.entity_speed;
        ctx.drawImage(images['fish'], fishh.x, fishh.y, images['fish'].width, images['fish'].height);
        if (fishh.x < -images['fish'].width) fish.splice(i, 1);
        movableObjects.push({
            obj: fishh,
            image: images['fish']
        });
        if (isCollides(fishh, images['fish'])) {
            fish.splice(i, 1);
            player.points++;
        }
    });


    // ctx.lineWidth = 2;
    // movableObjects.forEach(obj => {
    //     ctx.strokeRect(obj.obj.x, obj.obj.y, obj.image.width, obj.image.height);
    // });


    ctx.drawImage(images['player'], player.position.x, player.position.y, images['player'].width, images['player'].height);

    showPoints();
    gameOver();
    if (game.isRunning) window.requestAnimationFrame(render);
}

function sharkSpawn() {
    if (game.isRunning)
        sharks.push({
            x: canvas.width + images['shark'].width,
            y: randomInteger(0, canvas.width - images['shark'].width)
        });
}

function fishSpawn() {
    if (game.isRunning)
        fish.push({
            x: canvas.width + images['fish'].width,
            y: randomInteger(0, canvas.width - images['fish'].width)
        });
}

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
]

// =============== Preloading ===============
loadImages({
    "player": "player.png",
    "shark": "shark.png",
    "fish": "fish.png"
});

// Image scaling
images['player'].width *= .8;
images['shark'].width *= 1.3;
images['fish'].width *= .5;
images['player'].height *= .8;
images['shark'].height *= 1.3;
images['fish'].height *= .5;

setInterval(() => {
    sharkSpawn()
}, 2500);
setInterval(() => {
    fishSpawn()
}, 1500);
