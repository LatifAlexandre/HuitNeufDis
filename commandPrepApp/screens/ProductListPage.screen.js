import React , {Component} from 'react';
import { StyleSheet, View, Image, Button, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';

import ProductList from '../components/ProductList.component';

export default class ProductListPage extends Component {
  static navigationOptions = {
    title: 'Product List',
    headerLeft: null,
  }

  constructor(props){
    super(props);
  }

  render() {
    var {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
      {/* <Image
        style={styles.backgroundImage}
        source={{ uri: 'https://i.ytimg.com/vi/v1SabYdIlZI/maxresdefault.jpg' }}
      /> */}
      { (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.products && this.props.navigation.state.params.currentUser) &&
        <ProductList navigation={this.props.navigation} products={this.props.navigation.state.params.products} user={this.props.navigation.state.params.currentUser}></ProductList>
      }
      </View>
    );
  }
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009688',
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
