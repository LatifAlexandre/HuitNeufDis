import React, { Component } from 'react';
import './supplierDashboard.css';
import Card, { CardContent } from 'material-ui/Card';
import fire from './fire';
import Product from './product';
import ReactNotifications from 'react-browser-notifications';

class SupplierDashboard extends Component {
  render() {
    return (
        <div>

            <ReactNotifications
                onRef={ref => (this.n = ref)} // Required
                title={`Fin de stock - ${this.state && this.state.lastProductEndStock && this.state.lastProductEndStock.productName}`} // Required
                body={`Notification de ${this.state && this.state.lastProductEndStock && this.state.lastProductEndStock.endOfStockInfo.from} `}
                icon="icon.png"
                tag="abcdef"
                timeout="10000"
            />
        
            <Card>
                <CardContent>
                    <h3> Produits a réaprovionnser </h3>

                    <div className="content-alert">

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
        </div>
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
            productsEndStock: productsEndStock,
            lastProductEndStock: productsEndStock[0]
        })

        // notification
        console.log('last product is', productsEndStock[0])
        this.showNotifications();
    })
 }

 constructor() {
    super();
    this.showNotifications = this.showNotifications.bind(this);
  }

  showNotifications() {
    // If the Notifications API is supported by the browser
    // then show the notification
    if(this.n.supported()) this.n.show();
  }
}

export default SupplierDashboard;