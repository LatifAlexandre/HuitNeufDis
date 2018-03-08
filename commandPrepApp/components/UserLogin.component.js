/** react **/
import React, {Component} from 'react';
import {Alert, StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions, Icon, Keyboard} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
/** data **/
import productsData from '../data/users.data';
/** model **/
import Product from '../model/Product';
import Position from '../model/Position';

export default class UserLogin extends Component{

    state = {
        logged: false,
        buttonText: 'Login',
        id: ''
    }
    
    render(){
        return(
            <View style = {styles.container}>
            { this.state.logged ?
                    <Text style={styles.welcomeTextStyle}>Welcome {this.state.userName}</Text>
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
                                            Keyboard.dismiss();
                                            // Alert.alert('Your id : ' + this.state.id);
                                            this.setState({logged: true});
                                            this.setState({userName: this.state.id});
                                            this.setState({id: ''});
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
                                this.products = productsData.map(function(prod){
                                    var position = new Position(prod.position.compartment, prod.position.shelf, prod.position.x, prod.position.y);
                                    var product = new Product(prod.id, prod.productName, position);
                                    console.log(product);
                                    console.log(" ---------- ");
                                    return product;
                                });
                                // Keyboard.dismiss();
                                // this.setState({logged: true});
                                // this.setState({userName: this.state.id});
                                // this.setState({id: ''});
                            }
                    }   
                >
                    <FontAwesome name='file' size={30} color="#fff" />
                    <Text style = {{color: 'white', fontSize: 16}}>Generate command preparation order</Text>
                </TouchableOpacity>
            }
            
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