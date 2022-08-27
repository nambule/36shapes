let tmp_circle,gameOverText,scoreText;
let gameStarted = false;
let openingText, playerWonText, newLevelText;
let numbersInit = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
let numbers;
let k=0;
let nbClick=0,finalScore,highScore,timer;
var snd=[];
let numberOfNotes;
let nb_of_circles;
let nbLignes,nbColonnes,nbColonnesMax=6;
let maxNbPlayed=5;
let isgameOver=false;
let isGameWon=false;
let score=0;
let helpText;
let helpGraphics;
let toggleDisplayHelp = false;
let helpContainer;

window.onload = function(){
  // This object contains all the Phaser configurations to load our game
  const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      parent: 'game',
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: false,
        debug: false
      },
    },
    audio: {
        disableWebAudio: true
    },
    scene: [selectWorld]
  };
  game=new Phaser.Game(config);
  game.scene.start("selectWorld",{nb:2});
}

// Create the game instance
//const game = new Phaser.Game(config);

var circle;
//var cursors;

class selectWorld extends Phaser.Scene{

  constructor(){
    super({key: 'selectWorld'});
  }

  init(data){

    numberOfNotes = data.nb;
    nb_of_circles = numberOfNotes*2;

  }

  preload() {

    if(numberOfNotes-1==1){ // 1er niveau

      var progressBar = this.add.graphics();
      var progressBox = this.add.graphics();
      progressBox.fillStyle(0x222222, 0.8);
      progressBox.fillRect(240, 270, 320, 50);

      var width = this.cameras.main.width;
      var height = this.cameras.main.height;
      var loadingText = this.make.text({
          x: width / 2,
          y: height / 2 - 50,
          text: 'Loading...',
          style: {
              font: '20px monospace',
              fill: '#ffffff'
          }
      });
      loadingText.setOrigin(0.5, 0.5);

      this.load.on('progress', function (value) {
          progressBar.clear();
          progressBar.fillStyle(0xffffff, 1);
          progressBar.fillRect(250, 280, 300 * value, 30);
      });
    }


    this.load.image('circle', 'assets/circle.png');
    this.load.image('circle_invert', 'assets/circle_invert.png');
    this.load.image('circle_warning1', 'assets/circle_warning1.png');
    this.load.image('circle_warning2', 'assets/circle_warning2.png');
    this.load.image('circle_warning3', 'assets/circle_warning3.png');

    for (var i = 1; i <= 20; i++) {
      this.load.audio(i+'', ['assets/'+i+'s.mp3','assets/'+i+'s.ogg']);
    }

    this.load.on('progress', function (value) {

    });
                
    this.load.on('fileprogress', function (file) {

    });
     
    this.load.on('complete', function () {

      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

  }

  create() { 

    numbers = numbersInit.slice();
    for (var i = 1; i <= 20; i++) {
      snd[i] = this.sound.add(i);
    }

    numbers.length = numberOfNotes;

    numbers = numbers.concat(numbers);
    shuffle(numbers);

    nbColonnes=6;//nbColonnesMax
    nbLignes=((2*numberOfNotes)/nbColonnesMax);
    if (((2*numberOfNotes) % nbColonnesMax) > 0) {
      nbLignes++;
    }

    k=0;

    for (var i = 1; i <= nbColonnes; i++) {
      for (var j = 1; j <= nbLignes; j++) { 
        if (k < numberOfNotes*2){
          circle = this.add.sprite(i*110, j*100, 'circle');
          circle.setData('pos', i+''+j);
          circle.setData('num', numbers[k]);
          circle.setData('sound',eval(snd[numbers[k]]));
          circle.setData('nbPlayed',0);
          circle.setData('orderDebug',k);

          circle.setInteractive();
          circle.on('clicked', clickHandler, this);
          k++;        
        }
      }
    }  

    //  If a Game Object is clicked on, this event is fired.
    //  We can use it to emit the 'clicked' event on the game object itself.
    this.input.on('gameobjectup', function (pointer, gameObject)
    {
        gameObject.emit('clicked', gameObject);
    }, this);

    openingText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'Level '+(numberOfNotes-1),
      {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '50px',
        //fill: '#bbbbbb'
        fill: '#fff',
        align:'center',
        stroke: '#000',
        strokeThickness: 10            
      }
    );

    if(numberOfNotes-1==1){ // 1er niveau
      openingText.setText('Match identical notes\n\nAudio required /!\\');
    }



    openingText.setOrigin(0.5);

    // newLevelText = this.add.text(
    //   this.physics.world.bounds.width / 2,
    //   this.physics.world.bounds.height / 2,
    //   'Level '+(numberOfNotes-1)+'\nPress SPACE to start',
    //   {
    //     fontFamily: 'Monaco, Courier, monospace',
    //     fontSize: '60px',
    //     //fill: '#bbbbbb'
    //     fill: '#fff',
    //     align:'center'  
    //   }
    // );

    // newLevelText.setOrigin(0.5);

    // Create game over text
    gameOverText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'Game Over',
      {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '50px',
        fill: '#fff',
        align:'center',
        stroke: '#000',
        strokeThickness: 10    
      }
    );

    gameOverText.setOrigin(0.5);

    // Make it invisible until the player loses
    gameOverText.setVisible(false);

    // Create the game won text
    playerWonText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'You win !!!',
      {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '50px',
        fill: '#fff',
        align:'center'
      }
    );

    playerWonText.setOrigin(0.5);

