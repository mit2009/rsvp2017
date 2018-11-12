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

*/

enum GameState {
  CANVAS_GAME_PLAYING,
  CHARACTER_SELECTION,
  GAME_MENU,
  HIGHSCORES,
}

let gameState: GameState = GameState.GAME_MENU;

// let selectedDangleColor = 'pink';
let gameTimer;
let ctx: CanvasRenderingContext2D;

const imageUrl = "../images/";

let characterSpeed = 0;
let spriteProperties: any = {
  floor: {
    position: {
      x: 0,
      y: 525
    },
    velocity: {
      x: -15,
      y: 0
    },
    width: 1200,
    looping: true
  },
  background_2: {
    position: {
      x: 0,
      y: 0
    },
    velocity: {
      x: -5,
      y: 0
    },
    width: 1200,
    looping: true
  },
  background_1: {
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
  dangle_pink: {
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
    totalFrames: 3,
    isBent: false
  }
}

let dangleCharacter = spriteProperties.dangle_pink;

for (const key in spriteProperties) {
  let sprite = spriteProperties[key];

  if (!sprite.totalFrames) {
    // standard image
    sprite['image'] = new Image();
    sprite.image.src = `${imageUrl}sprites_${key}.png`;
    sprite.image.onload = function () {
      console.log(`${key} image loaded`);
    }
  } else {
    // animated image
    sprite['image'] = {}
    for (let frame = 0; frame < sprite.totalFrames; frame++) {
      sprite['image'][frame] = new Image();
      sprite.image[frame].src = `${imageUrl}sprites_${key}_${frame}.png`;
      sprite.image[frame].onload = function () {
        console.log(`${key}, frame ${frame} image loaded`);
      }
    }
    if (sprite.isCharacter) {
      sprite.image['bent'] = new Image();
      sprite.image.bent.src = `${imageUrl}sprites_${key}_bent_0.png`;
    }
  }
}


function init() {
  for (let i = 0; i < 8; i++) {
    $('.dangles-list').append($(`<li class="dangle" data-dangleid="${i}">dangle</li>`))
  }
  ctx = (<HTMLCanvasElement>document.getElementById('ctx')).getContext('2d');

  // here for debugging 
  gameStart();
  // end debugging
}

function gameStart() {
  console.log('starting game!');

  gameTimer = setInterval(renderFrame, 42);
}

function renderFrame() {
  ctx.clearRect(0, 0, 600, 600);
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
      sprite.velocity.y += 9;

      if (sprite.position.y >= 385) {
        sprite.velocity.y = 0;
        sprite.position.y = 385
      }
      if (sprite.isBent) {
        spriteImageName = sprite.image['bent'];
        ctx.drawImage(spriteImageName, sprite.position.x, sprite.position.y + 70);
      } else {
        ctx.drawImage(spriteImageName, sprite.position.x, sprite.position.y);
      }
    } else {
      // normal sprite movement and generation

      if (sprite.position.x <= -sprite.width && sprite.looping) {
        sprite.position.x = 0
      }

      if (sprite.position.x <= (600 - sprite.width) && sprite.looping) {
        ctx.drawImage(spriteImageName, sprite.position.x + sprite.width, sprite.position.y);
      }

      ctx.drawImage(spriteImageName, sprite.position.x, sprite.position.y);
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

  $(document).keydown((e) => {
    if (e.keyCode == 38) {
      if (dangleCharacter.position.y == 385) {
        dangleCharacter.velocity.y = -60;
      }
      return false;
    }
    if (e.keyCode == 40) {
      dangleCharacter.isBent = true;
      return false;
    }
  });

  $(document).keyup((e) => {
    if (e.keyCode == 40) {
      dangleCharacter.isBent = false;
      return false;
    }
  });

  $(document).on('click', '.dangle', function () {
    console.log($(this).data('dangleid'));
    gameState = GameState.CANVAS_GAME_PLAYING;
    $('.character-selection').slideUp();
    gameStart();
  })

  init();
})