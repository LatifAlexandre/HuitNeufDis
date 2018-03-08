import React, { Component } from 'react';
import './supplierDashboard.css';
import Card, { CardActions, CardContent } from 'material-ui/Card';

class SupplierDashboard extends Component {
  render() {
    return (
        <Card>
            <CardContent>
                <h3> supplier dashboard </h3>

                <div className="content">
                    content
                </div>
            </CardContent>
        </Card>
    );
  }
}

export default SupplierDashboard;