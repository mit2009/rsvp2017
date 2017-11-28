var timer;
var gameState = 'WAITING_TO_START';
var mouseX = -1;
var pmanY, pmanWidth, pmanHeight;
var debrisCollection;

$(document).mousemove(function (event) {
    mouseX = event.pageX;
});

function clearStageForGame() {
    $('.mobile-overflow-container').animate({
        top: '100%'
    }, 100, function () { // SUPERSPEED
        $('.instructions').fadeIn(100);
        $('.product-man').fadeIn(100);
    })
};

function updatePmanPosition() {
    if (gameState == 'GAME_STARTED') {
        productManPosX = parseFloat($('.product-man').css('left'));
        $('.product-man').css({
            left: productManPosX - (productManPosX - mouseX) / 3
        })
    }
    pmanX = parseInt($('.product-man').css('left'));
    pmanY = parseInt($('.product-man').css('top'));
    pmanWidth = parseInt($('.product-man').css('width'));
    pmanHeight = parseInt($('.product-man').css('height'));
};


function loop(tick) {
    if (gameState == 'GAME_STARTED') {
        updatePmanPosition();
        debrisCollection.tick(tick);
        $('.score-num').text(tick);
    } else if (gameState == 'GAME_STOPPED') {
        console.log('GAME OVER, SCORE:', timer.getNumTicks());
        timer.stop();
    }
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

    setTimeout(clearStageForGame, 100); //SUPERSPEED
    // clearStageForGame();
}