import React, { Component } from 'react';
import './command.css';
import { LinearProgress } from 'material-ui/Progress';
import Chip from 'material-ui/Chip';

class Command extends Component {
  render() {
    return (
      <div className='command-box'>

        <div className='command-box-header'>
          <div className='command-name'> Command n°{this.props.command.id} </div>
          <div className='date-of-creation'> créé le {this.formatDate(this.props.command.dateOfCreation)} </div>
          {this.props.command.preparator ?
            <Chip  className='chip' 
              label={this.props.command.preparator.firstname + ' ' +  this.props.command.preparator.lastname} />
            : <span> pas encore assigné </span>}
        </div>

        <div className='command-box-body'>
          <div className='product-prepared'> {this.props.command.numberOfProducts - this.props.command.numberOfUnscannedProducts}/{this.props.command.numberOfProducts} produits préparés </div>
          <LinearProgress className='progress-bar'variant="determinate" value={
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

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        second = d.getSeconds();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return <span className='date'><span className='day-month'>{`${day}/${month}`} </span> <span className='hour'> {`${hour}:${minute}:${second}`} </span> </span>;
}
}

export default Command;