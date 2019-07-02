export async function getExercise(exerciseId) {
    const response = await fetch("../../javascript/workouts.json");
    const body = await response.json();
    
    return body[exerciseId - 1];
}