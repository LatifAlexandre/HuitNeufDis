import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Text} from 'react-native';

import usersData from '../data/users.data';

export default class UsersList extends Component{
    render(){
        return(
            <View style={styles.container}>
                <FlatList 
                    data={usersData}
                    renderItem =  {({item, index}) => {
                        // console.log(`item : ${JSON.stringify(item)}, index : ${index}`);
                        return(
                            <UsersListItem item={item} index={index}>
                            </UsersListItem>
                        );
                    }}
                    >
                </FlatList>
            </View>
        );
    }
}
class UsersListItem extends Component{
    render(){
        return(
            <View style={{
                    flex: 1,
                    backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen' : 'tomato',
                    padding:10,
                    }}>
                <Text>{this.props.item.name}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
    },
  });
  