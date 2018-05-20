// JavaScript source code

var currentLVL = 0;

var goals = [];
var blocks2 = [];
var player;

var goalBlocks = 0;
var won = 0;

var collideLeft = false;
var collideRight = false;
var collideUp = false;
var collideDown = false;

var ctx;

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        currentLVL = Math.floor(Math.random() * mapsArray.length);
        this.canvas.width = mapsArray[currentLVL].mapGrid[0].length * 30;
        this.canvas.height = mapsArray[currentLVL].mapGrid.length * 30;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        
        for (index = 0; index < mapsArray[currentLVL].mapGrid.length; index++) {
            for (index2 = 0; index2 < mapsArray[currentLVL].mapGrid[index].length; index2++) {

                switch (mapsArray[currentLVL].mapGrid[index][index2].toString()) {
                    case "W":
                        blocks2.push(new allBlocks(30, 30, "black", index2 * 30, index * 30, index2, index, "wall"));
                        
                        break;
                    case "G":
                        goals.push(new allBlocks(30, 30, "grey", index2 * 30, index * 30, index2, index, "goal"));
                        goalBlocks += 1;
                        
                        break;

                    case "B":
                        blocks2.push(new allBlocks(30, 30, "red", index2 * 30, index * 30, index2, index, "move"));
                        
                        break;

                    case "P":
                        player = new playerBlock(30, 30, "green", index2 * 30, index * 30, index2, index);
                        
                        break;

                    default:
                        break;
                }
                
            }
           
        }

        window.addEventListener("keydown", function (e) {
            if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
            gameArea.key = e.keyCode;
        })

        for (var l = 0; l < blocks2.length; l++) {
            blocks2[l].collide();
        }

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

class allBlocks {
    constructor(width, height, color, x, y, indexX, indexY, type) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
        this.x = x;
        this.y = y;
        this.positionX = indexX;
        this.positionY = indexY;

        this.collideLeft = false;
        this.collideRight = false;
        this.collideUp = false;
        this.collideDown = false;
       
        this.update = function () {
            this.move();
            ctx = gameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
        this.move = function () {
            if (this.type == "move") {
                if (this.positionX == player.positionX && this.positionY == player.positionY) {
                    if (this.positionX < player.formerPositionX && this.positionY == player.formerPositionY && this.collideLeft == false) {
                        this.x -= 30;
                        this.positionX -= 1;
                    }
                    if (this.positionX > player.formerPositionX && this.positionY == player.formerPositionY && this.collideRight == false) {
                        this.x += 30;
                        this.positionX += 1;
                    }
                    if (this.positionY < player.formerPositionY && this.positionX == player.formerPositionX && this.collideUp == false) {
                        this.y -= 30;
                        this.positionY -= 1;
                    }
                    if (this.positionY > player.formerPositionY && this.positionX == player.formerPositionX && this.collideDown == false) {
                        this.y += 30;
                        this.positionY += 1;
                    }
                }
                this.collideLeft = false;
                this.collideRight = false;
                this.collideUp = false;
                this.collideDown = false;

                this.collide();
            }
        };
        this.collide = function () {
            for (var i = 0; i < blocks2.length; i++) {
                var myX = this.positionX;
                var myY = this.positionY;
                var otherX = blocks2[i].positionX;
                var otherY = blocks2[i].positionY;

                

                if (blocks2[i].type != "goal") {
                    if (otherX == myX - 1 && otherY == myY) {
                        this.collideLeft = true;
                    }
                    if (otherX == myX + 1 && otherY == myY) {
                        this.collideRight = true;
                    }
                    if (otherY == myY - 1 && otherX == myX) {
                        this.collideUp = true;
                    }
                    if (otherY == myY + 1 && otherX == myX) {
                        this.collideDown = true;
                    }
                }
            }
        }
    }
}

class playerBlock {
    constructor(width, height, color, x, y, indexX, indexY) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
        this.formerPositionX = indexX;
        this.formerPositionY = indexY;
        this.positionX = this.formerPositionX;
        this.positionY = this.formerPositionY;
        this.x = x;
        this.y = y;
        this.colliding = function (intersectingObject) {
            var myX = this.positionX;
            var myY = this.positionY;
            var otherX = intersectingObject.positionX;
            var otherY = intersectingObject.positionY;

            if (intersectingObject.type == "wall" || intersectingObject.type == "move") {
                if (otherX == myX - 1 && otherY == myY) {
                    if (intersectingObject.type == "wall") {
                        collideLeft = true;
                    } else {
                        if (intersectingObject.collideLeft == true) {
                            collideLeft = true;
                        }
                    }
                }
                if (otherX == myX + 1 && otherY == myY) {
                    if (intersectingObject.type == "wall") {
                        collideRight = true;
                    } else {
                        if (intersectingObject.collideRight == true) {
                            collideRight = true;
                        }
                    }
                }
                if (otherY == myY - 1 && otherX == myX) {
                    if (intersectingObject.type == "wall") {
                        collideUp = true;
                    } else {
                        if (intersectingObject.collideUp == true) {
                            collideUp = true;
                        }
                    }
                }
                if (otherY == myY + 1 && otherX == myX) {
                    if (intersectingObject.type == "wall") {
                        collideDown = true;
                    } else {
                        if (intersectingObject.collideDown == true) {
                            collideDown = true;
                        }
                    }
                }
            }
        };

        this.move = function () {
            if ((gameArea.key && gameArea.key == 65 || gameArea.key && gameArea.key == 37) && collideLeft == false) {
                player.speedX = -30;
                player.formerPositionX = player.positionX;
                player.formerPositionY = player.positionY;
                player.positionX -= 1;
            }
            if ((gameArea.key && gameArea.key == 68 || gameArea.key && gameArea.key == 39) && collideRight == false) {
                player.speedX = 30;
                player.formerPositionX = player.positionX;
                player.formerPositionY = player.positionY;
                player.positionX += 1;
            }
            if ((gameArea.key && gameArea.key == 87 || gameArea.key && gameArea.key == 38) && collideUp == false) {
                player.speedY = -30;
                player.formerPositionY = player.positionY;
                player.formerPositionX = player.positionX;
                player.positionY -= 1;
            }
            if ((gameArea.key && gameArea.key == 83 || gameArea.key && gameArea.key == 40) && collideDown == false) {
                player.speedY = 30;
                player.formerPositionY = player.positionY;
                player.formerPositionX = player.positionX;
                player.positionY += 1;
            }
            collideLeft = false;
            collideRight = false;
            collideUp = false;
            collideDown = false;
        };
        this.update = function () {
            ctx = gameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
        this.newPos = function () {
            this.x += this.speedX;
            this.y += this.speedY;
            gameArea.key = false;
        };
    }
}

function wonGame(incomingBlock) {
    for (j = 0; j < goals.length; j++) {
        if (goals[j].positionX == incomingBlock.positionX && goals[j].positionY == incomingBlock.positionY) {
            won += 1;
        }
    }
}

function startGame() {
    gameArea.start();
}

function updateGameArea() {
    gameArea.clear();
    player.speedX = 0;
    player.speedY = 0;
    for (i = 0; i < goals.length; i++) {
        goals[i].update();
    }
    for (i = 0; i < blocks2.length; i++) {
        blocks2[i].update();
        if (blocks2[i].type == "move") {
            wonGame(blocks2[i])
        }
    }

    if (won == goalBlocks) {
        gameArea.stop();
    } else {
        won = 0;
    }
    
    for (i = 0; i < blocks2.length; i++) {
        player.colliding(blocks2[i]);
    }

    player.move();
    player.newPos();
    player.update();

}