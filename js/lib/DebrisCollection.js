var Debris = function (leftBound, rightBound, screenHeight) {
    this.screenHeight = screenHeight;
    this.width = 80;
    this.height = 80;
    this.x = Math.random()*(rightBound-this.width-leftBound);
    this.y = -60;
    this.velY = 10 + Math.random()*20;
    this.velX = 0;
    this.$html = $('<div class="debris">i am a bad product!</div>');
    $('.game-stage-area').append(this.$html);
};

Debris.prototype = {
    move: function() {
        this.y += this.velY;
        this.x += this.velX;
        // check for collision here i guess?
        // iunno how wide is product man
        // this wide
        console.log(pmanWidth);
        if (this.x + this.width > pmanX && this.x < pmanX + pmanWidth && this.y + this.height > pmanY && this.y < pmanY + 40) { // last digit should be pmanheight fix because his legs are long idk
            gameState = 'GAME_STOPPED'
        }
        if (this.y > this.screenHeight) {
            this.$html.remove();
            return false;
        } else {
            return true;
        }
    },
    render: function() {
        this.$html.css({
            left: this.x,
            top: this.y
        })
    }
}

var DebrisCollection = function () {
    this.debrisList = [];
    this.lastDebrisTick = 0;
    this.minTicksPassedBeforeNewDebris = 20;
    this.difficulty = 0.5;
    this.difficultyVel = 1;
};

DebrisCollection.prototype = {
    maybeAdjustDifficulty: function() {
        this.difficulty = Math.min(this.difficulty + this.difficultyVel, 1);
        this.minTicksPassedBeforeNewDebris = Math.max(this.minTicksPassedBeforeNewDebris - this.difficultyVel, 0)
    },
    mightAddNewDebris: function (tickNumber) {   
        if (tickNumber - this.lastDebrisTick > this.minTicksPassedBeforeNewDebris) {
            if (Math.random() < this.difficulty) {
                this.lastDebrisTick = tickNumber;
                debris = new Debris(0, $(window).width(), $(window).height());
                this.debrisList.push(debris);
            }
        }
        if (tickNumber % 100 == 0) {
            this.maybeAdjustDifficulty();
        }
    },
    progressDebris: function() {
        var removeIndex = -1;
        for (i in this.debrisList) {
            debris = this.debrisList[i];
            if (!debris.move()) {
                removeIndex = parseInt(i);
            }
        }
        if (removeIndex >= 0) {
            // take out the trash
            this.debrisList = this.debrisList.slice(0, removeIndex).concat(this.debrisList.slice(removeIndex + 1));
        }
    },
    renderDebris: function() {
        for (i in this.debrisList) {
            debris = this.debrisList[i];
            debris.render();
        }
    },
    tick: function (tickNumber) {
        this.mightAddNewDebris(tickNumber);
        this.progressDebris();
        this.renderDebris();
    }
}
