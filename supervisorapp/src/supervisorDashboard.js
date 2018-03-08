import React, { Component } from 'react';
import './supervisorDashboard.css';
import Card, { CardActions, CardContent } from 'material-ui/Card';

class SupervisorDashboard extends Component {
  render() {
    return (
        <Card>
            <CardContent>
                <h3> supervisor dashboard </h3>

                <div className="content">
                    content
                </div>
            </CardContent>
        </Card>
    );
  }
}

export default SupervisorDashboard;