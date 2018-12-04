import * as $ from 'jquery';
/*

This was the story from 2017:

** some discussion about getting the RSVP page up and running **

[pause]

Charlene: Reasonably, is it possible to still make a game before Tomorrow morning?
Victor: haha
hahaha
Charlene: lol. nvm.

[5 hours & some discussions later]

Charlene: For the high score, is it a good idea to have people put "name" on the high score board

----

This game was lovingly made and programmed in under 10 hours
Thank to everyone involved
Sorry, Steph

---

AND NOW here is the story for 2018:

David: Well, we had one last year, so we should probably have a game this year as well

----

This game was unlovingly made in 42 hours
UNLOVINGLY

----

*/

var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

enum GameState {
  CANVAS_GAME_PLAYING,
  CHARACTER_SELECTION,
  GAME_MENU,
  HIGHSCORES,
}

let gameState: GameState = GameState.GAME_MENU;

// let selectedDangleColor = 'pink';
let gameTimer;
let longholdTimer;
let ctx: CanvasRenderingContext2D;

const imageUrl = "./images/game/";
let canvasSize = 600;

let spriteProperties: any;
let dangerArrayProperties: any;
let dangerArray: any;
let dangleCharacter;
let keyUpIsDown
let startingLivesNumber = 2;
let lives;
let smootsRun: number = 0;


let requiredLoadables = 5 + 8 + 5 + 2 // 8 is knives, 5 is dangles, 1 is bent, 1 is dead, 1 is start
let trackedLoadables = 0;

function updateLoadables() {
  trackedLoadables++;
  console.log(requiredLoadables, trackedLoadables);
  if (trackedLoadables >= requiredLoadables) {
    // everything is loaded, start game
    console.log('game timer', gameTimer);
    if (!gameTimer) {
      gameTimer = setInterval(renderFrame, 52);
    }
  }
}


function setup() {
  trackedLoadables = 0;

  // Set Lives
  lives = startingLivesNumber;
  $('.lives-left').text(lives)

  // Set Score
  smootsRun = 0;
  $('.smoots-run').text(smootsRun);

  let scene = ['', 'forest_', 'mit_', 'space_'][Math.floor(Math.random() * 4)]
  let background_0 = scene + 'background_0';
  let background_1 = scene + 'background_1';
  let background_2 = scene + 'background_2';
  let floor = scene + 'floor';

  spriteProperties = {
    [background_0]: {
      position: {
        x: 0,
        y: 0
      },
      velocity: {
        x: 0,
        y: 0
      },
      width: 600,
      looping: true
    },
    [floor]: {
      position: {
        x: 0,
        y: 525
      },
      velocity: {
        x: -35,
        y: 0
      },
      width: 1200,
      looping: true
    },
    [background_2]: {
      position: {
        x: 0,
        y: 0
      },
      velocity: {
        x: -3,
        y: 0
      },
      width: 1200,
      looping: true
    },
    [background_1]: {
      position: {
        x: 0,
        y: 225
      },
      velocity: {
        x: -15,
        y: 0
      },
      width: 1200,
      looping: true
    },
    dangle: {
      position: {
        x: 30,
        y: 385
      },
      velocity: {
        x: 0,
        y: 0
      },
      isCharacter: true,
      frameTransitionSpeed: 0.5,
      currentFrame: 0,
      totalFrames: 5,
      isBent: false,
      width: 140,
      height: 140,
      isInvincible: false,
      isDead: false,
      characterOpacity: 1,
    }
  }


  dangerArrayProperties = {
    position: {
      x: canvasSize * 2,
      y: 0,
    },
    velocity: {
      x: -40,
      y: 0
    },
    image: {},
    width: 150,
    height: 50,
    spacesSinceLastKnife: 0,
    minSpacesBeforeNextKnife: 10
  }

  dangerArray = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0]
  ]

  dangleCharacter = spriteProperties.dangle;
  keyUpIsDown = 0;

  for (const key in spriteProperties) {
    let sprite = spriteProperties[key];
    let imageFileName;

    if (sprite.isCharacter) {
      let spriteColor = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'silver'][Math.floor(Math.random() * 8)]
      imageFileName = key + "_" + spriteColor;
    } else {
      imageFileName = key;
    }

    if (!sprite.totalFrames) {
      // standard image
      sprite['image'] = new Image();

      sprite.image.src = `${imageUrl}${imageFileName}.png`;
      sprite.image.onload = function () {
        updateLoadables();
        console.log(`${key} image loaded`);
      }
    } else {
      // animated image
      sprite['image'] = {}
      for (let frame = 0; frame < sprite.totalFrames; frame++) {
        sprite['image'][frame] = new Image();
        sprite.image[frame].src = `${imageUrl}${imageFileName}_${frame}.png`;
        sprite.image[frame].onload = function () {
          updateLoadables();
          console.log(`${key}, frame ${frame} image loaded`);
        }
      }
      if (sprite.isCharacter) {

        sprite.image['bent'] = new Image();
        sprite.image.bent.src = `${imageUrl}${imageFileName}_bent.png`;
        sprite.image.bent.onload = function () {
          updateLoadables();
          console.log(`bent image loaded`);
        }

        sprite.image['dead'] = new Image();
        sprite.image.dead.src = `${imageUrl}${imageFileName}_dead.png`;
        sprite.image.dead.onload = function () {
          updateLoadables();
          console.log(`dead image loaded`);
        }
      }
    }
  }

  // generate knife objects
  for (let i = 0; i < 8; i++) {
    dangerArrayProperties.image[i] = new Image();
    dangerArrayProperties.image[i].src = `${imageUrl}knife_${i}.png`;
    dangerArrayProperties.image[i].onload = function () {
      updateLoadables();
      console.log(`${i} image loaded`);
    }
  }
}

