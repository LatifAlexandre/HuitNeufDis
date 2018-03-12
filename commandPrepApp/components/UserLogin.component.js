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
        return(
            <View style = {styles.container}>
            { this.state.logged ?
                    <Text style={styles.welcomeTextStyle}>Welcome {this.state.currentUser.firstname} {this.state.currentUser.lastname}</Text>
                    :
                    <View style={{alignItems: 'center'}}>
                        <TextInput 
                            style={{height: 40, width: (viewportWidth - 100), borderColor: 'transparent', borderWidth: 1}}
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
                                                // console.log(response);
                                                return response.json();
                                                } else{
                                                    return null;
                                                }
                                            })
                                            .then((responseJson) => {
                                                if (responseJson !== null){
                                                    // console.log("------------------------");
                                                    var  user = new User(this.state.id, responseJson.firstname, responseJson.lastname, responseJson.maxSupportedWeight);
                                                    this.setState({currentUser : user, logged: true, id: ''});
                                                    // console.log(user);
                                                    Keyboard.dismiss();
                                                } else {
                                                    this.setState({currentUser : new User(), logged: false, id: ''});
                                                }
                                            })
                                            .catch((error) => {
                                                console.error(error);
                                            });
                                            // Alert.alert('Your id : ' + this.state.id);
                                        }
                                    }
                            }   
                        >
                            <Text style = {{color: 'white'}}> {this.state.buttonText} </Text>
                        </TouchableOpacity>
                    </View>
            }
            { this.state.logged && 
                <TouchableOpacity style = {styles.disconnectButtonStyle} onPress = {() => this.setState({logged: false})}>
                <FontAwesome name='sign-out' size={30} color="#fff" />
                </TouchableOpacity>
            }
            { this.state.logged &&
                <TouchableOpacity
                    style = {styles.generateCommandPrepGroupButtonStyle}
                    onPress = {
                            () => {
                                var i = 0;
                                fetch('https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getCommandPrepGroup?maxWeight=' + this.state.currentUser.maxSupportedWeight + '&firstname=' + this.state.currentUser.firstname + '&lastname=' + this.state.currentUser.lastname)
                                .then(response => {
                                    if (response._bodyInit !== "" && response._bodyInit !== "[]"){
                                        return response.json();
                                    } else{
                                        return null;
                                    }
                                })
                                .then((responseJson) => {
                                    if (responseJson !== null){
                                        // console.log("------------------------");
                                        // console.log(responseJson);
                                        this.state.products = responseJson.map(function(prod){
                                            // console.log(prod);
                                            var position = new Position(prod.position.compartment, prod.position.shelf, prod.position.x, prod.position.y);
                                            var product = new Product(prod.productId, prod.productName, position, i, prod.commandId);
                                            // console.log(" ---------- ");
                                            i++;
                                            return product;
                                        });
                                        {this.state.products != null &&
                                            this.props.navigation.dispatch(NavigationActions.reset({
                                                index: 0,
                                                key: null,
                                                actions: [NavigationActions.navigate({ routeName: 'ProductListPage', params: {products: this.state.products, currentUser: this.state.currentUser} })]
                                            }));
                                        }
                                        // var  user = new User(this.state.id, responseJson.firstname, responseJson.lastname, responseJson.maxSupportedWeight);
                                        // this.setState({currentUser : user, logged: true, id: ''});
                                        // console.log(user);
                                        Keyboard.dismiss();
                                    } else {
                                        this.refs.toast.show('No commands for you for the moment!',DURATION.LENGTH_LONG);
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                });

                                // Keyboard.dismiss();
                                // this.setState({logged: true});
                                // this.setState({userName: this.state.id});
                                // this.setState({id: ''});
                            }
                    }   
                >
                    <FontAwesome name='file' size={25} color="#fff" />
                    <Text style = {{color: 'white', fontSize: 16, flex: 1, paddingLeft: 10}}>Generate command preparation order</Text>
                </TouchableOpacity>
            }
            <Toast
                    ref="toast"
                    style={{backgroundColor:'#eee'}}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={100}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'red'}}
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
        alignItems: 'center',
        padding: 10,
        width: 200,
        borderColor: '#2980b9',
        backgroundColor: '#49ce2b',
    },
    disconnectButtonStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        alignItems: 'center',
        padding: 10,
        borderColor: 'red',
        backgroundColor: 'red',
    },
    welcomeTextStyle: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    generateCommandPrepGroupButtonStyle: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        marginTop: 10,
        alignItems: 'center',
        padding: 10,
        width: viewportWidth,
        borderColor: '#2980b9',
        backgroundColor: '#4e89e8',
    }
 })