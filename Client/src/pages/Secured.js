import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, Text, View, Button, ListView, StyleSheet, TouchableHighlight } from 'react-native';
import { logout } from '../../redux/actions/auth';
 
class Secured extends Component {

    constructor(props){
        super(props);
        var ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
        });
        this.state = {
          ds:[
              {AwayTeam: "TeamA", HomeTeam: "TeamB", Selection: "AwayTeam"},
              {AwayTeam: "TeamC", HomeTeam: "TeamD", Selection: "HomeTeam"}
          ],
          dataSource:ds,
        }
      }
    
      componentDidMount(){
        this.setState({
          dataSource:this.state.dataSource.cloneWithRows(this.state.ds),
        })
    
      }

      pressRow(rowData){

        var newDs = [];
        newDs = this.state.ds.slice();
        newDs[0].Selection = newDs[0] == "AwayTeam" ? "HomeTeam" : "AwayTeam";
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newDs)
        })
    
    }
    
      renderRow(rowData){
        return (
          <TouchableHighlight
            onPress={()=> this.pressRow(rowData)}
            underlayColor = '#ddd'>
            <View style ={styles.row}>
              <Text style={{fontSize:18}}>{rowData.AwayTeam} @ {rowData.HomeTeam} </Text>
              <View style={{flex:1}}>
                <Text style={styles.selectionText}>{rowData[rowData.Selection]}</Text>
              </View>
            </View>
          </TouchableHighlight>
    
        )
      }
      render(){
        return (
          <ListView
            dataSource = {this.state.dataSource}
            renderRow = {this.renderRow.bind(this)}>
          </ListView>
        );
      }


    userLogout(e) {
        this.props.onLogout();
        e.preventDefault();
    }
     
    
}

const styles = StyleSheet.create({
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    container: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
    },
    photo: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    row:{
        flex:1,
        flexDirection:'row',
        padding:18,
        borderBottomWidth: 1,
        borderColor: '#d7d7d7',
      },
      selectionText:{
        fontSize:15,
        paddingTop:3,
        color:'#b5b5b5',
        textAlign:'right'
      }
});
 
const mapStateToProps = (state, ownProps) => {
    return {
        username: state.auth.username
    };
}
 
const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => { dispatch(logout()); }
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(Secured);