function init() {
  for (let i = 0; i < 8; i++) {
    $('.dangles-list').append($(`<li class="dangle" data-dangleid="${i}">dangle</li>`))
  }
  ctx = (<HTMLCanvasElement>document.getElementById('ctx')).getContext('2d');
  gameStart();
}

function gameStart() {
  setup();

  // ideally use renderFrame() and request animation frame- will change 
  // over if I have time. 
}

function renderFrame() {
  smootsRun += !dangleCharacter.isBent ? 0.5 : 0.1;
  $('.smoots-run').text(Math.floor(smootsRun));
  ctx.clearRect(0, 0, canvasSize, canvasSize);


  // Render all sprites
  for (const key in spriteProperties) {
    let sprite = spriteProperties[key];
    let spriteImageName;

    if (sprite.totalFrames) {
      spriteImageName = sprite.image[Math.floor(sprite.currentFrame)];
      sprite.currentFrame = (sprite.currentFrame + sprite.frameTransitionSpeed) % sprite.totalFrames;
    } else {
      spriteImageName = sprite.image
    }

    // everything obeys physics
    sprite.position.x += sprite.velocity.x
    sprite.position.y += sprite.velocity.y

    // character logic is more complicated, handling it here and assuming no other characters in the future
    if (sprite.isCharacter) {
      sprite.velocity.y += 8;

      if (sprite.position.y >= 385) {
        sprite.velocity.y = 0;
        sprite.position.y = 385
      }
      ctx.globalAlpha = sprite.characterOpacity;
      if (sprite.isBent) {
        spriteImageName = sprite.image['bent'];
        ctx.drawImage(spriteImageName, sprite.position.x, sprite.position.y + 70);
      } else if (sprite.isDead) {
        spriteImageName = sprite.image['dead'];
        ctx.drawImage(spriteImageName, sprite.position.x, sprite.position.y + 70);
      } else {
        ctx.drawImage(spriteImageName, sprite.position.x, sprite.position.y);
      }
      ctx.globalAlpha = 1;
    } else {
      // normal sprite movement and generation

      if (sprite.position.x < -sprite.width - sprite.velocity.y && sprite.looping) {
        sprite.position.x = sprite.velocity.x;
      }

      if (sprite.position.x < (600 - sprite.width) && sprite.looping) {
        ctx.drawImage(spriteImageName, sprite.position.x + sprite.width, sprite.position.y);
      }

      ctx.drawImage(spriteImageName, sprite.position.x, sprite.position.y);

    }
  }

  // Render the danger objects
  let firstDangerElement = Math.max(0, Math.floor(-dangerArrayProperties.position.x / dangerArrayProperties.width) - 1)
  let lastDangerElement = firstDangerElement + canvasSize / dangerArrayProperties.width + 2;

  for (let dangerIndex = firstDangerElement; dangerIndex < lastDangerElement; dangerIndex++) {

    for (let knifeLevel = 0; knifeLevel < 5; knifeLevel++) {

      if (dangerArray[dangerIndex][knifeLevel] > 0 && !dangleCharacter.isDead) {
        let knifeX = dangerArrayProperties.position.x + dangerIndex * dangerArrayProperties.width
        let knifeY = 525 - knifeLevel * (dangerArrayProperties.height + 25) - dangerArrayProperties.height - 20;

        ctx.drawImage(dangerArrayProperties.image[dangerArray[dangerIndex][knifeLevel] - 1], knifeX, knifeY);

        //check collision
        let knifeW = dangerArrayProperties.width;
        let knifeH = dangerArrayProperties.height;
        let dangleX = dangleCharacter.position.x;
        let dangleY = dangleCharacter.position.y;
        let dangleW = dangleCharacter.width;
        let dangleH = dangleCharacter.height - 10;
        if (dangleCharacter.isBent) {
          dangleH /= 2;
          dangleY += dangleH
        }
        let dangleTheta = Math.atan(dangleH / (dangleW / 2))
        // check Y

        /*
        ctx.beginPath();
        ctx.moveTo(0, knifeY);
        ctx.lineTo(300, knifeY);
        ctx.strokeStyle = "black";
        ctx.strokeWidth = 2
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, dangleY + dangleH);
        ctx.lineTo(300, dangleY + dangleH);
        ctx.strokeStyle = "red";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, knifeY + knifeH);
        ctx.lineTo(300, knifeY + knifeH);
        ctx.strokeStyle = "black";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, dangleY + Math.tan(dangleTheta) * (knifeX - dangleX - dangleW / 2));
        ctx.lineTo(300, dangleY + Math.tan(dangleTheta) * (knifeX - dangleX - dangleW / 2));
        ctx.strokeStyle = "green";
        ctx.stroke();
        */

        let legs = 30
        let dangleA = (knifeY + knifeH - dangleY) / Math.tan(dangleTheta);
        let adjustedH = Math.max(dangleY + Math.tan(dangleTheta) * (knifeX - dangleX - dangleW / 2), dangleY)
        // checks the top and bottom
        if (knifeY < dangleY + dangleH - legs &&
          knifeY + knifeH > adjustedH) {

          // checks the left and right side
          if (knifeX < dangleA + dangleW / 2 + dangleX && knifeX + knifeW > dangleX + dangleW / 2 - dangleA) {

            if (!dangleCharacter.isInvincible) {
              // Collided

              if (lives < 1 && !dangleCharacter.isDead) {
                window.clearInterval(gameTimer);
                gameTimer = null;
                dangleCharacter.isDead = true;
                setTimeout(() => {
                  console.log('oh no dead');
                  renderFrame();
                  $('.game-over-overlay').css('display', 'flex').addClass('show');
                }, 500);
              } else {
                lives--;
                $('.lives-left').text(lives)
              }

              // LOL IN THE SPIRIT OF GETTING THIS DONE
              // SORRY, TIMEOUT CALLBACK TREE
              dangleCharacter.isInvincible = true;
              dangleCharacter.characterOpacity = 0.3;
              setTimeout(() => {
                dangleCharacter.characterOpacity = 1;
                setTimeout(() => {
                  dangleCharacter.characterOpacity = 0.3;
                  setTimeout(() => {
                    dangleCharacter.characterOpacity = 1;
                    setTimeout(() => {
                      dangleCharacter.characterOpacity = 0.3;
                      setTimeout(() => {
                        dangleCharacter.characterOpacity = 1;
                        dangleCharacter.isInvincible = false;
                      }, 500)
                    }, 300)
                  }, 300)
                }, 300)
              }, 300)

            }

          }
        }

        /*
        ctx.beginPath();
        ctx.moveTo(knifeX, 0);
        ctx.lineTo(knifeX, 300);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(dangleA + dangleW + dangleX / 2, 0);
        ctx.lineTo(dangleA + dangleW + dangleX / 2, 300);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke();
*/

      }
    }
  }
  dangerArrayProperties.position.x += dangerArrayProperties.velocity.x

  // Add danger array items
  // only add more array elements when running close to the end
  if (lastDangerElement > dangerArray.length - 1) {
    if (dangerArrayProperties.spacesSinceLastKnife >= Math.round(dangerArrayProperties.minSpacesBeforeNextKnife)) {
      if (dangerArrayProperties.minSpacesBeforeNextKnife > 3) {
        dangerArrayProperties.minSpacesBeforeNextKnife -= 0.03;
      }
      if (dangerArrayProperties.velocity.x > -110) {
        dangerArrayProperties.velocity.x -= 0.5;
      }

      let knifeArray = [0, 0, 0, 0, 0]
      knifeArray[Math.floor(Math.random() * 4)] = Math.floor(Math.random() * 8) + 1;
      dangerArray.push(knifeArray);
      dangerArrayProperties.spacesSinceLastKnife = 0;
    } else {
      dangerArray.push([0, 0, 0, 0, 0]);
      dangerArrayProperties.spacesSinceLastKnife++;
    }
  }

}

