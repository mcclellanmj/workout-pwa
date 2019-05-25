import React from 'react';
import './Workout.css';
import { Timer } from '../components/Timer';

class Exercise extends React.Component {
  finish() {
    if(this.props.onFinish) {
      this.props.onFinish();
    }
  }

  render() {
    const exercise = this.props.exercise;
    console.log(exercise);

    return <div id="exercise-wrapper">
      <h1 id="header">{ exercise.name }</h1>
      <div id="body"></div>
      <div id="footer"><button class="full-button" onClick={ () => this.finish() }>Done</button></div>
    </div>
  }
}

export class Workout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      currentExercise: 1,
      restingTime: 0
    };

    this.state = this.processStepsToUserAction();

    const workout = this.getCurrentStep();
    if(workout === null) {
      this.state.currentActivity = "FINISHED";
    } else {
      this.state.currentActivity = "STARTING";
    }

    console.log("Initial state", this.state);
  }

  getCurrentStep() {
    if(this.state.currentStep < this.props.workout.steps.length) {
      return this.props.workout.steps[this.state.currentStep];
    } else {
      return null;
    }
  }

  getNextStep() {
    return this.props.workout.steps[this.state.currentStep + 1];
  }

  isExercise(currentStep) {
    return currentStep.type !== 'set-resting-time';
  }

  processStepsToUserAction() {
    let newState = this.state;
    do {
      newState = this.processNextStep();
    } while(!this.isExercise(this.getCurrentStep))

    return newState;
  }

  processNextStep() {
    const step = this.getCurrentStep();

    if(step.type === 'set-resting-time') {
      return {...this.state,
        restingTime: step.time,
        currentStep: this.state.currentStep + 1
      };
    }
  }

  finishedWorkout() {
    const newState = this.processStepsToUserAction();
    this.setState(newState);

    const nextStep = this.getCurrentStep();

    if(nextStep === null) {
      this.setState({ ...this.state,
        currentActivity: "FINISHED"
      });
    } else if(this.state.restingTime > 0) {
      this.setState({...this.state,
        currentActivity: "RESTING"
      });
    } else {
      // TODO: Needs to just jump straight to the next exercise
      this.setState({ ...this.state,
        currentActivity: "EXERCISING"
      })
    }
  }

  start() {
    this.setState({ ...this.state,
      currentActivity: "EXERCISING"
    });
  }

  finishedResting() {
    this.setState({ ...this.state,
      currentStep: this.state.currentStep + 1,
      currentActivity: "EXERCISING"
    })
  }

  render() {
    if(this.state.currentActivity === "EXERCISING") {
      return <Exercise exercise={ this.getCurrentStep() } onFinish={ () => this.finishedWorkout() }></Exercise>
    } else if(this.state.currentActivity === "RESTING") {
      return <div><Timer></Timer></div>;
    } else if(this.state.currentActivity === "STARTING") {
      return <div onClick={ () => this.start() }>Starting</div>;
    } else {
      return <div>In bad state, current activity is: { this.state.currentActivity }</div>;
    }
  }
}