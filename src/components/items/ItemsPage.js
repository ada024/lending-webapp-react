import React, { Component } from "react";

class ItemsPage extends Component {
  state = {
    items: []
  };

  componentDidMount() {
    fetch("/item", {
      //private
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Bad network response.");
      })
      .then(response => this.setState({ items: response.items }))
      .catch(error => this.setState({ message: error.message }));
  }

  render() {
    return <h1>Items pages</h1>;
  }
}

export default ItemsPage;
