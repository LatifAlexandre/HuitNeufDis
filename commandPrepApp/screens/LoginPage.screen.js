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
      <Image
        style={styles.backgroundImage}
        source={{ uri: 'https://i.ytimg.com/vi/v1SabYdIlZI/maxresdefault.jpg' }}
      />
        <UserLogin navigation={this.props.navigation}></UserLogin>
      </View>
    );
  }

  // resetNavigation(targetRoute) {
  //   const resetAction = NavigationActions.reset({
  //     index: 0,
  //     actions: [
  //       NavigationActions.navigate({ routeName: targetRoute }),
  //     ],
  //   });
  //   this.props.navigation.dispatch(resetAction);
  // }
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
