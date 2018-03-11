import React, { Component } from 'react';
import './supplierDashboard.css';
import Card, { CardContent } from 'material-ui/Card';
import fire from './fire';
import Product from './product';

class SupplierDashboard extends Component {
  render() {
    return (
        <Card>
            <CardContent>
                <h3> Produits a réaprovionnser </h3>

                <div className="content">

                    { this.state && this.state.productsEndStock && this.state.productsEndStock ?
                        this.state.productsEndStock.map( product => {
                            return <Product key={product.id} product={product}
                                            updateParent={this.newStock}/>
                        })
                        : 'the products are loading...'
                    }
                </div>
            </CardContent>
        </Card>
    );
  }

  newStock(newStock, productId) {
      console.log(newStock, productId)
      fire.firestore().collection('products').doc(productId).update({
        stock: newStock,
        endOfStock: false,
        endOfStockInfo: null
      })
  }

  componentWillMount() {
    // we take the commands from firebase
    fire.firestore().collection('products').where('endOfStock', '==', true).onSnapshot(querySnapshot => {
        var productsEndStock = [];
        querySnapshot.forEach( doc => {
            var productWithId = {...doc.data(), id: doc.id}
            productsEndStock.push(productWithId);
        })
        // we sort it by date
        productsEndStock = productsEndStock.sort( function(p1, p2){
            if (p1.endOfStockInfo.date > p2.endOfStockInfo.date) {
                return -1;
            }
            if (p1.endOfStockInfo.date < p2.endOfStockInfo.date) {
                return 1;
            }
            return 0;
        })
        
        this.setState({
            productsEndStock: productsEndStock
        })
        console.log(this.state)
       
    })
 }
}

export default SupplierDashboard;