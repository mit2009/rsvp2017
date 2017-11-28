var timer;
var gameState = 'WAITING_TO_START';
var mouseX = -1;
var debrisCollection;

var currentMousePos = { x: -1, y: -1 };

$(document).mousemove(function (event) {
    mouseX = event.pageX;
});

function clearStageForGame() {
    $('.mobile-overflow-container').animate({
        top: '100%'
    }, 1200, function () {
        $('.instructions').fadeIn();
        $('.product-man').fadeIn();
    })
};

function updatePmanPosition() {
    if (gameState == 'GAME_STARTED') {
        productManPosX = parseFloat($('.product-man').css('left'));
        $('.product-man').css({
            left: productManPosX - (productManPosX - mouseX) / 3
        })
    }
};


function loop(tick) {
    updatePmanPosition();
    debrisCollection.tick(tick);
};

function startGame() {
    console.log('starting game');
    gameState = 'GAME_STARTED';
    debrisCollection = new DebrisCollection();
    $('.instructions').fadeOut();
    // 24 frames per second- lets see what happens. 
    // Im sorry, slow computers :|
    timer = new Timer(42, loop);
    timer.run();
}

function init() {

    $('.product-man').click(function () {
        startGame();
    })

    setTimeout(clearStageForGame, 1000);
    // clearStageForGame();
}