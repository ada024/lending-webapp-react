import React, { Component } from "react";

class Callback extends Component {
  componentDidMount = () => {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentiaction();
    } else {
      throw new Error("Wrong callback address .");
    }
  };

  render() {
    //TODO add a spiner
    return <h1>Loading...</h1>;
  }
}

export default Callback;
