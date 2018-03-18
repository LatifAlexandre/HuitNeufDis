import React , {Component} from 'react';
// import { StyleSheet, Image, View, Dimensions } from 'react-native';
import {StackNavigator } from 'react-navigation';
// import UserLogin from './components/UserLogin.component';
import LoginPage from './screens/LoginPage.screen';
import ProductListPage from './screens/ProductListPage.screen';

const Navigation = StackNavigator({
  LoginPage: {screen: LoginPage},
  ProductListPage: {screen: ProductListPage}
});
export default Navigation;
/*extends Component {
  render() {
    // fetch('https ://mywebsite.com/endpoint/', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     firstParam: 'yourValue',
    //     secondParam: 'yourOtherValue',
    //   }),
    // });


    // fetch('https://us-central1-huitneufdis-1e9f6.cloudfunctions.net/getCommandPrepGroup?maxWeight=15&firstname=a&lastname=b')
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   console.log("------------------------");
    //   responseJson.map(function(prod){
    //     console.log(prod);
    //     var position = new Position(prod.position.compartment, prod.position.shelf, prod.position.x, prod.position.y);
    //     var product = new Product(prod.id, prod.productName, position);
    //     console.log(prod.id);
    //   });
    //   console.log(responseJson);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });

    // return (
    //   <View style={styles.container}>
    //   <Image
    //     style={styles.backgroundImage}
    //     source={{ uri: 'https://i.ytimg.com/vi/v1SabYdIlZI/maxresdefault.jpg' }}
    //   />
    //     <UserLogin></UserLogin>
    //   </View>
    // );
  }
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    resizeMode: 'cover',
    width: viewportWidth,
    height: viewportHeight,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
*/
