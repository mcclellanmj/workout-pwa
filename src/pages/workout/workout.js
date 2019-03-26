var workout = {
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

function nextExercise() {
    if(exercisePointer < workout.exercises.length - 1) {
        document.getElementById("frame").innerHTML = `<mcclellanmj-timer id='rest-timer' time='${restTime}' />`;
        document.getElementById("rest-timer").addEventListener("tick", e => {
            const remaining = e.detail.remaining;

            if(remaining === 0) {
                exercisePointer += 1;

                const newFrame = makeElement("div", {"id": "frame"});
                newFrame.appendChild(renderExercise(getCurrentExercise(exercisePointer)));

                document.getElementById("frame").replaceWith(newFrame);
            }
        });
    } else {
        document.getElementById("frame").innerHTML = "DONE!";
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

function emptyElement(element) {
    while( element.firstChild ) {
        element.removeChild(element.firstChild);
    }
}

function startWorkout() {
    const currentExercise = getCurrentExercise(exercisePointer);

    const frame = document.getElementById("frame");
    emptyElement(frame);
    frame.appendChild(renderExercise(currentExercise));
}

document.addEventListener("DOMContentLoaded", startWorkout);