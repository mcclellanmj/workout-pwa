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
        { "name": "Hanging Knee Raise"
        , "type": "body-reps"
        },

        { "name": "Copenhagen Plank"
        , "type": "timed-exercise"
        , "time": "30"
        },

        { "name": "Reverse Hyperextension"
        , "type": "body-reps"
        },

        { "name": "Hanging Knee Raise"
        , "type": "body-reps"
        },

        { "name": "Copenhagen Plank"
        , "type": "timed-exercise"
        , "time": "30"
        },

        { "name": "Reverse Hyperextension"
        , "type": "body-reps"
        },

        { "name": "Hanging Knee Raise"
        , "type": "body-reps"
        },

        { "name": "Copenhagen Plank"
        , "type": "timed-exercise"
        , "time": "3"
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
    const newFrame = makeElement("div", {"id": "frame"});
    newFrame.appendChild(child);

    document.getElementById("frame").replaceWith(newFrame);
}

function renderTimerPage() {
    const container = makeElement("div", {"id": "timer-container"});

    const nextWrapper = makeElement("div", {"id": "timer-header"});

    nextWrapper.appendChild(makeElementWithContent("h5", {}, "Next Exercise"));
    nextWrapper.appendChild(makeElementWithContent("h5", {}, getCurrentExercise(exercisePointer + 1).name));
    container.appendChild(nextWrapper);

    const timerElement = makeElement("mcclellanmj-timer", {"id": "rest-timer", "time": restTime});

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

function renderNextLink() {
    return makeElementWithContent("a", {"href": "javascript:nextExercise()", "class": "btn-primary", "id": "next-exercise-button"}, "Next");
}

function renderTimedExercise(exercise) {
    const timer = makeElement("mcclellanmj-timer", {"id": "workout-timer", "time": 10})
    timer.addEventListener("tick", (e) => {
        if(0 === e.detail.remaining) {
            const newTimer = makeElement("mcclellanmj-timer", {"id": "workout-timer", "time": exercise.time});
            newTimer.addEventListener("tick", (e) => {
                if(0 === e.detail.remaining) {
                    newTimer.replaceWith(makeElement("div", {"id": "timer-placeholder"}));
                    document.getElementById("link-placeholder").replaceWith(renderNextLink());
                }
            });

            timer.replaceWith(newTimer);
        }
    });

    return timer;
}

function renderExercise(exercise) {
    const container = makeElement("div", {"id": "exercise-container"});

    container.appendChild(makeElementWithContent("h1", {}, exercise.name));

    if(exercise.type === "timed-exercise") {
        container.appendChild(renderTimedExercise(exercise));
        container.appendChild(makeElement("div", {"id": "link-placeholder"}));
    } else {
        container.appendChild(makeElement("div", {"id": "timer-placeholder"}));
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