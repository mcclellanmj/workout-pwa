export async function getExercise(exerciseId) {
    return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open("workout-pwa");

        dbRequest.onerror = () => reject(new Error("Failed to open database workout-pwa"));
        dbRequest.onsuccess = (event) => {
            const db = event.target.result;

            const transaction = db.transaction('workouts', 'readwrite');
            transaction.onerror = () => reject(new Error("Could not start transaction for workouts"));

            const getRequest = transaction.objectStore('workouts').get(exerciseId);
            getRequest.onerror = () => reject(new Error(`Failed while finding exercise with id ${exerciseId}`));

            getRequest.onsuccess = (event) => { 
                if(event.target.result == undefined) {
                    reject(new Error(`Not able to find workout with id ${exerciseId}`));
                } else {
                    resolve(event.target.result)
                }
            };
        };
    });
}