import { element } from "../javascript/element-utils.js";

class Timer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        this.timerRootElement = element('span', {'class': 'wrapper'});

        this.startTime = Date.now();

        const time = this.getAttribute('time');
        this.totalTime = parseInt(time);
        this.lastSet = this.totalTime;
        this.setText(this.totalTime);
        this.inHighResolutionMode = false;

        shadow.appendChild(this.timerRootElement);

        this.ticker = window.setInterval(() => this.tick(), 450);
    }

    tick() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        const remaining = Math.ceil(this.totalTime - elapsed);
        const externalRemaining = remaining < 0 ? 0 : remaining;

        if(this.lastSet !== externalRemaining) {
            this.dispatchEvent(Timer.makeTickEvent(externalRemaining));
            this.setText(externalRemaining);
            this.lastSet = externalRemaining;
        }

        if(remaining == 0) {
            window.clearInterval(this.ticker);
        }

        if(remaining < 10 && !this.inHighResolutionMode) {
            window.clearInterval(this.ticker);
            this.ticker = window.setInterval(() => this.tick(), 20);
            this.inHighResolutionMode = true;
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
        this.timerRootElement.textContent = newValue;
    }
}

window.customElements.define('mcclellanmj-timer', Timer);