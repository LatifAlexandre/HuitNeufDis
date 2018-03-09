import React, { Component } from 'react';
import './product.css';

class Product extends Component {
  render() {
    return (
      <div className='product-box'>

        <div className='header'>

          {this.props.product.endOfStockInfo ?
              <span className="date"> {this.formatDate(this.props.product.endOfStockInfo.date)} </span>
              : 'date is loading...'
          }


          {this.props.product.endOfStockInfo ?
            this.props.product.endOfStockInfo.from == 'system' ?
            <span className="from"> Alert from the System </span>
              :  <span className="from"> {'Alert from ' + this.props.product.endOfStockInfo.from} </span>
            : 'header is loading...'
          }
        </div>

        <h4> {this.props.product.productName} </h4>
        <h5> Produit n°{this.props.product.id}</h5>

        <strong> Stock: {this.props.product.stock} </strong>
      </div>
    );
  }

  constructor(props) {
    super(props);
    console.log(this.props.product);
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

      return `${day}/${month} ${hour}:${minute}:${second}`;
  }
}

export default Product;