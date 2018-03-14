import React, { Component } from "react";
import {StyleSheet, Dimensions, View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class ProductCard extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.container} elevation={5}>
                <FontAwesome name='cube' size={90} color="#009688" />
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
            <View style={{height: 100, backgroundColor: 'transparent'}}>
                <Grid style={styles.grid}>
                    <Col style={{height: 50, width: 60}}>
                        <Row style={styles.row}><Text>Path</Text></Row>
                        <Row style={styles.row}><Text style={styles.bold}>{this.props.position && this.props.position.x}</Text></Row>
                    </Col>
                    <Col style={{height: 50, width: 60}}>
                        <Row style={styles.row}><Text style={{color:'black'}}>Section</Text></Row>
                        <Row style={styles.row}><Text style={styles.bold}>{this.props.position && this.props.position.y}</Text></Row>
                    </Col>
                    <Col style={{height: 50}}>
                        <Row style={styles.row}><Text>Compartment</Text></Row>
                        <Row style={styles.row}><Text style={styles.bold}>{this.props.position && this.props.position.compartment}</Text></Row>
                    </Col>
                    <Col style={{height: 50, width: 60}}>
                        <Row style={styles.row}><Text>Shelf</Text></Row>
                        <Row style={styles.row}><Text style={styles.bold}>{this.props.position && this.props.position.shelf}</Text></Row>
                    </Col>
                </Grid>
                {/* <Text>X , Y , Compartment , Shelf </Text> */}
            </View>
        );
    }
}


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        width: viewportWidth - 50,
        height: viewportHeight/2,
        marginBottom: 25,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
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
    },
    grid: {
        alignItems: 'center',
        justifyContent: 'center',
        width: viewportWidth - 80,
        //   height: 50,
        //   marginTop: 100,
        //   position: 'absolute',
        //   bottom: 0,
        },
    row: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    bold : {
        fontSize: 15,
        fontWeight: 'bold',
    }
});
