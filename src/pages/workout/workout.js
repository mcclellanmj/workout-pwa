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
        }
    ]
}

var exercisePointer = 0;

function getCurrentExercise(pointer) {
    return workout.exercises[pointer];
}

function startWorkout() {
    console.log("starting up");
    var currentExercise = getCurrentExercise(exercisePointer);

    document.getElementById("current-step").innerHTML = `
        <h1>${currentExercise.name}</h1>
        <body>${currentExercise.type}</body>
    `;
}

document.addEventListener("DOMContentLoaded", startWorkout);