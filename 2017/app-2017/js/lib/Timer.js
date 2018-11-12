var Timer = function (tickLength, action) {
    this.currentTicks = 0;
    this.paused = false;
    this.tickLength = tickLength; // in ms
    this.action = action;
    this.loop;
};

Timer.prototype = {
    updateTickLength: function (newTickLength) {
        this.tickLength = newTickLength
        console.log(this.tickLength)
        this.pause();
        this.run();
    },
    getNumTicks: function () {
        return Math.max(this.currentTicks - 1, 0);
    },
    toggleTimer: function () {
        this.paused = !this.paused;
        return this.paused
    },
    run: function () {
        var _this = this;
        this.loop = setInterval(function () {
            if (!_this.paused) {
                _this.currentTicks++;
                _this.action(_this.currentTicks);
            }
        }, this.tickLength);
    },
    pause: function () {
        clearInterval(this.loop);
    },
    stop: function () {
        this.paused = true;
        clearInterval(this.loop);
        this.currentTicks = 0;
    }
}