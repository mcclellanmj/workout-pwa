import React from 'react';

export class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: new Date()
    }
  }

  render() {
    return <span>Hello timer</span>;
  }
}
