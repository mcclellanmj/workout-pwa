import React from 'react';
import './App.css';
import { getExercise } from './storage';

class Timer extends React.Component {
  render() {
    return <span>Timing</span>;
  }
}

class WorkoutList extends React.Component {
  renderLink(workout) {
    console.log(workout);
    return <li key={ workout.id }><a href="javascript:void(0);" onClick={() => this.props.selectWorkout(workout)}>{ workout.name }</a></li>
  }

  render() {
    return <ul>
      { this.props.workouts.map(x => this.renderLink(x)) }
    </ul>
  }
}

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
    if(this.state.status === "LOADING") {
      return <span>Loading Workouts from indexeddb</span>
    } else if (this.state.status === "SELECTING_WORKOUT") {
      return <WorkoutList workouts={ this.state.workouts } selectWorkout={ (workout) => this.workoutSelected(workout) }></WorkoutList>;
    } else if (this.state.status === "WORKING_OUT") {
      return <div>Start workout</div>
    }
  }
}

export default App;
