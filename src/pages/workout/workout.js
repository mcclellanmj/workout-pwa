import { text, element } from '../../javascript/element-utils.js';

var workout = {
    "name": "Strength Calisthenics",
    "exercises": [
        { "name": "Pull Ups"
        , "type": "body-reps"
        },

        { "name": "Squats"
        , "type": "weighted-reps"
        },

        { "name" : "Pull Ups"
        , "type" : "body-reps"
        },

        { "name": "Squats"
        , "type": "weighted-reps"
        },

        { "name": "Pull Ups"
        , "type": "body-reps"
        },

        { "name": "Squats"
        , "type": "weighted-reps"
        },

        // Set 2
        { "name": "Dips"
        , "type": "body-reps"
        },

        { "name": "Romanian Deadlifts"
        , "type": "weighted-reps"
        },

        { "name" : "Dips"
        , "type" : "body-reps"
        },

        { "name": "Romanian Deadlifts"
        , "type": "weighted-reps"
        },

        { "name": "Dips"
        , "type": "body-reps"
        },

        { "name": "Romanian Deadlifts"
        , "type": "weighted-reps"
        },

        // Set 3
        { "name": "Rows"
        , "type": "body-reps"
        },

        { "name": "Planche Pushup"
        , "type": "body-reps"
        },

        { "name" : "Rows"
        , "type" : "body-reps"
        },

        { "name": "Planche Pushup"
        , "type": "body-reps"
        },

        { "name": "Rows"
        , "type": "body-reps"
        },

        { "name": "Planche Pushup"
        , "type": "body-reps"
        },

        // Set 4
        { "name": "Plank"
        , "type": "timed-exercise"
        , "time": "60"
        },

        { "name": "Copenhagen Plank"
        , "type": "timed-exercise"
        , "time": "30"
        },

        { "name": "Reverse Hyperextension"
        , "type": "body-reps"
        },

        { "name": "Plank"
        , "type": "timed-exercise"
        , "time": "60"
        },

        { "name": "Copenhagen Plank"
        , "type": "timed-exercise"
        , "time": "30"
        },

        { "name": "Reverse Hyperextension"
        , "type": "body-reps"
        },

        { "name": "Plank"
        , "type": "timed-exercise"
        , "time": "60"
        },

        { "name": "Copenhagen Plank"
        , "type": "timed-exercise"
        , "time": "30"
        },

        { "name": "Reverse Hyperextension"
        , "type": "body-reps"
        }
    ]
};

var exercisePointer = 0;
const restTime = 90;

function incrementExercise() {
    exercisePointer++;
    updateCounter();
}

function updateCounter() {
    document.getElementById("counter").textContent = `${exercisePointer + 1} / ${workout.exercises.length}`
}

function getCurrentExercise(pointer) {
    return workout.exercises[pointer];
}

function setFrameContent(child) {
    const newFrame = element("div", {"id": "frame"}, child);

    document.getElementById("frame").replaceWith(newFrame);
}

function renderTimerPage() {
    const container = element("div", {"id": "timer-container"});

    const nextWrapper = element("div", {"id": "timer-header"});

    nextWrapper.appendChild(element("h5", {}, text("Next Exercise")));
    nextWrapper.appendChild(element("h5", {}, text(getCurrentExercise(exercisePointer + 1).name)));
    container.appendChild(nextWrapper);

    const timerElement = element("mcclellanmj-timer", {"id": "rest-timer", "time": restTime});

    timerElement.addEventListener("tick", e => {
        const remaining = e.detail.remaining;

        if(remaining === 0) {
            incrementExercise();

            setFrameContent(renderExercise(getCurrentExercise(exercisePointer)));
        }
    });

    container.appendChild(timerElement);
    return container;
}

function nextExercise() {
    if(exercisePointer < workout.exercises.length - 1) {
        setFrameContent(renderTimerPage());
    } else {
        setFrameContent(element("div", {}, text("DONE!")));
    }
}

function renderNextLink() {
    const nextLink = element("a", {"href": "javascript:void(0)", "class": "btn-primary", "id": "next-exercise-button"}, text("Next"));
    nextLink.onclick = nextExercise.bind(this);

    return nextLink;
}

function renderTimedExercise(exercise) {
    const timer = element("mcclellanmj-timer", {"id": "workout-timer", "time": 10})
    timer.addEventListener("tick", (e) => {
        if(0 === e.detail.remaining) {
            const newTimer = element("mcclellanmj-timer", {"id": "workout-timer", "time": exercise.time});
            newTimer.addEventListener("tick", (e) => {
                if(0 === e.detail.remaining) {
                    newTimer.replaceWith(element("div", {"id": "timer-placeholder"}));
                    document.getElementById("link-placeholder").replaceWith(renderNextLink());
                }
            });

            timer.replaceWith(newTimer);
        }
    });

    return timer;
}

function renderExercise(exercise) {
    const container = element("div", {"id": "exercise-container"});

    container.appendChild(element("h1", {}, text(exercise.name)));

    if(exercise.type === "timed-exercise") {
        container.appendChild(renderTimedExercise(exercise));
        container.appendChild(element("div", {"id": "link-placeholder"}));
    } else {
        container.appendChild(element("div", {"id": "timer-placeholder"}));
        container.appendChild(renderNextLink());
    }

    return container;
}

async function beginApp() {
    try {
        const wakelock = await navigator.getWakeLock("screen");
        wakelock.createRequest();
    } catch (ex) {
        // If we can't lock the screen ignore the error
        // FIXME: Probably need to be some sort of notification in the UI that they don't have a locked screen
    }

    const exercise = getCurrentExercise(exercisePointer);
    updateCounter();
    setFrameContent(renderExercise(exercise));
}

document.addEventListener("DOMContentLoaded", beginApp);