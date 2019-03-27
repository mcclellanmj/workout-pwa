class Timer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        var shadow = this.attachShadow({ mode: 'open' });

        this.timerRootElement = document.createElement('span');
        this.timerRootElement.setAttribute('class', 'wrapper');

        this.startTime = Date.now();

        const time = this.getAttribute('time');
        this.totalTime = parseInt(time);
        this.setText(this.totalTime);

        shadow.appendChild(this.timerRootElement);

        this.ticker = window.setInterval(() => this.tick(), 500);
    }

    tick() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        const remaining = Math.ceil(this.totalTime - elapsed);

        if(remaining < 0) {
            window.clearInterval(this.ticker);
        } else {
            this.setText(remaining);
        }
    }

    static makeTickEvent(value) {
        return new CustomEvent("tick",
            {
                "bubbles": false,
                "detail": { "remaining": value }
            });
    }

    setText(newValue) {
        if(this.lastSet !== newValue) {
            this.dispatchEvent(Timer.makeTickEvent(newValue));
            this.timerRootElement.textContent = newValue;
            this.lastSet = newValue;
        }
    }
}

window.customElements.define('mcclellanmj-timer', Timer);