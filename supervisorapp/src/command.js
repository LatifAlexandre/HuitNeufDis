import React, { Component } from 'react';
import './command.css';
import { LinearProgress } from 'material-ui/Progress';

class Command extends Component {
  render() {
    return (
      <div className='command-box'>
        <h4> Command n°{this.props.command.id}</h4>
        <h5> créé le {this.props.command.dateOfCreation.toString()} </h5>

        <div className='body'>
          statut : {this.props.command.state} <br/>
          
          preparateur de commande : {
            this.props.command.preparator ? 
              this.props.command.preparator.firstname + ' ' +  this.props.command.preparator.lastname
              : 'pas encore assigné'
            }
          <br />
          avancement : 
          <LinearProgress variant="determinate" value={
            ((this.props.command.numberOfProducts - this.props.command.numberOfUnscannedProducts)
              / this.props.command.numberOfProducts) * 100
            } />

        </div>
      </div>
    );
  }

  constructor(props) {
    super(props);
  }
}

export default Command;