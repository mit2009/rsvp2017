var Debris = function (leftBound, rightBound, screenHeight, debrisObject, velX, velY) {
    this.screenHeight = screenHeight;
    var sizeScale = 2.7;
    if ($(window).width() < 400) {
        sizeScale = 3.7;
    }
    this.width = debrisObject.width / sizeScale;
    this.height = debrisObject.height / sizeScale;
    this.x = Math.random() * (rightBound - this.width - leftBound);
    this.y = - this.height - 10;
    this.velY = velY * debrisObject.speed;
    this.velX = velX;
    this.rotation = 0;
    this.collided = false;
    this.$html = $('<div class="debris"></div>');
    this.$html.css({
        height: this.height,
        width: this.width,
        backgroundImage: "url('assets/debris/" + debrisObject.img + "')",
        left: this.x,
        top: this.y
    })
    this.debrisObject = debrisObject;
    this.debrisType = debrisObject.debrisType;
    $('.game-stage-area').append(this.$html);
};

Debris.prototype = {
    move: function (gemCollection) {
        this.y += this.velY;
        this.x += this.velX;
        if (this.debrisObject.rotationSpeed) {
            this.rotation += this.debrisObject.rotationSpeed * 20;
        }
        // check for collision here i guess?
        // iunno how wide is product man
        // this wide

        if (pmanX + pmanWidth - pmanMarginOffset > this.x && pmanX - pmanMarginOffset < this.x + this.width && this.y + this.height > pmanY + 20 && this.y < pmanY + pmanHeight - 100 && !this.collided) { // last digit should be pmanheight fix because his legs are long idk
            this.collided = true;
            if (this.debrisType == 'GEM') {
                this.$html.remove();
                gemCollection.gemFound(this.debrisObject.color)
                return false;
            } else {
                $('.game-over-specific-caption').text(this.debrisObject.message);
                gameState = 'GAME_STOPPED'
            }
        }
        if (this.y > this.screenHeight) {
            this.$html.remove();
            return false;
        } else {
            return true;
        }
    },
    render: function () {
        this.$html.css({
            left: this.x,
            top: this.y,
            transform: "rotate(" + this.rotation + "deg)"
        })
    }
}

var GemCollection = function () {
    this.clearGems();
}

GemCollection.prototype = {
    clearGems: function (callback) {
        this.collectedGems = {}
        this.$html = $('<div></div>');
        for (i in availableGems) {
            gem = availableGems[i];
            color = gem.color;
            this.collectedGems[color] = {};
            this.collectedGems[color].$html = $('<div class="gem-status"><img class="empty-gem" src="assets/debris/' + color + '_empty.png"></div>');
            this.collectedGems[color].found = false;
            this.$html.append(this.collectedGems[color].$html)
        }
        if (callback) {
            callback();
        }
    },
    addBonusScore: function (v) {
        var _value = v;
        $('.bonus-score').text('+' + v);
        $('.bonus-score').fadeIn(500, function () {
            bonusPoints += _value;
            $('.bonus-score').fadeOut();
        })
    },
    allGemsCollected: function () {
        var _this = this;
        this.addBonusScore(1000);
        $('.underscore').animate({
            left: '-400px'
        }, 600, function () {
            _this.clearGems(function () {
                $('.underscore').animate({
                    left: 20
                });
            })
        });

    },
    getUnacquiredGem: function () {
        gemIds = Object.keys(availableGems).sort(function () {
            return .5 - Math.random();
        });
        for (k in gemIds) {
            i = gemIds[k]
            color = availableGems[i].color
            if (!this.collectedGems[color].found) {
                return availableGems[i];
            }
        }
        return availableGems[0];
    },
    gemFound: function (color) {
        this.collectedGems[color].$html = $('<div class="gem-status"><img src="assets/debris/' + color + '.png"></div>');
        this.collectedGems[color].found = true;
        this.$html = $('<div></div>');
        for (i in availableGems) {
            gem = availableGems[i];
            color = gem.color;
            this.$html.append(this.collectedGems[color].$html)
        }
        var totalGems = 0;
        for (i in this.collectedGems) {
            if (this.collectedGems[i].found) {
                totalGems++;
            }
        }
        this.addBonusScore(100);

        if (totalGems == 8) {
            setTimeout(function (_this) {
                _this.allGemsCollected();
            }, 500, this)
            for (i in this.collectedGems) {
                this.collectedGems[i].found = false;
            }
        }
    },
    render: function () {
        $('.underscore').html(this.$html);
    }
}

var DebrisCollection = function () {
    this.debrisList = [];
    this.lastDebrisTick = 0;
    this.minTicksPassedBeforeNewDebris = Math.max(0, 40 - ($(window).width() / 375) * 7.5); // to give smaller screens a bit of an advantage
    this.debrisSelection = 2;
    this.difficulty = 0.25;
    this.difficultyVel = 0.2;
    this.gemCollection = new GemCollection();
}

DebrisCollection.prototype = {
    maybeAdjustDifficulty: function () {
        this.difficulty = Math.min(this.difficulty + this.difficultyVel, 3);
        this.minTicksPassedBeforeNewDebris = Math.max(this.minTicksPassedBeforeNewDebris - this.difficultyVel, 0)
    },
    removeAll: function () {
        for (i in this.debrisList) {
            this.debrisList[i].$html.fadeOut(300, function () {
                $(this).remove();
            })
        }
    },
    mightAddNewDebris: function (tickNumber) {
        if (tickNumber - this.lastDebrisTick > this.minTicksPassedBeforeNewDebris) {
            if (Math.random() < this.difficulty) {
                // time to give it a debris

                var debrisObject;

                if (Math.random() < 0.3) {
                    // probability of spouting a missing gem
                    if (Math.random() < 0.8) {
                        // majority of the time it'll give you a gem you don't have
                        debrisObject = this.gemCollection.getUnacquiredGem();
                    } else {
                        k = Math.floor(Math.random() * Object.keys(availableGems).length);
                        debrisObject = availableGems[k];
                    }

                } else {
                    k = Math.floor(Math.random() * this.debrisSelection);
                    debrisObject = availableDebris[k];

                }

                velX = Math.min(this.difficulty, 10);
                velX = Math.random() < 0.5 ? -velX : velX;
                velY = Math.min(this.difficulty * 5 + Math.random() * 7 * this.difficulty, 150);
                debris = new Debris(- 20, $(window).width() + 20, $(window).height(), debrisObject, velX, velY);

                this.debrisList.push(debris);
                this.lastDebrisTick = tickNumber;
            }
        }
        if (tickNumber % 380 == 0) {
            this.maybeAdjustDifficulty();
        }
        if (tickNumber % 300 == 0) { // default 300
            this.debrisSelection = Math.min(this.debrisSelection + 1, Object.keys(availableDebris).length)
        }
    },
    progressDebris: function () {
        var removeIndex = -1;
        for (i in this.debrisList) {
            debris = this.debrisList[i];
            if (!debris.move(this.gemCollection)) {
                removeIndex = parseInt(i);
            }
        }
        if (removeIndex >= 0) {
            // take out the trash
            this.debrisList = this.debrisList.slice(0, removeIndex).concat(this.debrisList.slice(removeIndex + 1));
        }
    },
    renderDebris: function () {
        for (i in this.debrisList) {
            debris = this.debrisList[i];
            debris.render();
        }
        this.gemCollection.render();
    },
    tick: function (tickNumber) {
        this.mightAddNewDebris(tickNumber);
        this.progressDebris();
        this.renderDebris();
    }
}
