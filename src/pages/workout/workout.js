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
};

var exercisePointer = 0;
const restTime = 90;

function getCurrentExercise(pointer) {
    return workout.exercises[pointer];
}

function nextExercise() {
    document.getElementById("frame").innerHTML = `<mcclellanmj-timer id='rest-timer' time='${restTime}' />`;
    document.getElementById("rest-timer").addEventListener("tick", e => {
        const remaining = e.detail.remaining;

        if(remaining === 0) {
            exercisePointer += 1;
            document.getElementById("frame").innerHTML = renderExercise(getCurrentExercise(exercisePointer));
        }
    });
}

function renderExercise(exercise) {
    return `
        <div id="exercise">
            <h1>${exercise.name}</h1>
            <body>${exercise.type}</body>
        </div>
        
        <div id="control">
            <a href="javascript:nextExercise()">Next</a>
        </div>
    `;
}

function startWorkout() {
    const currentExercise = getCurrentExercise(exercisePointer);

    document.getElementById("frame").innerHTML = renderExercise(currentExercise);
}

document.addEventListener("DOMContentLoaded", startWorkout);