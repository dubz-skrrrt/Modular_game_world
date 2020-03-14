var map, worldPhys;
var player;
var cursors;
var groundLayer, bglayer, collisionlayer, worldLayer, winLayer;
var life;
var spawnpoint;
var tileset;
var healthW;
var enemies;
var cur_health;
var music;
var prevVelocity;
class Level1 extends Phaser.Scene{
    constructor(){
      super("game1");
      // this function will be called when the player touches a coin
  
    }

    preload(){
        this.load.tilemapTiledJSON('map', 'assets/maps/level1.json');

        this.load.spritesheet('tiles', 'assets/images/32x32_map_tile v3.1 [MARGINLESS].png', {frameWidth: 50, frameHeight: 50});
        this.load.spritesheet('etiles', 'assets/sprites/characters.png', {frameWidth: 50, frameHeight: 50});
        this.load.atlas('atlas', 'assets/sprites/atlas.png', 'assets/sprites/character.json');
        this.load.image('healthbar', 'assets/images/healthbar.png');
        this.load.audio('bgm', 'assets/sounds/alienblues.wav');
        this.load.audio('clear', 'assets/sounds/Jingle_Win_01.mp3', {
            instances: 1
          });
          this.load.audio('deathS', 'assets/sounds/Jingle_Lose_00.mp3', {
            instances: 1
        });
    }

    create(){

        map = this.make.tilemap({ key: "map" });
        music = this.sound.add('bgm');
       
        music.play();
        healthW = 0.5;
        tileset = map.addTilesetImage("world", "tiles");
        var enemyTiles = map.addTilesetImage("char", "etiles");
        groundLayer = map.createStaticLayer('ground', tileset, 0, 0);
        collisionlayer = map.createStaticLayer('collision', tileset, 0, 0);
        bglayer = map.createStaticLayer('bg', tileset, 0, 0);
        enemies = map.createDynamicLayer('enemies', enemyTiles, 0, 0);
        winLayer = map.createStaticLayer('win', tileset, 0, 0);


        enemies.setCollisionByProperty({ collider: true });
        collisionlayer.setCollisionByProperty({ collides: true });
        winLayer.setCollisionByProperty({ collides: true });

        life = this.add.image(150, 20,"healthbar").setScale(0.5);
        life.setDepth(20);
        
        life.setScrollFactor(0);
        bglayer.setDepth(10);

        spawnpoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        
        player = this.physics.add
            .sprite(spawnpoint.x, spawnpoint.y, "atlas", "misa-front")
            .setSize(20, 20)
            .setOffset(10, 42);

        // Watch the player and worldLayer for collisions, for the duration of the scene:
        this.physics.add.collider(player, collisionlayer);
        this.physics.add.collider(player, winLayer, winner, null, this);
        this.physics.add.collider(player, enemies, collideEnemy, null, this);
        
        const anims = this.anims;
        anims.create({
            key: "misa-left-walk",
            frames: anims.generateFrameNames("atlas", {
            prefix: "misa-left-walk.",
            start: 0,
            end: 3,
            zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-right-walk",
            frames: anims.generateFrameNames("atlas", {
            prefix: "misa-right-walk.",
            start: 0,
            end: 3,
            zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-front-walk",
            frames: anims.generateFrameNames("atlas", {
            prefix: "misa-front-walk.",
            start: 0,
            end: 3,
            zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-back-walk",
            frames: anims.generateFrameNames("atlas", {
            prefix: "misa-back-walk.",
            start: 0,
            end: 3,
            zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'en_walk',
            frames: this.anims.generateFrameNames('enemy', {prefix: 'walk0', start: 1, end: 8}),
            frameRate: 10,
            repeat: -1
        });
      
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        this.cameras.main.startFollow(player);

        this.physics.world.bounds.width = groundLayer.width;
        this.physics.world.bounds.height = groundLayer.height;

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.createDebugGraphic();

        // Create worldLayer collision graphic above the player, but below the help text
        // const graphics = this.add
        //   .graphics()
        //   .setAlpha(0.75)
        //   .setDepth(20);
        // collisionlayer.renderDebug(graphics, {
        //   tileColor: null, // Color of non-colliding tiles
        //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });


    }

    update(){
        //life.setScale(0.4, 0.5);
        if (healthW < 0.05){
            this.scene.start('deathScene');
        }
        const speed = 175;
        prevVelocity = player.body.velocity.clone();

        // Stop any previous movement from the last frame
        player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown) {
            player.body.setVelocityX(-speed);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(speed);
        }

        // Vertical movement
        if (cursors.up.isDown) {
            player.body.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            player.body.setVelocityY(speed);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (cursors.left.isDown) {
            player.anims.play("misa-left-walk", true);
        } else if (cursors.right.isDown) {
            player.anims.play("misa-right-walk", true);
        } else if (cursors.up.isDown) {
            player.anims.play("misa-back-walk", true);
        } else if (cursors.down.isDown) {
            player.anims.play("misa-front-walk", true);
        } else {
            player.anims.stop();

            // If we were moving, pick and idle frame to use
            if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
            else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
            else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
            else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
        }
    }
}

function collideEnemy(sprite, tile){
    healthW -= 0.05;
    enemies.removeTileAt(tile.x, tile.y, enemies);
    life.setScale(healthW, 0.5);

}
function winner(){
    this.scene.start('winScene');
    this.sound.play('clear');
}