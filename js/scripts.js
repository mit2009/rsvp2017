var timer;
var gameState = 'WAITING_TO_START';
var mouseX = -1;
var pmanY, pmanWidth, pmanHeight;
var debrisCollection;
var sessionId;

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
        var ticks = timer.getNumTicks();
        console.log('GAME OVER, SCORE:', timer.getNumTicks());
        timer.stop();
        $.post(SERVER_URL + "/end", { sessionId: sessionId, score: ticks }, function(response) {
            if (response.success) {
                $("#score-form").fadeIn();
                $("#score-form").submit(function(event) {
                    event.preventDefault();
                    var name = $("#score-name").val();
                    if (name.length > 0) {
                        $.post(SERVER_URL + "/updateName", { sessionId: sessionId, name: name }, function(response) {
                            if (response.success) {
                                $("#score-form-error").fadeOut();
                                $("#score-form").fadeOut();
                                $.get(SERVER_URL + "/scores/10", function(response) {
                                    // add to table
                                    if (response !== undefined && response.scores !== undefined) {
                                        $("#score-table-body").empty();
                                        for (var score of response.scores) {
                                            $("#score-table-body").append(`<tr><td>${score.name}</td><td>${score.score}</td></tr>`);
                                        }
                                        $("#score-table").fadeIn();
                                    }
                                });
                            } else {
                                $("#score-form-error").fadeIn();
                            }
                        })
                    }
                });
            } else {
                console.log(error, response);
            }
        })
    }
};

function startGame() {
    console.log('starting game');
    gameState = 'GAME_STARTED';
    debrisCollection = new DebrisCollection();
    $('.instructions').fadeOut();
    $.post(SERVER_URL + "/start", function(response) {
        if (response.error === undefined) {
            sessionId = response.sessionId;
        }
        // 24 frames per second- lets see what happens. 
        // Im sorry, slow computers :|
        timer = new Timer(42, loop);
        timer.run();
    });
}

function init() {
    $('.product-man').click(function () {
        startGame();
    })

    setTimeout(clearStageForGame, 100); //SUPERSPEED
    // clearStageForGame();
}