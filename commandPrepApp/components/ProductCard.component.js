import React, { Component } from "react";
import {StyleSheet, Dimensions, View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class ProductCard extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.container} elevation={5}>
                <Text style={styles.productName}>{this.props.name}</Text>
                <PositionCard position={this.props.position}></PositionCard>
            </View>
        );
    }
}

class PositionCard extends Component{

    constructor(props){
        super(props);
    }
    render(){
        return (
            <View>
                <Text>X {this.props.position && this.props.position.x}, Y {this.props.position && this.props.position.y}, Compartment {this.props.position && this.props.position.compartment}, Shelf {this.props.position && this.props.position.shelf}</Text>
            </View>
        );
    }
}


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: viewportWidth - 50,
    marginBottom: 25,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