    // Make it invisible until the player wins
    playerWonText.setVisible(false);

    scoreText = this.add.text(
      (this.physics.world.bounds.width / 2)-50,
      25,
      'Score: ' + score,
      {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '20px',
        fill: '#fff',
        align:'center'        
      });




    const helpButton = this.add.text(
      (this.physics.world.bounds.width / 10)*9
      , (this.physics.world.bounds.height / 10)*9
      , 'Help'
      , { fill: '#fff' }
    );
    helpButton
      .setInteractive()
      .on('pointerdown', showHelp);



    helpGraphics = this.add.graphics();
    var helpRect = new Phaser.Geom.Rectangle(this.physics.world.bounds.width / 10
                                        , this.physics.world.bounds.height / 10
                                        , (this.physics.world.bounds.width / 10)*8
                                        , (this.physics.world.bounds.height / 10)*8);
    helpGraphics.fillRectShape(helpRect);
    //helpGraphics.setVisible(true);
    //helpGraphics.setInteractive().on('pointerdown', showHelp);

    helpText = this.add.text(
      this.physics.world.bounds.width / 8,
      this.physics.world.bounds.height / 5,
      'Improve your ear and your memory\nby matching identical notes.\n\nEach note can only be clicked\n5 times.\n\nThe less you click,\nthe more you earn points.\n\nTry to solve the 6x6 matrix !',
      {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '30px',
        fill: '#ffffff',
        //fill: '#FF2D00',
        align:'center'  
      }
    );

    const closeHelpButton = this.add.text(
      this.physics.world.bounds.width / 2 - 100
      ,(this.physics.world.bounds.height / 10 ) * 8.3
      , 'Close X'
      , { fontSize: '36px',fill: '#fff' }
    );
    closeHelpButton
      .setInteractive()
      .on('pointerdown', showHelp);


    helpContainer = this.add.container();
    helpContainer.add([helpGraphics,helpText,closeHelpButton]);
    helpContainer.setVisible(false);



  }

  update(time) { 
    if(isgameOver){ // Game over
      highScore = 0;
      highScore = localStorage.getItem('highScore') || 0;
      highScore = Math.max(score, highScore);
      localStorage.setItem('highScore',highScore);

      if (isGameWon){
        playerWonText.setText('YOU WIN !!\n\nYou completed\nthe 6x6 matrix !!\n\nYour score: ' + score + '\nHighest score: ' + highScore);
        playerWonText.setVisible(true);        
      } else {
        gameOverText.setText('Game Over at Level ' + (numberOfNotes-1) + '\n\nYour score: ' + score + '\nHighest score: ' + highScore);
        gameOverText.setVisible(true);
      }
      gameStarted = false;

    } else if (!isWon()) { // 
      // TODO: Logic for regular game time
      if(gameStarted){
        scoreText.setText('Score: ' + score);
      }

/*
      if (!gameStarted) {
        if (cursors.space.isDown) {
          gameStarted = true;
        }
      }

      if (cursors.space.isDown) {
        gameStarted = true;
        openingText.setVisible(false);
      }
*/

    } else { // WON
      score+=numberOfNotes*40;
      gameStarted = false;
      nb_of_circles=numberOfNotes;
      if (numberOfNotes==18){ // fin du jeu
      //if (numberOfNotes==4){ // fin du jeu
        isGameWon=true;
        isgameOver=true;
      } else { // niveau suivant
        game.scene.start("selectWorld",{nb:numberOfNotes+1});
      }
    }

  }
}

function isWon() {
  return nb_of_circles==0;
}

function clickHandler(circle){

  openingText.setVisible(false);
  gameStarted = true;

  // if(!gameStarted){
  //   return;
  // }

  circle.getData('sound').play();
  nbClick++;

  circle.setData('nbPlayed',circle.getData('nbPlayed')+1);

  this.tweens.add({
    targets: circle,
    alpha: 0.8,
    scaleX: 0.8,
    scaleY: 0.8,
    duration: 50,
    yoyo:true
  });

  if(typeof tmp_circle !== 'undefined' 
    && circle.getData('pos')!=tmp_circle.getData('pos')
    && circle.getData('num')==tmp_circle.getData('num')){
      if(tmp_circle.getData('nbPlayed')<=2){
        score+=100;
      }
      if(circle.getData('nbPlayed')<=2){
        score+=100;
      }
      score += Math.max(1,(maxNbPlayed-tmp_circle.getData('nbPlayed')))*10;
      score += Math.max(1,(maxNbPlayed-circle.getData('nbPlayed')))*10;
      circle.setVisible(false);
      tmp_circle.setVisible(false);
      tmp_circle = undefined;
      nb_of_circles = nb_of_circles-2;
  } else if(circle.getData('nbPlayed') == maxNbPlayed+1) {
    isgameOver = true;
  }


  if (circle.getData('nbPlayed') == maxNbPlayed){
    circle.setTexture('circle_warning3');
  } else if (circle.getData('nbPlayed') == maxNbPlayed-1){
    circle.setTexture('circle_warning2');
  } else if (circle.getData('nbPlayed') == maxNbPlayed-2){
    circle.setTexture('circle_warning1');    
  }

  tmp_circle=circle;

}


function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function showHelp() {
  if (toggleDisplayHelp){
    helpContainer.setVisible(false);
    toggleDisplayHelp = false;
  } else {  
    helpContainer.setVisible(true);
    toggleDisplayHelp = true;       
  }
}



