class PlaneGame extends Phaser.Scene {
  constructor() {
    super({ key: 'PlaneGame' });

    this.playerBullets = null;
    this.enemyMissiles = null;
    this.plane = null;
    this.cursors = null;
    this.spacebar = null;
    this.bg = null;
    this.terrainA = null;
    this.terrainB = null;
    this.enemies = null;
    this.enemySpawnTimer = null;
    this.score = 0;
    this.health = 100;
    this.scoreText = null;
    this.healthText = null;
    this.baseScrollSpeed = 1;
    this.scrollSpeed = 1;
    this.canShoot = true;
  }

  preload() {
  
    this.load.image('bg', "assets/skys.png");
    this.load.image('terrain', 'assets/trees.png');
    this.load.image('Plane', 'assets/plane.png');
    this.load.image('missile', "assets/missile.png");
    this.load.image('enemy', "assets/enemy.png");
  }

  create() {
  
    this.bg = this.add.tileSprite(750, 475, this.scale.width, this.scale.height, 'bg').setScale(4);
    
    this.terrainA = this.physics.add.image(0, this.scale.height, 'terrain')
      .setOrigin(0, 1)
      .setDisplaySize(this.scale.width, 100);
    this.terrainA.body.setAllowGravity(false);
    this.terrainA.setImmovable(true);

    this.terrainB = this.physics.add.image(this.scale.width, this.scale.height, 'terrain')
      .setOrigin(0, 1)
      .setDisplaySize(this.scale.width, 100);
    this.terrainB.body.setAllowGravity(false);
    this.terrainB.setImmovable(true);

  
    this.plane = this.physics.add.sprite(175, 300, 'Plane').setScale(0.6);
    this.plane.setCollideWorldBounds(true);
    this.plane.body.setDrag(1);
    this.plane.body.setMaxVelocity(300);
  
    this.plane.body.setSize(this.plane.displayWidth * 1.1, this.plane.displayHeight * 0.3, true);
    this.plane.body.setOffset(this.plane.displayWidth * 0.2, this.plane.displayHeight * 0.5);

    
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    this.playerBullets = this.physics.add.group();
    this.enemyMissiles = this.physics.add.group();
    //score display
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' })
      .setScrollFactor(0);
    this.healthText = this.add.text(this.scale.width - 250, 16, 'Health: 100', { fontSize: '32px', fill: '#ffffff' })
      .setScrollFactor(0);

    // Senemy spawn timer
    this.enemies = this.physics.add.group();
    this.enemySpawnTimer = this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => this.spawnEnemy()
    });

    //collision
    this.physics.add.overlap(this.playerBullets, this.enemies, this.enemyHit, null, this);
    this.physics.add.overlap(this.plane, this.enemies, this.planeEnemyHit, null, this);
    this.physics.add.overlap(this.plane, [this.terrainA, this.terrainB], this.planeTerrainHit, null, this);
    this.physics.add.overlap(this.plane, this.enemyMissiles, this.playerMissileHit, null, this);
  }

  update() {
    let moveSpeed = 150;
    let targetAngle = 0;

    if (this.cursors.up.isDown) {
      this.plane.setVelocityY(-moveSpeed).setVelocityX(100);
      targetAngle = -30;
    } else if (this.cursors.up.isUp && this.cursors.down.isUp) {
      targetAngle = 0;
      this.plane.setVelocityY(0);
      this.plane.setDrag(0.95);
      this.plane.setVelocityX(0);
    } else if (this.cursors.down.isDown) {
      this.plane.setVelocityY(moveSpeed).setVelocityX(100);
      targetAngle = 30;
    }

    // Smooth rotation 
    this.plane.angle = Phaser.Math.Linear(this.plane.angle, targetAngle, 0.01);

    if (this.cursors.right.isDown) {
      this.plane.setVelocityX(130);
      this.scrollSpeed = this.baseScrollSpeed * 3;
    } else if (!this.cursors.right.isDown) {
      this.scrollSpeed = this.baseScrollSpeed;
      this.plane.setVelocityX(-30);
    }

    if (this.cursors.left.isDown) {
      this.plane.setVelocityX(-230);
      targetAngle = -20;
    }
    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.canShoot) {
      this.shootMissile();
    }
    // Remove off-screen bullets and missiles
    this.playerBullets.children.entries.forEach(bullet => {
      if (bullet.x > this.game.config.width || bullet.y > this.game.config.height || bullet.y < 0) {
        bullet.destroy();
      }
    });
  
    this.enemyMissiles.children.entries.forEach(missile => {
      if (missile.x < -50 || missile.y < -50 || missile.y > this.game.config.height + 50) {
        missile.destroy();
      }
    });

    this.enemies.children.entries.forEach(enemy => {
      if (enemy.x < -enemy.displayWidth || enemy.y < -50 || enemy.y > this.game.config.height + 50) {
        enemy.destroy();
      }
    });

    // Keep the background moving
    this.bg.tilePositionX += this.scrollSpeed * 0.3;

  

    this.terrainA.x -= this.scrollSpeed * 2;
    this.terrainB.x -= this.scrollSpeed * 2;

    if (this.terrainA.x + this.terrainA.displayWidth <= 0) {
      this.terrainA.x = this.terrainB.x + this.terrainB.displayWidth;
    }
    if (this.terrainB.x + this.terrainB.displayWidth <= 0) {
      this.terrainB.x = this.terrainA.x + this.terrainA.displayWidth;
    }
  }

  shootMissile() {
    let missile = this.playerBullets.create(this.plane.x + 80, this.plane.y, 'missile').setScale(0.02);
    missile.setVelocityX(800).setVelocityY(this.plane.body.velocity.y);
    missile.body.allowGravity = false;
    missile.angle = this.plane.angle;
    this.canShoot = false;
    setTimeout(() => { this.canShoot = true; }, 500);
  }

  spawnEnemy() {
    const yPos = Phaser.Math.Between(80, this.scale.height - 120);
    const enemy = this.enemies.create(this.scale.width + 50, yPos, 'enemy').setScale(0.2);
    enemy.body.setSize(enemy.displayWidth * 5, enemy.displayHeight * 2, true);
    enemy.body.setOffset(enemy.displayWidth * 0.1, enemy.displayHeight * 1);
    enemy.setVelocityX(Phaser.Math.Between(-400, -240));
    enemy.setVelocityY(Phaser.Math.Between(-50, 0));
    enemy.setCollideWorldBounds(false);
    enemy.body.allowGravity = false;

    enemy.shootTimer = this.time.addEvent({
      delay: Phaser.Math.Between(1500, 2500),
      loop: true,
      callback: () => {
        if (enemy.active) {
          this.enemyShoot(enemy);
        }
      }
    });
  }

  enemyHit(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
  }

  planeEnemyHit(plane, enemy) {
    enemy.destroy();
    this.health -= 25;
    this.healthText.setText('Health: ' + this.health);
    plane.setTint(0xff0000);
    
    
    this.time.delayedCall(100, () => {
      if (plane.active) plane.clearTint();
    });

    if (this.health <= 0) {
      console.log("GAME OVER! Final Score: " + this.score);
      this.gameover();
    }
  }

  enemyShoot(enemy) {
    
    const missile = this.enemyMissiles.create(enemy.x - 80, enemy.y, 'missile').setScale(0.02);
    missile.setTint(0xff0000); 
    missile.body.allowGravity = false;
    
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.plane.x, this.plane.y);
    missile.setRotation(angle);
    
   
    const speed = 500;
    missile.setVelocityX(Math.cos(angle) * speed);
    missile.setVelocityY(Math.sin(angle) * speed);
  }

  playerMissileHit(plane, missile) {
    missile.destroy();
    this.health -= 15;
    this.healthText.setText('Health: ' + this.health);
    plane.setTint(0xff0000);
    
   
    this.time.delayedCall(100, () => {
      if (plane.active) plane.clearTint();
    });

    if (this.health <= 0) {
      console.log("GAME OVER! Final Score: " + this.score);
      this.gameover();
    }
  }

  planeTerrainHit(plane, terrain) {
    console.log("Plane crashed into terrain!");
    this.health = 0;
    this.healthText.setText('Health: ' + this.health);
    if (this.health <= 0) {
      console.log("GAME OVER! Final Score: " + this.score);
      this.gameover();
    }
  }

  gameover() {
  
    this.plane.setTint(0xff0000);
    this.plane.setVelocity(0, 0);
    this.scrollSpeed = 0;
    this.baseScrollSpeed = 0;

    this.time.delayedCall(2000, () => {
      this.scene.start('MenuScene');
    });
  }
}

let config = {
  renderer: Phaser.AUTO,
  width: 1500,
  height: 768,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 50 },
      debug: false,
    },
  },
  scene: [MenuScene, PlaneGame]
};

let game = new Phaser.Game(config);
