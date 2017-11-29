var timer;
var gameState = 'WAITING_TO_START';
var mouseX = -1;
var pmanY, pmanWidth, pmanHeight, pmanMarginOffset;
var debrisCollection;
var sessionId;
var collectedGems = [];
var bonusPoints = 0;

$(document).mousemove(function (event) {
    mouseX = event.pageX;
});

function clearStageForGame() {
    $('.photo-background').fadeOut(100);
    $('.cloud-left').fadeOut(100);
    $('.cloud-right').fadeOut(100);
    $('.mobile-overflow-container').animate({
        top: '100%'
    }, 100, function () { // SUPERSPEED
        $('.instructions').fadeIn(100);
        $('.product-man').fadeIn(100);
        $('.score').fadeIn(100);
    })
};

function updatePmanPosition() {
    if (gameState == 'GAME_STARTED') {
        productManPosX = parseFloat($('.product-man').css('left'));
        $('.product-man').css({
            left: productManPosX - (productManPosX - mouseX) / 3,
            transform: 'rotate(' + (-(productManPosX - mouseX) / 10) + 'deg)'
        })
    }
    pmanMarginOffset = 20;
    pmanX = parseInt($('.product-man').css('left'));
    pmanY = parseInt($('.product-man').css('top'));
    pmanWidth = parseInt($('.product-man').css('width'));
    pmanHeight = parseInt($('.product-man').css('height'));
};


function loop(tick) {
    // gameState = 'GAME_STOPPED';
    // debugging

    if (gameState == 'GAME_STARTED') {
        updatePmanPosition();
        debrisCollection.tick(tick);
        $('.score-num').text(tick + bonusPoints);
    } else if (gameState == 'GAME_STOPPED') {
        var ticks = timer.getNumTicks();
        timer.stop();
        productManPosX = parseFloat($('.product-man').css('left'));
        var explosionWidth = parseInt($("#explosion").css("width"));
        $('.product-man').fadeOut(100);
        $("#explosion").css({
            left: productManPosX - (explosionWidth / 2 - pmanWidth / 2),
            "background-image": 'url("../assets/debris/explosion1.png")',
        }).fadeIn(100);
        var explosionGraphic = 2;
        var clearId = setInterval(function() {
            $("#explosion").css({
                "background-image": 'url("../assets/debris/explosion' + explosionGraphic + '.png")',
            });
            explosionGraphic += 1;
            if (explosionGraphic > 6) {
                clearInterval(clearId);
            }
        }, 85)
        $.post(SERVER_URL + "/end", { sessionId: sessionId, score: ticks+bonusPoints }, function (response) {
            if (response.success) {
                $("#score-form").fadeIn();
                $("#score-form").submit(function (event) {
                    event.preventDefault();
                    var name = $("#score-name").val();
                    if (name.length > 0) {
                        $.post(SERVER_URL + "/updateName", { sessionId: sessionId, name: name }, function (response) {
                            if (response.success) {
                                $("#score-form-error").fadeOut();
                                $("#score-form").fadeOut();
                                $.get(SERVER_URL + "/scores/10", function (response) {
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
    $.post(SERVER_URL + "/start", function (response) {
        if (response.error === undefined) {
            sessionId = response.sessionId;
        }
    }).always(function () {
        // 24 frames per second- lets see what happens. 
        // Im sorry, slow computers :|
        timer = new Timer(42, loop);
        timer.run();
    });
}

function init() {
    $('.product-man').click(function () {
        if (gameState == 'WAITING_TO_START') {
            startGame();
        }
    })

    $('.end-replay').click(function () {
        if (gameState == 'GAME_STOPPED') {
            $("#score-table").fadeOut();
            debrisCollection.removeAll();
            $("#explosion").fadeOut(0);
            $(".product-man").fadeIn(100);
            startGame();
            bonusPoints = 0;
            collectedGems = 0;
        }
    });

    $('.end-back').click(function () {
        location.reload();
    });

    $('body').on('touchmove', '.dragbar', function (e) {
        console.log(e);
        mouseX = e.originalEvent.touches[0].pageX;
    })

    setTimeout(clearStageForGame, 100); //SUPERSPEED
    // clearStageForGame();
}