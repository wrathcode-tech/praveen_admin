import React from 'react';
import './Loading.css';

class Loading extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaderState: false,
    };
  }

  updateStatus = status => {
    this.setState({ loaderState: status });
  };

  render() {
    const { loaderState } = this.state;
    return (
      loaderState &&
      <div className="centerbox">
        <img src="/assets/img/favicon_white.svg" alt="" style={{ width: '100px', height: '75px' }} />
      </div>
    )
  }
}

export default Loading;