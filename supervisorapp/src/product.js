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
            <span className="from"> Notification du système </span>
              :  <span className="from"> {'Notification de ' + this.props.product.endOfStockInfo.from} </span>
            : 'header is loading...'
          }
        </div>

        <div className='body'>
          <div className='product-name-box' > 
            <div className='product-name'>
              {this.props.product.productName}
            </div>
            <div className='product-id'>
              Produit n°{this.props.product.id}
            </div>
          </div>
          <div className='stock' > Stock: {this.props.product.stock} </div>
        </div>
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

      return <span className='date'><span className='day-month'>{`${day}/${month}`} </span> <span className='hour'> {`${hour}:${minute}:${second}`} </span> </span>;
  }
}

export default Product;