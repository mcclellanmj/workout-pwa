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

        { "name": "Diamond Pushups"
        , "type": "body-reps"
        },

        { "name" : "Rows"
        , "type" : "body-reps"
        },

        { "name": "Diamond Pushups"
        , "type": "body-reps"
        },

        { "name": "Rows"
        , "type": "body-reps"
        },

        { "name": "Diamond Pushups"
        , "type": "body-reps"
        },

        // Set 4
        { "name": "Plank"
        , "type": "timed-exercise"
        , "time": "30"
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
        , "time": "30"
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
        , "time": "30"
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

function getCurrentExercise(pointer) {
    return workout.exercises[pointer];
}

function setFrameContent(child) {
    const newFrame = makeElement("div", {"id": "frame"});
    newFrame.appendChild(child);

    document.getElementById("frame").replaceWith(newFrame);
}

function renderTimerPage() {
    const container = makeElement("div", {"id": "timer-container"});

    container.appendChild(makeElementWithContent("div", {}, "Next Exercise"));
    container.appendChild(makeElementWithContent("div", {}, getCurrentExercise(exercisePointer + 1).name));

    const timerElement = makeElement("mcclellanmj-timer", {"id": "rest-timer", "time": restTime});

    timerElement.addEventListener("tick", e => {
        const remaining = e.detail.remaining;

        if(remaining === 0) {
            exercisePointer += 1;

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
        setFrameContent(makeElementWithContent("div", {}, "DONE!"));
    }
}

function makeElement(type, options) {
    const newElement = document.createElement(type);

    for(const [key, value] of Object.entries(options)) {
        newElement.setAttribute(key, value);
    }

    return newElement;
}

function makeElementWithContent(type, options, content) {
    const newElement = makeElement(type, options);
    newElement.appendChild(document.createTextNode(content));

    return newElement;
}

function renderExerciseHeader(exercise) {
    const container = makeElement("div", {"id": "exercise"});
    container.appendChild(makeElementWithContent("h1", {}, exercise.name));
    container.appendChild(makeElementWithContent("span", {}, exercise.type));

    return container;
}

function renderNextLink() {
    return makeElementWithContent("a", {"href": "javascript:nextExercise()"}, "Next");
}

function renderTimedExercise(exercise) {
    const timer = makeElement("mcclellanmj-timer", {"id": "workout-timer", "time": 10})
    timer.addEventListener("tick", (e) => {
        if(0 === e.detail.remaining) {
            const newTimer = makeElement("mcclellanmj-timer", {"id": "workout-timer", "time": exercise.time});
            newTimer.addEventListener("tick", (e) => {
                if(0 === e.detail.remaining) {
                    newTimer.replaceWith(renderNextLink());
                }
            });

            timer.replaceWith(newTimer);
        }
    });

    return timer;
}

function renderExercise(exercise) {
    const container = makeElement("div", {});
    container.appendChild(renderExerciseHeader(exercise));

    if(exercise.type === "timed-exercise") {
        container.appendChild(renderTimedExercise(exercise));
    } else {
        container.appendChild(renderNextLink());
    }

    return container;
}

async function beginApp() {
    try {
        await navigator.getWakeLock("screen");
    } catch (ex) {
        // If we can't lock the screen ignore the error
        // FIXME: Probably need to be some sort of notification in the UI that they don't have a locked screen
    }

    const exercise = getCurrentExercise(exercisePointer);

    document.getElementById("workout-title").textContent = workout.name;
    setFrameContent(renderExercise(exercise));
}

document.addEventListener("DOMContentLoaded", beginApp);