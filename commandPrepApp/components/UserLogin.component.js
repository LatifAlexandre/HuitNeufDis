/** react **/
import React, {Component} from 'react';
import {Alert, StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions, Icon, Keyboard} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast, {DURATION} from 'react-native-easy-toast'
/** data **/
import productsData from '../data/users.data';
/** model **/
import Product from '../model/Product';
import Position from '../model/Position';
import User from '../model/User';
import { NavigationActions } from 'react-navigation';

export default class UserLogin extends Component{

    state = {
        logged: false,
        buttonText: 'Login',
        id: '',
        currentUser: new User(),
        products: null,
    }

    constructor(props){
        super(props);
        this.navigation = this.props.navigation;
    }
    
    render(){
        if (this.props.user){
            this.setState({
                logged: true,
                currentUser: user
            });
        }
        return(
            <View style = {styles.container}>
            { this.state.logged ?
                    <View style = {styles.container}>
                        <FontAwesome name='user' size={90} color="#FFEB3B" />
                        <Text style={styles.welcomeTextStyle}>Welcome {this.state.currentUser.firstname} {this.state.currentUser.lastname}</Text>
                    </View>
                    :
                    <View style={{alignItems: 'center'}}>
                        <TextInput
                            placeholderTextColor = '#FFEB3B'
                            style={{color:'#FFEB3B', fontSize: 16,height: 40, width: (viewportWidth/1.2), borderColor: 'transparent', borderWidth: 1}}
                            textAlign={'center'}
                            onChangeText={(id) => this.setState({id})} 
                            value={this.state.id}
                            placeholder = "Enter your id here"
                        />
                        <TouchableOpacity
                            style = {styles.loginButtonStyle}
                            onPress = {
                                    () => {
                                        if (this.state.id){
                                            fetch('https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getPreparator?id=' + this.state.id)
                                            .then(response => {
                                                if (response._bodyInit !== ""){
                                                return response.json();
                                                } else{
                                                    return null;
                                                }
                                            })
                                            .then((responseJson) => {
                                                if (responseJson !== null){
                                                    var  user = new User(this.state.id, responseJson.firstname, responseJson.lastname, responseJson.maxSupportedWeight);
                                                    this.setState({currentUser : user, logged: true, id: ''});
                                                    Keyboard.dismiss();
                                                } else {
                                                    this.setState({currentUser : new User(), logged: false, id: ''});
                                                }
                                            })
                                            .catch((error) => {
                                                console.error(error);
                                            });
                                        }
                                    }
                            }   
                        >
                            <Text style = {{color: '#212121'}}> {this.state.buttonText} </Text>
                        </TouchableOpacity>
                    </View>
            }
            { this.state.logged && 
                <TouchableOpacity style = {styles.disconnectButtonStyle} onPress = {() => this.setState({logged: false})}>
                <FontAwesome name='sign-out' size={30} color="#212121" />
                </TouchableOpacity>
            }
            { this.state.logged &&
                <TouchableOpacity
                    style = {styles.generateCommandPrepGroupButtonStyle}
                    onPress = {
                            () => {
                                var i = 0;
                                fetch('https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getCommandPrepGroup2?maxWeight=' + this.state.currentUser.maxSupportedWeight + '&firstname=' + this.state.currentUser.firstname + '&lastname=' + this.state.currentUser.lastname)
                                .then(response => {
                                    if (response._bodyInit !== "" && response._bodyInit !== "[]"){
                                        return response.json();
                                    } else{
                                        return null;
                                    }
                                })
                                .then((responseJson) => {
                                    if (responseJson !== null){
                                        var lastProd = null;
                                        var sameProdNumber = 1;
                                        this.state.products = responseJson.map(function(prod){
                                            if ( lastProd != null && lastProd.productId == prod.productId){
                                                sameProdNumber++;
                                                // console.log(prod.productName + " n°" + sameProdNumber)
                                            } else {
                                                sameProdNumber = 1;
                                            }
                                            var position = new Position(prod.position.compartment, prod.position.shelf, prod.position.x, prod.position.y);
                                            var product = new Product(prod.productId, sameProdNumber > 1 ? prod.productName + " n°" + sameProdNumber : prod.productName, position, i, prod.commandId, prod.commandProductId);
                                            i++;
                                            lastProd = prod;
                                            return product;
                                        });

                                        {this.state.products != null &&
                                            this.props.navigation.dispatch(NavigationActions.reset({
                                                index: 0,
                                                key: null,
                                                actions: [NavigationActions.navigate({ routeName: 'ProductListPage', params: {products: this.state.products, currentUser: this.state.currentUser} })]
                                            }));
                                        }
                                        Keyboard.dismiss();
                                    } else {
                                        this.refs.toast.show('No commands for you for the moment!',DURATION.LENGTH_LONG);
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                            }
                    }   
                >
                    <FontAwesome name='file' size={25} color="#212121" />
                    <Text style = {{color: '#212121', fontSize: 18, flex: 1, paddingLeft: 10}}>Generate command preparation order</Text>
                </TouchableOpacity>
            }
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
        width: viewportWidth,
        height: viewportHeight,
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: viewportWidth/1.2,
        height: viewportHeight/10,
        backgroundColor: '#FFEB3B',
        borderRadius: 20,
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
    welcomeTextStyle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    generateCommandPrepGroupButtonStyle: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        marginTop: 10,
        alignItems: 'center',
        padding: 10,
        width: viewportWidth,
        height: viewportHeight/6,
        backgroundColor: '#FFEB3B',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
 })