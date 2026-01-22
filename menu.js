
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
    this.spaceKey = null;
  }

  preload() {
    
    this.load.image('bg', "assets/skys.png");
  }

  create() {
   
    this.add.image(750, 384, 'bg').setScale(4);

    
    this.add.text(750, 250, 'PLANE GAME', {
      fontSize: '64px',
      fill: '#0779bb',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    
    this.add.text(750, 400, 'PRESS SPACE TO START', {
      fontSize: '32px',
      fill: '#ffff00'
    }).setOrigin(0.5);

  
    this.add.text(750, 550, 'Controls:\n↑↓ Move | → Boost | SPACE Shoot', {
      fontSize: '24px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

  
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.scene.start('PlaneGame');
    }
  }
}

