class apiLimit{
    constructor() {
        this.secondCount = 0;
        this.minuteCount = 0;
        this.secondTimer = Date.now();
        this.minuteTimer = Date.now();

        this.secondRequestLimit = 18;
        this.secondTimeLimit = 1000;

        this.minuteRequestLimit = 95;
        this.minuteTimeLimit = 60000;
    }

    addRequest(){ 
        if (this.secondAvailability() && this.minuteAvailability()) {
            return true
        } else {
            return false
        }
    }

    secondAvailability() {
        if (Date.now() - this.secondTimer > this.secondTimeLimit) {
            this.secondCount = 0;
        }
        if (this.secondCount == 0) {
            this.secondTimer = Date.now();
            this.secondCount += 1;
            return true;
        } else if (this.secondCount < this.secondRequestLimit) {
            this.secondCount += 1;
            return true;
        } else {
            return false;
        }
    }

    minuteAvailability() {
        if (Date.now() - this.minuteTimer > this.minuteTimeLimit) {   
            this.minuteCount = 0;
        }
        if (this.minuteCount == 0) {
            this.minuteTimer = Date.now();
            this.minuteCount += 1;
            return true;
        } else if (this.minuteCount < this.minuteRequestLimit) {
            this.minuteCount += 1;
            return true;
        } else {
            return false;
        }
    }
}


let limit = new apiLimit();

module.exports = { apiLimit: limit};