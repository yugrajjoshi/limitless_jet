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
    this.hightestScore = 0;
    this.hightestScoreText = null;
    this.healthText = null;
    this.baseScrollSpeed = 1;
    this.scrollSpeed = 1;
    this.canShoot = true;
    this.lastDifficultyScore =0;
    this.enemySpawnDelay = 3000;
    this.explosionSound = null;
    this.shootSound = null;
    this.isPaused = false;
    this.pauseKey = null;
    this.pauseText = null;
    
  }

  preload() {
  
    this.load.image('bg', "assets/skys.png");
    this.load.image('terrain', 'assets/trees.png');
    this.load.image('Plane', 'assets/plane.png');
    this.load.image('missile', "assets/missile.png");
    this.load.image('enemy', "assets/enemy.png");
    this.load.audio('explosionSound', 'assets/blastsound.mp3');
    this.load.audio('bgsound','assets/ingamesound.mp3');
    this.load.audio('shootSound', 'assets/missilelaunch.mp3');
  }

  create() {
    this.sound.add('bgsound',{loop:true, volume:0.5}).play();
    this.explosionSound = this.sound.add('explosionSound');
    this.shootSound =this.sound.add('shootSound');
    this.bg = this.add.tileSprite(750, 475, this.scale.width, this.scale.height, 'bg').setScale(4);
    
    this.terrainA = this.physics.add.image(0, this.scale.height, 'terrain')
      .setOrigin(0,0.8)
      .setDisplaySize(this.scale.width, 120);
    this.terrainA.body.setAllowGravity(false);
    this.terrainA.setImmovable(true);

    this.terrainB = this.physics.add.image(this.scale.width, this.scale.height, 'terrain')
      .setOrigin(0, 0.8)
      .setDisplaySize(this.scale.width, 120);
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
    this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);


    this.playerBullets = this.physics.add.group();
    this.enemyMissiles = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' })
      .setScrollFactor(0);
    this.healthText = this.add.text(16, 48, 'Health: 100', { fontSize: '32px', fill: '#ffffff' })
      .setScrollFactor(0);
    this.heighestScore = parseInt(localStorage.getItem('planeGameHighScore')) || 0;
    this.hightestScoreText = this.add.text(16, 80, 'High Score: ' + this.heighestScore, { fontSize: '32px', fill: '#ffff00' })
      .setScrollFactor(0);
    
    this.pauseText = this.add.text(750, 384, 'PAUSED', {
      fontSize: '64px',
      fill: '#ffff00',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);
    this.pauseText.setVisible(false);

    // Enemy spawn timer
    this.enemies = this.physics.add.group();
    this.enemySpawnTimer = this.time.addEvent({
      delay: this.enemySpawnDelay,
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
    // Handle pause toggle (must be outside pause check to allow unpausing)
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.togglePause();
    }
    
    // If paused, skip game logic but keep rendering
    if (this.isPaused) {
      return;
    }
    
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
    
    this.checkDifficulty();

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
    missile.setSize(missile.displayWidth * 20, missile.displayHeight * 20, true);
    missile.setOffset(missile.displayWidth *10, missile.displayHeight * 15);
    missile.body.allowGravity = false;
    if(this.shootSound){
      this.shootSound.play();
    }
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
    
    if(this.explosionSound){
      this.explosionSound.play();
    }
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
    missile.setSize(missile.displayWidth * 20, missile.displayHeight * 20, true);
    missile.setOffset(missile.displayWidth *10, missile.displayHeight * 15);
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
    if (this.explosionSound) {
      this.explosionSound.play();
    }
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

  checkDifficulty() {
    if (this.score >= this.lastDifficultyScore + 100) {
     
      this.baseScrollSpeed += 0.5;

      // Accelerate enemy 
      this.enemySpawnDelay = Math.max(800, this.enemySpawnDelay - 200);

      // Restart the spawn timer 
      if (this.enemySpawnTimer) {
        this.enemySpawnTimer.remove(false);
      }
      this.enemySpawnTimer = this.time.addEvent({
        delay: this.enemySpawnDelay,
        loop: true,
        callback: () => this.spawnEnemy()
      });

      this.lastDifficultyScore = this.score;
    }
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.pauseText.setVisible(true);
      this.physics.pause();
      if (this.enemySpawnTimer) {
        this.enemySpawnTimer.paused = true;
      }
    } else {
      this.pauseText.setVisible(false);
      this.physics.resume();
      if (this.enemySpawnTimer) {
        this.enemySpawnTimer.paused = false;
      }
    }
  }
  
  checkHighScore() {
    if (this.score > this.heighestScore) {
      this.heighestScore = this.score;
      localStorage.setItem('planeGameHighScore', this.heighestScore);
      this.hightestScoreText.setText('High Score: ' + this.heighestScore);
    }
  }

  gameover() {
    this.plane.setTint(0xff0000);
    this.plane.setVelocity(0, 0);
    this.scrollSpeed = 0;
    this.scene.start('OverScene', { score: this.score });
  }

}

let config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 768,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 50 },
      debug: false,
    },
  },
  scene: [MenuScene, PlaneGame, OverScene]
};

let game = new Phaser.Game(config);
