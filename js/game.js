
var config = {
    type: Phaser.AUTO,
      width: 800,
      height: 500,
      scene: [Level1, death, win],
      physics: {
          default: 'arcade',
          arcade: {
              gravity: {y: 0},
              debug: false
          }
      },
     
  };
  

  let game = new Phaser.Game(config);