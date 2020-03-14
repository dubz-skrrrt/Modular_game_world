class death extends Phaser.Scene{
    constructor(){
        super('deathScene');
    }
    preload() {
        this.load.image('BG', 'assets/images/gameover.jpg');
        this.load.image('retry', 'assets/images/es.png');
        
    }

    create() {
        music.mute = true;
        this.sound.add('deathS');
        this.sound.play('deathS');
        this.add.image(380, 200, "BG").setScale(0.8);

        const retryButton = this.add.image(400, 400, 'retry').setScale(.2);
        retryButton.setInteractive();
        retryButton.on('pointerdown', () => {
            
            this.scene.start("game1");
        });

    }

    update() {

    }
}
