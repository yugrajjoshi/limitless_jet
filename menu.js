
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
    this.spaceKey = null;
    this.bg = null;
    this.plane = null;
    this.scrollSpeed = 2;
  }

  preload() {
    this.load.audio('menuMusic','assets/menusound.mp3');
    this.load.image('bg', "assets/skys.png");
    this.load.image('Plane', 'assets/plane.png');
  }

  create() {
    this.sound.add('menuMusic',{loop:true, volume:0.5}).play(); 
    this.bg = this.add.tileSprite(750, 384, 1500, 768, 'bg').setScale(4);

    // Add animated plane
    this.plane = this.add.sprite(200, 300, 'Plane').setScale(0.5);
    this.tweens.add({
      targets: this.plane,
      x: 1300,
      duration: 6000,
      ease: 'Linear',
      repeat: -1,
      yoyo: true
    });
    this.tweens.add({
      targets: this.plane,
      y: 350,
      duration: 2000,
      ease: 'Sine.inout',
      repeat: -1,
      yoyo: true
    });

    this.add.text(750, 250, 'PLANE GAME', {
      fontSize: '64px',
      fill: '#0779bb',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    
    this.add.text(750, 400, 'PRESS SPACE TO START', {
      fontSize: '32px',
      fill: '#ffff00'
    }).setOrigin(0.5);

  
    this.add.text(750, 550, 'Controls:\n↑↓ Move | → Boost | SPACE Shoot | P Pause', {
      fontSize: '24px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

  
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    this.bg.tilePositionX += this.scrollSpeed*0.3;
    
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.sound.stopAll();
      this.scene.start('PlaneGame');
    }
  }
}

