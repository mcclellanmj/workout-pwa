import { text, element } from '../../javascript/element-utils.js';
import { getExercise } from '../../javascript/storage.js';

var workout = "UNLOADED";
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
    const nextWrapper = element("div", {"id": "timer-header"});

    nextWrapper.appendChild(element("h5", {}, text("Next Exercise")));
    nextWrapper.appendChild(element("h5", {}, text(getCurrentExercise(exercisePointer + 1).name)));

    const container = element("div", {"id": "timer-container"}, nextWrapper);

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
    const container = element("div", {"id": "exercise-container"},
        element("h1", {}, text(exercise.name))
    );

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
    const workoutId = window.location.hash.substr(1);

    // FIXME: Less global variables
    const dbWorkout = await getExercise(parseInt(workoutId));
    workout = dbWorkout;

    const exercise = getCurrentExercise(exercisePointer);
    updateCounter();
    setFrameContent(renderExercise(exercise));
}

document.addEventListener("DOMContentLoaded", beginApp);