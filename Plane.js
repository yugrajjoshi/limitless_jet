let config = {
  renderer: Phaser.AUTO,
  width: 1500,
  height: 768,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 50},
      debug:true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
let playerBullets;
let plane;
let cursors;
let spacebar;
let bg;
let terrainA;
let terrainB;
let enemies;
let enemySpawnTimer;
let score = 0;
let health = 100;
let scoreText;
let healthText;
let baseScrollSpeed = 1;
let scrollSpeed = 1;
let canShoot = true;

let game = new Phaser.Game(config);


function preload(){
    this.load.image('bg', "assets/skys.png");
    this.load.image('terrain','assets/trees.png');
    this.load.image('Plane','assets/plane.png');
    this.load.image('missile',"assets/missile.png");
  this.load.image('enemy',"assets/enemy.png");

  }
function create(){
   bg = this.add.tileSprite(750, 475, this.scale.width, this.scale.height, 'bg').setScale(4);
  // Two terrain strips to create a seamless scrolling ground
  terrainA = this.physics.add.image(0, this.scale.height, 'terrain')
    .setOrigin(0, 1)
    .setDisplaySize(this.scale.width, 100);
  terrainA.body.setAllowGravity(false);
  terrainA.setImmovable(true);

  terrainB = this.physics.add.image(this.scale.width, this.scale.height, 'terrain')
    .setOrigin(0, 1)
    .setDisplaySize(this.scale.width, 100);
  terrainB.body.setAllowGravity(false);
  terrainB.setImmovable(true);
  
   
//create plane sprite
 plane = this.physics.add.sprite(175,300,'Plane').setScale(0.6);
 plane.setCollideWorldBounds(true);
 plane.body.setDrag(1);
 plane.body.setMaxVelocity(300);
 // Only lower half of the plane collides/overlaps with terrain
  plane.body.setSize(plane.displayWidth * 1.1, plane.displayHeight * 0.3, true);
  plane.body.setOffset(plane.displayWidth * 0.2, plane.displayHeight * 0.5);
 
 //collisions (moved to after enemies setup below)
 // Setup cursor controls for up/down movement
 cursors = this.input.keyboard.createCursorKeys();
 spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 
 // Create bullets group
 playerBullets = this.physics.add.group();

 // Create UI text - Score and Health
 scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' })
   .setScrollFactor(0);
 healthText = this.add.text(this.scale.width - 250, 16, 'Health: 100', { fontSize: '32px', fill: '#ffffff' })
   .setScrollFactor(0);

  // Enemies group and spawn timer
  enemies = this.physics.add.group();
  enemySpawnTimer = this.time.addEvent({
    delay: 3000,
    loop: true,
    callback: () => spawnEnemy(this)
  });

  // Collisions
  this.physics.add.overlap(playerBullets, enemies, enemyHit, null, this);
  this.physics.add.overlap(plane, enemies, planeEnemyHit, null, this);
  this.physics.add.overlap(plane, [terrainA, terrainB], planeTerrainHit, null, this);
}

function update(){
  // Movement speed - adjust this value to make it faster/slower
  let moveSpeed = 150;
  let targetAngle = 0;
  
  if (cursors.up.isDown) {
    plane.setVelocityY(-moveSpeed).setVelocityX(100);
    targetAngle = -25;

  }else if(cursors.up.isUp && cursors.down.isUp){
    targetAngle = 0;
    plane.setVelocityY(0);
    plane.setDrag(0.95);
    plane.setVelocityX(0);
  } 
  else if (cursors.down.isDown) {
    plane.setVelocityY(moveSpeed).setVelocityX(100);
    targetAngle = 25;
  }
  
  // Smooth rotation with lerp
  plane.angle = Phaser.Math.Linear(plane.angle, targetAngle, 0.01);
  if (cursors.right.isDown){
    plane.setVelocityX(130);
    scrollSpeed = baseScrollSpeed*3;
  }
  
  else if(!cursors.right.isDown){
    scrollSpeed = baseScrollSpeed;
    plane.setVelocityX(-30);
  }
  if(cursors.left.isDown){
    plane.setVelocityX(-230);
    targetAngle = -20;
  }
  // Shooting missiles
  if (Phaser.Input.Keyboard.JustDown(spacebar) && canShoot){
    shootMissile(this);
  }
  
  
  // Remove bullets that go off-screen
  playerBullets.children.entries.forEach(bullet => {
    if(bullet.x > game.config.width || bullet.y > game.config.height || bullet.y < 0){
      bullet.destroy();
    }
  });

  // Remove enemies that go off-screen (to the left)
  enemies.children.entries.forEach(enemy => {
    if(enemy.x < -enemy.displayWidth || enemy.y < -50 || enemy.y > game.config.height + 50){
      enemy.destroy();
    }
  });
  
  // Scroll  background
  bg.tilePositionX += scrollSpeed * 0.3; 
  
  // Scroll terrain strips and wrap
  terrainA.x -= scrollSpeed*2;
  terrainB.x -= scrollSpeed*2;

  if (terrainA.x + terrainA.displayWidth <= 0) {
    terrainA.x = terrainB.x + terrainB.displayWidth;
  }
  if (terrainB.x + terrainB.displayWidth <= 0) {
    terrainB.x = terrainA.x + terrainA.displayWidth;
  }
  }

  function shootMissile(scene){
    let missile = playerBullets.create(plane.x + 30, plane.y, 'missile').setScale(0.01);
    missile.setVelocityX(500).setVelocityY(plane.body.velocity.y);
    missile.body.allowGravity = false;
    missile.angle = plane.angle;
    canShoot = false;
    setTimeout(() => { canShoot = true; }, 500);
  }
  
  function spawnEnemy(scene){
    const yPos = Phaser.Math.Between(80, scene.scale.height - 120);
    const enemy = enemies.create(scene.scale.width + 50, yPos, 'enemy').setScale(0.2);
    enemy.body.setSize(enemy.displayWidth * 5, enemy.displayHeight * 2, true);
    enemy.body.setOffset(enemy.displayWidth * 0.1, enemy.displayHeight * 1);
    enemy.setVelocityX(Phaser.Math.Between(-220, -140));
    enemy.setVelocityY(Phaser.Math.Between(-60, 0));
    enemy.setCollideWorldBounds(false);
    enemy.body.allowGravity = false;
  }

  function enemyHit(bullet, enemy){
    bullet.destroy();
    enemy.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
  }
  
  function planeEnemyHit(plane, enemy){
    enemy.destroy();
    health -= 25;
    healthText.setText('Health: ' + health);
    plane.setTint(0xff0000);
    
    if(health <= 0){
      console.log("GAME OVER! Final Score: " + score);
      gameover();
    }
  }

  function planeTerrainHit(plane,[terrainA, terrainB]){
    console.log("Plane crashed into terrain!");
    health =  0;
    healthText.setText('Health: '+health);
    if(health <= 0){
      console.log("GAME OVER! Final Score: " + score);
      gameover();
    }
  }
  
    // Later we'll add proper game over screen

  function gameover(){
    // Placeholder for game over logic  
    plane.setTint(0xff0000);
    plane.setVelocity(0, 0);
    scrollSpeed=0;
    baseScrollSpeed=0;
    game.scene.pause();
    spawnEnemy=null;
    input.keyboard.enabled=false;
    
  }