import React from 'react';

export class WorkoutList extends React.Component {
  renderLink(workout) {
    return <button class="full-button" onClick={() => this.props.selectWorkout(workout)}>{workout.name}</button>
  }

  render() {
    return <div id="workout-container">
      {this.props.workouts.map(x => this.renderLink(x))}
    </div>
  }
}