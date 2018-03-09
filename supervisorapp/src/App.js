import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Grid from 'material-ui/Grid';

import './App.css';
import SupervisorDashboard from './supervisorDashboard';
import SupplierDashboard from './supplierDashboard';
import Header from './header';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <div  className="dashboard">
            <SupplierDashboard className="dashboard"/>
          </div>
          <div  className="dashboard">
            <SupervisorDashboard className="dashboard"/>
          </div>
        </div>
      </div>
       
    );
  }
}

export default App;

