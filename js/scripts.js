var timer;
var gameState = 'WAITING_TO_START';
var mouseX = -1;
var pmanX, pmanY, pmanWidth, pmanHeight, pmanMarginOffset;
var debrisCollection;
var sessionId;
var collectedGems = [];
var bonusPoints = 0;

$(document).mousemove(function (event) {
    mouseX = event.pageX;
});

function clearStageForGame() {
    $('.photo-background').fadeOut(500);
    $('.cloud-left').fadeOut(500);
    $('.cloud-right').fadeOut(500);
    $('.mobile-overflow-container').animate({
        top: '100%'
    }, 500, function () { // SUPERSPEED
        $('.instructions').fadeIn(500);
        $('.dragbar').fadeIn(500);
        $('.product-man').fadeIn(500);
        $('.score').fadeIn(500);
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
    if (!pmanY) {
        pmanY = $(window).height() - parseInt($('.product-man').css('bottom')) - pmanHeight + 50;
    }
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
            "background-image": 'url("assets/debris/explosion1.png")',
        }).fadeIn(100);
        var explosionGraphic = 2;
        var clearId = setInterval(function () {
            $("#explosion").css({
                "background-image": 'url("assets/debris/explosion' + explosionGraphic + '.png")',
            });
            explosionGraphic += 1;
            if (explosionGraphic > 6) {
                clearInterval(clearId);
            }
        }, 85)
        $.post(SERVER_URL + "/end", { sessionId: sessionId, score: ticks + bonusPoints, urlParams: urlP.replace(/[^0-9a-zA-Z]/g, "") }, function (response) {
            if (response.success) {
                $("#score-form").fadeIn();
                $("#score-form").submit(function (event) {
                    event.preventDefault();
                    var name = $("#score-name").val();
                    if (name.length > 0) {
                        $.post(SERVER_URL + "/updateName", { sessionId: sessionId, name: name, urlParams: urlP.replace(/[^0-9a-zA-Z]/g, "") }, function (response) {
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
                console.log(response);
            }
        });
    }
};

function startGame() {
    console.log("Please, please don't hack me");
    console.log("I just wanted a quick game");
    console.log("This is a Haiku");
    console.log("\n");
    console.log("Love,");
    console.log("Victor");

    $('body').addClass('no-select')
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
        mouseX = e.originalEvent.touches[0].pageX;
    })

    $('.play-btn').on('click', function () {
        clearStageForGame();
    });

    //setTimeout(clearStageForGame, 2000); //SUPERSPEED
}