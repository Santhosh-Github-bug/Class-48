var player, playerImg, playerEnd;
var ground, groundImg;
var ghost, ghostImg;
var ghostGroup, bulletGroup;
var bullet, bulletImg;
var gameState = "play";
var lives = 3;
var score = 0;
var edges;
var gameOver, gameOverImg;
var sound;

function preload() {
  playerImg = loadAnimation("p1.png", "p2.png", "p3.png", "p4.png");
  playerEnd = loadAnimation("playerdead.png");
  groundImg = loadImage("ground.png");
  ghostImg = loadAnimation(
    "ghost1.png",
    "ghost2.png",
    "ghost3.png",
    "ghost4.png",
    "ghost5.png"
  );
  bulletImg = loadImage("bullet.png");
  gameOverImg = loadImage("gameover.png");
  sound=loadSound("sound.mp3");
}

function setup() {
  createCanvas(1100, 800);

  ground = createSprite(600, 400, 1100, 800);
  ground.addImage(groundImg);
  ground.scale = 1.4;

  player = createSprite(250, 300, 50, 50);
  player.addAnimation("running", playerImg);
  player.addAnimation("ending", playerEnd);
  player.scale = 0.6;
  player.debug = false;

  gameOver = createSprite(550, 400);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  ghostGroup = new Group();
  bulletGroup = new Group();

  edges = createEdgeSprites();
}

function draw() {
  background(0);

  if (gameState === "play") {
    ground.velocityX = -12;

    if (ground.x < 300) {
      ground.x = 400;
    }
    spawnEnemies();
    if (keyDown("space")) {
      bullet = createSprite(player.x + 140, player.y - 40, 50, 50);
      bullet.addImage(bulletImg);
      bullet.velocityX = 12;
      bullet.scale = 0.2;
      bullet.debug = false;
    }
    if (keyDown("up")) {
      player.y = player.y - 2;
    }

    if (keyDown("down")) {
      player.y = player.y + 2;
    }

    if (keyDown("right")) {
      player.x = player.x + 2;
    }

    if (keyDown("left")) {
      player.x = player.x - 2;
    }

    if (ghostGroup.isTouching(bullet)) {
      score = score + 1;
      ghost.velocityX = 0;
      ghostGroup.destroyEach();
    }
    if (ghostGroup.isTouching(player)) {
      lives = lives - 1;
      ghostGroup.destroyEach();
    }
    if (lives <= 0) {
      gameState = "end";
    }
  } else if (gameState === "end") {
    gameOver.visible = true;
    ground.velocityX = 0;
    player.velocityX = 0;
    player.changeAnimation("ending", playerEnd);
    player.scale = 1;
    ghostGroup.destroyEach();
  }
  player.collide(edges);
  drawSprites();
  fill("red");
  stroke("yellow");
  textSize(20);
  text("Score: " + score, 1000, 25);
  text("Lives: " + lives, 1000, 50);
}

function spawnEnemies() {
  if (frameCount % 150 === 0) {
    sound.play();
    ghost = createSprite(1000, random(100, 500), 50, 50);
    ghost.addAnimation("jumping", ghostImg);
    ghost.velocityX = -6;
    ghost.scale = 0.3;
    ghost.debug = false;
    ghost.setCollider("rectangle", 0, 0, ghost.width - 70, ghost.height);
    ghost.lifetime = 1100;
    ghostGroup.add(ghost);
  }
}
