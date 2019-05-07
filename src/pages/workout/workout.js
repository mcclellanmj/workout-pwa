import { text, element } from '../../javascript/element-utils.js';
import { getExercise } from '../../javascript/storage.js';

class Views {
    static createNextLink(onclick) {
        const nextLink = element("a", {
            "href": "javascript:void(0)",
            "class": "btn-primary",
            "id": "next-exercise-button"
        }, text("Next"));
        nextLink.onclick = onclick;

        return nextLink;
    }

    static repsExercisePage(exercise, target) {
        return new Promise((resolve, _) => {
            const container = element("div", { "id": "exercise-container" },
                element("h1", {}, text(exercise.name))
            );

            container.appendChild(element("div", { "id": "timer-placeholder" }));
            container.appendChild(Views.createNextLink(() => resolve("COMPLETE")));

            target.appendChild(container);
        });
    }

    static timedExercisePage(exercise, target) {
        return new Promise((resolve, reject) => {
            const timer = element("mcclellanmj-timer", { "id": "workout-timer", "time": 10 });

            timer.addEventListener("tick", (e) => {
                if (0 === e.detail.remaining) {
                    resolve(timer);
                }
            });

            target.appendChild(timer);
        }).then(oldTimer => {
            return new Promise((resolve, reject) => {
                const newTimer = element("mcclellanmj-timer", { "id": "workout-timer", "time": exercise.time });
                newTimer.addEventListener("tick", (e) => {
                    if (0 === e.detail.remaining) {
                        resolve(newTimer);
                        // newTimer.replaceWith(element("div", { "id": "timer-placeholder" }));
                        // document.getElementById("link-placeholder").replaceWith(Rendering.createNextLink(() => this.nextExercise()));
                    }
                });

                oldTimer.replaceWith(newTimer);
            });
        }).then(oldTimer => {
            return new Promise((resolve, reject) => {

            });
        })
    };
}

export class Workout {
    constructor() {
        this.restTime = 90;
    }

    static async create(workoutId) {
        const workout = new Workout();

        try {
            const wakelock = await navigator.getWakeLock("screen");
            wakelock.createRequest();
        } catch (ex) {
            // If we can't lock the screen ignore the error
            // FIXME: Probably need to be some sort of notification in the UI that they don't have a locked screen
        }

        const dbWorkout = await getExercise(parseInt(workoutId));
        workout.currentWorkout = dbWorkout;

        return workout;
    }

    // FIXME: This needs some sort of timer chain
    renderTimedExercise(exercise) {

    }

    static makeFrame() {
        const newFrame = element("div", { "id": "frame" });

        document.getElementById("frame").replaceWith(newFrame);

        return newFrame;
    }

    *getExercises() {
        const exercises = this.currentWorkout.exercises;

        for (let i = 0; i < exercises.length; i++) {
            let next = undefined;

            if (i + 1 < exercises.length) {
                next = exercises[i + 1];
            }

            yield [exercises[i], next]
        }
    }

    async beginApp() {
        for (const [exercise, nextExercise] of this.getExercises()) {
            // FIXME: Temporary, needs else to handle other cases
            if (exercise.type === 'body-reps' || exercise.type === 'weighted-reps') {
                // FIXME: Figure out how to give it a blank frame
                console.log("result exercise", await Views.repsExercisePage(exercise, Workout.makeFrame()));

                if (nextExercise !== undefined) {
                    console.log("result timer", await Views.timerPage(nextExercise.name, this.restTime, Workout.makeFrame()));
                }
            }
        }
    }
}
