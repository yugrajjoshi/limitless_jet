class OverScene extends Phaser.Scene {
    constructor(){
        super({key: 'OverScene'});
        this.spaceKey = null;
        this.finalScore = 0;
        this.highScore = 0;
    }
    preload(){}

    create(data){
        this.finalScore = data.score || 0;
        this.highScore = parseInt(localStorage.getItem('planeGameHighScore')) || 0;
        
        
        if (this.finalScore > this.highScore) {
            this.highScore = this.finalScore;
            localStorage.setItem('planeGameHighScore', this.highScore);
        }
        
        this.add.text(750, 200, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontStyle: 'bold'
          }).setOrigin(0.5);
          
        this.add.text(750, 320, 'Score: ' + this.finalScore, {
            fontSize: '40px',
            fill: '#ffffff'
          }).setOrigin(0.5);
          
        this.add.text(750, 380, 'High Score: ' + this.highScore, {
            fontSize: '40px',
            fill: '#ffff00',
            fontStyle: 'bold'
          }).setOrigin(0.5);
          
          this.add.text(750, 480, 'PRESS SPACE TO RETURN TO MENU', {
            fontSize: '32px',
            fill: '#ffff00'
          }).setOrigin(0.5);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update(){
        if(Phaser.Input.Keyboard.JustDown(this.spaceKey)){
            this.scene.start('MenuScene');
        }
    }
}