import React, { Component } from 'react';
import './product.css';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class Product extends Component {
  render() {
    return (
      <div className='product-box'>

        <div className='product-box-header'>

          <span className="date">
            <i className="fas fa-exclamation-triangle"></i>
            {this.formatDate(this.props.product.endOfStockInfo.date)}
          </span>

          {this.props.product.endOfStockInfo ?
            this.props.product.endOfStockInfo.from == 'system' ?
            <span className="from"> Notification du système </span>
              :  <span className="from"> {'Notification de ' + this.props.product.endOfStockInfo.from} </span>
            : 'header is loading...'
          }
        </div>

        <div className='product-box-body'>
          <div className='product-name-box' > 
            <div className='product-name'>
              {this.props.product.productName}
            </div>
            <div className='product-id'>
              Produit n°{this.props.product.id}
            </div>
          </div>
          <div className='stock' > Stock: {this.props.product.stock} </div>
          <Button variant="raised" className='supplier-btn'  onClick={this.handleClickOpen}>
            <i className="fas fa-plus-circle"></i>
          </Button>
        </div>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          >
            <DialogContent>
              <DialogContentText>
                Combien de produit ont été ajoutés ?
              </DialogContentText>

              <TextField
                autoFocus
                fullWidth
                label="Stock"
                onChange={this.inputNewStock()}
                type="number"
                margin="normal"
              />

            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.updateStock} color="primary">
                Update the Stock
              </Button>
            </DialogActions>
        </Dialog>

      </div>

       
    );
  }

  state = {
    open: false,
  };

  constructor(props) {
    super(props);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  inputNewStock = () => event => {
    this.setState({
      stockAdded: Number(event.target.value),
    });
  };

  updateStock = () => {
    this.props.updateParent(this.state.stockAdded + this.props.product.stock, this.props.product.id);
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