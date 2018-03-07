import React , {Component} from 'react';
import { StyleSheet, Image, View, Text, FlatList, Dimensions } from 'react-native';
import UserLogin from './components/UserLogin.component';

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={{ uri: 'https://i.ytimg.com/vi/v1SabYdIlZI/maxresdefault.jpg' }}
      />
        <UserLogin></UserLogin>
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