$(() => {

  $('.play-game-btn').on('click', () => {
    if (gameState === GameState.GAME_MENU) {
      gameState = GameState.CHARACTER_SELECTION;
      $('.game-menu').slideUp();
      $('.character-selection').slideDown();
    }
  })

  function startJump() {

    keyUpIsDown = 1;
    // up you go
    if (dangleCharacter.position.y == 385) {
      dangleCharacter.velocity.y = -50;
      longholdTimer = setTimeout(() => {
        if (keyUpIsDown > 0) {
          if (dangleCharacter.velocity.y < 0 && dangleCharacter.position.y < 380 && dangleCharacter.position.y > 200) {
            dangleCharacter.velocity.y = -55;
          }
        }
      }, 200);
    }
  }

  function endJump() {
    keyUpIsDown = 0;
    clearTimeout(longholdTimer);
  }

  function startBent() {
    dangleCharacter.isBent = true;
  }

  function endBent() {
    dangleCharacter.isBent = false;
  }

  function restart() {
    requiredLoadables = 19;
    dangleCharacter.isDead = false;
    console.log('restarting game...')

    $('.game-over-overlay').hide().removeClass('show');
    gameStart();
  }

  $(document).keydown((e) => {
    if (e.keyCode == 38 || e.keyCode == 32) {
      if (!dangleCharacter.isDead || !$('.game-over-overlay').hasClass('show')) {
        startJump();
      } else {
        restart();
      }
    }
    if (e.keyCode == 40 || e.keyCode == 16) {
      startBent();
    }
    return false;
  });

  $(document).keyup((e) => {
    if (e.keyCode == 40 || e.keyCode == 16) {
      endBent();
    }
    if (e.keyCode == 38 || e.keyCode == 32) {
      endJump();
    }
    return false;
  });

  $('.jump-btn').on('mousedown touchstart', () => {
    startJump();
  });

  $('.jump-btn').on('mouseup touchend', () => {
    endJump();
  });

  $('.crouch-btn').on('mousedown touchstart', () => {
    startBent();
  });

  $('.crouch-btn').on('mouseup touchend', () => {
    endBent();
  });

  $('.retry-btn').on('mousedown touchstart', () => {
    if (dangleCharacter.isDead) {
      restart();
    }
  })

  $('.start-btn').on('mousedown touchstart', () => {
    updateLoadables();
    $('.game-start-overlay').fadeOut(function () {
      $('.game-start-overlay').remove()
    });
  })



  $(document).on('click', '.dangle', function () {
    console.log($(this).data('dangleid'));
    gameState = GameState.CANVAS_GAME_PLAYING;
    $('.character-selection').slideUp();
    gameStart();
  })

  init();
})