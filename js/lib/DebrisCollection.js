var Debris = function (leftBound, rightBound, screenHeight, debrisObject, velX, velY) {
    this.screenHeight = screenHeight;
    this.width = debrisObject.width/3;
    this.height = debrisObject.height/3;
    this.x = Math.random() * (rightBound - this.width - leftBound);
    this.y = -this.height;
    this.velY = velY * debrisObject.speed;
    this.velX = velX;
    this.$html = $('<div class="debris"></div>');
    this.$html.css({
        height: this.height,
        width: this.width,
        backgroundImage: "url('assets/debris/" + debrisObject.img + "')",
        left: this.x,
        top: this.y
    })
    $('.game-stage-area').append(this.$html);
};

Debris.prototype = {
    move: function () {
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
    render: function () {
        this.$html.css({
            left: this.x,
            top: this.y
        })
    }
}

var DebrisCollection = function () {
    this.debrisList = [];
    this.lastDebrisTick = 0;
    this.minTicksPassedBeforeNewDebris = 30;
    this.debrisSelection = 2;
    this.difficulty = 0.5;
    this.difficultyVel = 1;

    this.availableDebris = {
        0: {
            img: 'spinner.png',
            width: 302,
            height: 302,
            speed: 1,
        },
        1: {
            img: 'shakeweight.png',
            width: 382,
            height: 278,
            speed: 1,
        },
        2: {
            img: 'juicero.png',
            width: 302 * 1.5,
            height: 302 * 1.5,
            speed: 1,
        },
        3: {
            img: 'car.png',
            width: 587 * 1.5,
            height: 235 * 1.5,
            speed: 0.8,
        },
        4: {
            img: 'zune.png',
            width: 302,
            height: 302,
            speed: 3,
        }
    }
};

DebrisCollection.prototype = {
    maybeAdjustDifficulty: function () {
        this.difficulty = Math.min(this.difficulty + this.difficultyVel, 1);
        this.minTicksPassedBeforeNewDebris = Math.max(this.minTicksPassedBeforeNewDebris - this.difficultyVel, 0)
        
    },
    mightAddNewDebris: function (tickNumber) {
        if (tickNumber - this.lastDebrisTick > this.minTicksPassedBeforeNewDebris) {
            if (Math.random() < this.difficulty) {
                this.lastDebrisTick = tickNumber;
                k = Math.floor(Math.random() * this.debrisSelection);
                console.log(k, this.debrisSelection);
                debrisObject = this.availableDebris[k];
                velX = Math.min(this.difficulty, 10);
                velX = Math.random() < 0.5 ? -velX : velX;
                velY = Math.min(this.difficulty * 5 + Math.random() * 8 * this.difficulty, 100);
                debris = new Debris(0, $(window).width(), $(window).height(), debrisObject, velX, velY);
                this.debrisList.push(debris);
            }
        }
        if (tickNumber % 80 == 0) {
            this.maybeAdjustDifficulty();
        }
        if (tickNumber % 50 == 0) { // default 300
            this.debrisSelection = Math.min(this.debrisSelection+1, Object.keys(this.availableDebris).length)
        }
    },
    progressDebris: function () {
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
    renderDebris: function () {
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
