import React from 'react';
import './App.css';
import { getExercise } from './storage';
import { Workout } from './pages/Workout';
import { WorkoutList } from './pages/WorkoutList';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "LOADING",
      workouts: []
    }
  }

  async componentDidMount() {
    const workouts = await getExercise();

    this.setState({
      status: "SELECTING_WORKOUT",
      workouts: workouts
    })
  }

  workoutSelected(workout) {
    this.setState({
      ...this.state,
      status: "WORKING_OUT",
      workout: workout
    });
    console.log("Workout selected", workout);
  }

  render() {
    if (this.state.status === "LOADING") {
      return <span>Loading Workouts from indexeddb</span>
    } else if (this.state.status === "SELECTING_WORKOUT") {
      return <WorkoutList workouts={this.state.workouts} selectWorkout={(workout) => this.workoutSelected(workout)}></WorkoutList>;
    } else if (this.state.status === "WORKING_OUT") {
      return <Workout workout={this.state.workout}></Workout>
    }
  }
}

export default App;
