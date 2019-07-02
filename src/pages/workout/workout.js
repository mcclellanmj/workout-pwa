import {text, element} from '../../javascript/element-utils.js';
import {getExercise} from '../../javascript/storage.js';
import {Audio} from '../../javascript/audio.js';

class Rendering {


    static createNextLink(title, onclick) {
        const nextLink = element("a", {
            "href": "javascript:void(0)",
            "class": "btn-primary",
            "id": "next-exercise-button"
        }, text(title));
        nextLink.onclick = onclick;

        return nextLink;
    }

    static startingWorkoutPage(workout, onclick) {
        const workoutName = element("h1", {}, text(workout.name));

        return element("div", { "id": "starting-container" }, 
            workoutName, 
            Rendering.createNextLink("Start", onclick));
    }
}

export class Workout {
    constructor() {
        this.pointer = 0;
        this.restTime = 90;
    }

    static async create(workoutId) {
        const workout = new Workout();

        if(navigator.wakelock !== undefined) {
            try {
                const wakelock = await navigator.getWakeLock("screen");
                wakelock.createRequest();
            } catch (ex) {
                // If we can't lock the screen ignore the error
                // FIXME: Probably need to be some sort of notification in the UI that they don't have a locked screen
            }
        }

        const dbWorkout = await getExercise(parseInt(workoutId));
        workout.currentWorkout = dbWorkout;

        return workout;
    }

    // FIXME: This needs some sort of timer chain
    renderTimedExercise(exercise) {
        const timer = element("mcclellanmj-timer", {"id": "workout-timer", "time": 10});
        timer.addEventListener("tick", (e) => {

            if (0 === e.detail.remaining) {
                const newTimer = element("mcclellanmj-timer", {"id": "workout-timer", "time": exercise.time});
                newTimer.addEventListener("tick", (e) => {
                    if (0 === e.detail.remaining) {
                        newTimer.replaceWith(element("div", {"id": "timer-placeholder"}));
                        document.getElementById("link-placeholder").replaceWith(Rendering.createNextLink("Next", () => this.nextExercise()));
                    }
                });

                timer.replaceWith(newTimer);
            }
        });

        return timer;
    }

    createTimerPage(nextExercise, restTime, onFinish) {
        const nextWrapper = element("div", {"id": "timer-header"});

        nextWrapper.appendChild(element("h5", {}, text("Next Exercise")));
        nextWrapper.appendChild(element("h5", {}, text(nextExercise)));

        const container = element("div", {"id": "timer-container"}, nextWrapper);
        const timerElement = element("mcclellanmj-timer", {"id": "rest-timer", "time": restTime});

        timerElement.addEventListener("tick", e => {
            const remaining = e.detail.remaining;

            if (remaining <= 5) {
                this.audio.playBeep();
            }

            if (remaining === 0) {
                onFinish();
            }
        });

        container.appendChild(timerElement);
        return container;
    }

    // FIXME: Have this render two completely different views
    renderExercise(exercise) {
        const container = element("div", {"id": "exercise-container"},
            element("h1", {}, text(exercise.name))
        );

        if (exercise.type === "timed-exercise") {
            container.appendChild(this.renderTimedExercise(exercise));
            container.appendChild(element("div", {"id": "link-placeholder"}));
        } else {
            container.appendChild(element("div", {"id": "timer-placeholder"}));
            container.appendChild(Rendering.createNextLink("Next", () => this.nextExercise()));
        }

        return container;
    }

    renderTimerPage() {
        return this.createTimerPage(this.getCurrentExercise(this.pointer + 1).name, this.restTime, () => {
            this.incrementExercise();
            Workout.setFrameContent(this.renderExercise(this.getCurrentExercise(this.pointer)));
        });
    }

    static setFrameContent(child) {
        const newFrame = element("div", {"id": "frame"}, child);

        document.getElementById("frame").replaceWith(newFrame);
    }

    getCurrentExercise(pointer) {
        return this.currentWorkout.exercises[pointer];
    }

    nextExercise() {
        if (this.pointer < this.currentWorkout.exercises.length - 1) {
            Workout.setFrameContent(this.renderTimerPage());
        } else {
            Workout.setFrameContent(element("div", {}, text("DONE!")));
        }
    }

    incrementExercise() {
        this.pointer++;
        this.updateCounter();
    }

    updateCounter() {
        document.getElementById("counter").textContent = `${this.pointer + 1} / ${this.currentWorkout.exercises.length}`
    }

    beginApp() {
        Workout.setFrameContent(Rendering.startingWorkoutPage(this.currentWorkout, () => {
            this.audio = new Audio(new AudioContext());

            const exercise = this.getCurrentExercise(this.pointer);
            this.updateCounter();

            Workout.setFrameContent(this.renderExercise(exercise));
        }));
    }
}
