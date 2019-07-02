export class Audio {
    constructor(context) {
        this.context = context;
    }

    playBeep() {
        var oscillator = this.context.createOscillator();
        var gainNode = this.context.createGain();
    
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
    
        gainNode.gain.value = 60;
        oscillator.frequency.value = 340;
        oscillator.type = "square";
    
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + .07);
    }
}