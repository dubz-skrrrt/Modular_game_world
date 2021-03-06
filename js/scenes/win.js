class win extends Phaser.Scene{
    constructor(){
        super('winScene');
    }
    preload() {

        this.load.image('BG2', 'assets/images/win.jpg');
        this.load.image('retry2', 'assets/images/retry.png');
        
    }

    create() {
        music.mute = true;
        this.add.image(380, 200, "BG2").setScale(0.8);
        
        const retryButton = this.add.image(400, 400, 'retry2').setScale(.2);
        retryButton.setInteractive();
        retryButton.on('pointerdown', () => {
            retryButton.alpha = 0.5;
            this.scene.start("game1");
        });

    }

    update() {

    }
}
