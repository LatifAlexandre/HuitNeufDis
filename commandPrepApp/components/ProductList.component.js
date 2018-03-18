import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Text, TouchableOpacity, Dimensions, Alert, LayoutAnimation} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import { BarCodeScanner, Permissions } from 'expo';
import Toast, {DURATION} from 'react-native-easy-toast'
import { NavigationActions } from 'react-navigation';

import ProductCard from './ProductCard.component';
export default class ProductList extends Component{

    constructor(props){
        super(props);
        this.state = {
            actualProductKey: 0,
            productChanged: true,
            actualProduct: null,
            scannedProductsPercentage: 0,
            hasCameraPermission: null,
            lastScannedUrl: null,
            wantToScan: false,
        }
        this.products = this.props.products;
        this.state.actualProduct= this.products[this.state.actualProductKey];
    }

    componentDidMount() {
        this._requestCameraPermission();
      }
    
      _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
          hasCameraPermission: status === 'granted',
        });
      };

    _handleBarCodeRead = result => {
        // if (result.data !== this.state.lastScannedUrl) {
          this.setState({
              lastScannedUrl: result.data,
              wantToScan: false
            });
            if (result.data == this.state.actualProduct.id){
                fetch('https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/scanProduct?commandId=' + this.state.actualProduct.commandId + '&commandProductId=' + this.state.actualProduct.commandProductId + '&productId=' + this.state.actualProduct.id);
                this.refs.toast.show('Product scanned!',DURATION.LENGTH_LONG);
                this.handle();
            }
            else {
                this.refs.toast.show('That\'s not ' + this.state.actualProduct.name + '!',DURATION.LENGTH_LONG);
            }
        // }
      };

    handle(){
        if (this.state.actualProductKey+1 != this.products.length){
            this.setState({
                actualProductKey: this.state.actualProductKey+1,
                actualProduct: this.products[this.state.actualProductKey+1],
                scannedProductsPercentage: (this.state.actualProductKey+1) / this.products.length,
            });
        } else {
            //TODO return to login page
            this.setState({
                scannedProductsPercentage: (this.state.actualProductKey+1) / this.products.length,
            });
            this.props.navigation.dispatch(NavigationActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: 'LoginPage', params: {user: this.state.user}})]
            }));
        }
    }

    render(){
        return(
            <View style={styles.container}>
            <TouchableOpacity style = {styles.disconnectButtonStyle} onPress = {() => {
                    this.props.navigation.dispatch(NavigationActions.reset({
                        index: 0,
                        key: null,
                        actions: [NavigationActions.navigate({ routeName: 'LoginPage'})]
                    }));
                }
            }>
                <FontAwesome name='sign-out' size={30} color="#212121" />
            </TouchableOpacity>
            <View style={{flexDirection: 'row', marginTop: 20}}>
                <FontAwesome name='user' size={25} color="#212121" />
                <Text style={styles.welcomeTextStyle}>{this.props.user && this.props.user.firstname} {this.props.user && this.props.user.lastname}</Text>
            </View>
            {
                this.state.wantToScan ?
                this.state.hasCameraPermission === null
                ? null
                : this.state.hasCameraPermission === false
                    ? null
                    :<BarCodeScanner
                        onBarCodeRead={this._handleBarCodeRead}
                        style={{
                            height: Dimensions.get('window').height/1.5,
                            width: Dimensions.get('window').width/1.1,
                            
                        }}
                        />
                        :
                        null
                }
                <Text style={{marginTop: 20, fontSize: 15, color: '#FFEB3B'}}>{parseInt(this.state.scannedProductsPercentage * 100, 10)}%</Text>
                <Progress.Bar progress={this.state.scannedProductsPercentage} width={250} color = '#FFEB3B' unfilledColor = 'transparent' borderColor = '#B2DFDB' style={styles.progressBar} />
                <ProductCard name={(this.state && this.state.actualProduct) && this.state.actualProduct.name} position={(this.state && this.state.actualProduct) && this.state.actualProduct.position}></ProductCard>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.reportOutOfStockButtonStyle}
                        onPress = { () => {
                            Alert.alert(
                                'Out of stock',
                                'Report ' + (this.state && this.state.actualProduct) && this.state.actualProduct.name + ' out of stock ?',
                                [
                                //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                  {text: 'Cancel', onPress: () => null, style: 'cancel'},
                                  {text: 'OK', onPress: () => 
                                    {
                                        // console.log('https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/endOfStockAltert?productId=' + this.state.actualProduct.id + '&firstname=' + this.props.user.firstname + '&lastname=' + this.props.user.lastname);
                                        fetch('https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/endOfStockAltert?productId=' + this.state.actualProduct.id + '&firstname=' + this.props.user.firstname + '&lastname=' + this.props.user.lastname);
                                        this.handle();
                                    }
                                },
                                ],
                                { cancelable: false }
                              );
                        }}
                    >
                        <FontAwesome name='exclamation-triangle' size={25} color="#212121" />
                        <Text style = {{color: 'white', fontSize: 16, flex: 1, paddingLeft: 10}}>Report out of stock</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.scanButtonStyle}
                        onPress={ () => this.setState({wantToScan: !this.state.wantToScan})}
                    >
                        <FontAwesome name='barcode' size={25} color="#212121" />
                        <Text style = {{color: 'white', fontSize: 16, flex: 1, paddingLeft: 10}}>Scan</Text>
                    </TouchableOpacity>
                </View>
                <Toast
                    ref="toast"
                    style={{backgroundColor:'#b2fef7'}}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={100}
                    fadeOutDuration={400}
                    opacity={0.9}
                    textStyle={{color:'#212121'}}
                />
            </View>
        );
    }
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      alignItems: 'center',
    //   justifyContent: 'center',
    //   marginTop: 20,
    width: viewportWidth,
    },
    welcomeTextStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 5
    },
    buttonsContainer:{
        marginTop: 40,
        marginBottom: 5,
        flexDirection: 'row',
    },
    scanButtonStyle: {
        alignItems: 'center',
        padding: 10,
        width: viewportWidth/2.1,
        backgroundColor: '#FFEB3B',
        borderRadius: 10,
    },
    reportOutOfStockButtonStyle: {
        marginRight: 5,
        alignItems: 'center',
        padding: 10,
        width: viewportWidth/2.1,
        backgroundColor: '#FF5252',
        borderRadius: 10,
    },
    progressBar: {
        marginBottom: 30
    },
    disconnectButtonStyle: {
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
        borderTopLeftRadius: 70,
        borderTopRightRadius: 0,
        position: 'absolute',
        top: 0,
        right: 0,
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#B2DFDB',
    },
  });
  