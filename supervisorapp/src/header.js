import React, { Component } from 'react';
import './header.css';
import AppBar from 'material-ui/AppBar';

class Header extends Component {
  render() {
    return (
    <AppBar className="appbar" position="static" color="default">
        <h2> Dasboard </h2>
    </AppBar>
    );
  }
}

export default Header;