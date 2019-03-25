class Timer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        var shadow = this.attachShadow({ mode: 'open' })

        this.timerRootElement = document.createElement('span');
        this.timerRootElement.setAttribute('class', 'wrapper');

        var time = this.getAttribute('time')
        this.remainingTime = parseInt(time);
        this.setText(this.remainingTime);

        shadow.appendChild(this.timerRootElement);

        this.ticker = window.setInterval(() => this.tick(), 1000);
    }

    tick() {
        if(this.remainingTime == 0) {
            window.clearInterval(this.ticker);
        } else {
            this.remainingTime -= 1;
            this.setText(this.remainingTime);
        }
    }

    setText(newValue) {
        this.timerRootElement.innerHTML = newValue;
    }
}

window.customElements.define('mcclellanmj-timer', Timer);