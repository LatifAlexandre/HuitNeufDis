import React , {Component} from 'react';
import { StyleSheet, View, Image, Button, Dimensions } from 'react-native';
import UserLogin from '../components/UserLogin.component';
import { NavigationActions } from 'react-navigation';

export default class LoginPage extends Component {
  static navigationOptions = {
    title: 'Login Screen',
  }
  render() {
    var {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        {(this.navigation && this.navigation.state && this.navigation.state.params && this.navigation.state.params.user) ?
            // this.state.currentUser = this.navigation.state.params.user;
            // this.state.logged = true;
            <UserLogin navigation={this.props.navigation} user={this.navigation.state.params.user}></UserLogin>
            :
            <UserLogin navigation={this.props.navigation}></UserLogin>
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
