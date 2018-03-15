import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, Text, View, Button, ListView, StyleSheet, TouchableHighlight, WebView, TouchableOpacity } from 'react-native';
import { logout } from '../../redux/actions/auth';
 
class Secured extends Component {

    constructor(props){
        super(props);
        var ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
        });
        this.state = {
          isLoading: true,
          authorized: false,
          ds:[],
          dataSource:ds,
          redirectUri: ""
        }
        
      }
    
      componentDidMount(){
        fetch("http://localhost:8080/twitch/token")
        .then(response => response.json())
        .then(responseData => {
            console.log(responseData);
            this.setState({redirectUri: responseData});
            this.setState({isLoading: false});
        }).catch((error) => {
            console.error("Error in Mount!!");
        });
      }

      render () {
        if (this.state.isLoading) {
          return (
            <View><Text>Loading ...</Text></View>
          );
        } else if (!this.state.authorized) {
            return (
                <WebView 
                        source={{uri: this.state.redirectUri}}
                        javaScriptEnabled = {true}
                        domStorageEnabled = {true}
                        onNavigationStateChange={(event) => this._onNavigationStateChange(event)}/>
            );
        } else if (!this.state.playContent) {
            return (
                <View> 
                    {
                    this.state.ds.map((item, index) => (
                        <TouchableOpacity
                            key = {index}
                            style = {styles.container}
                            onPress = {() => this.showContent(item)}>
                            
                            <Text style = {styles.text}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))
                    }
                </View>
            )
        } else {
            return (
                <WebView 
                source={{uri: this.state.playUrl}}
                javaScriptEnabled = {true}
                domStorageEnabled = {true}/>
            )
        }
      }

      _onNavigationStateChange(navState) {
        if (navState.canGoBack) {
          fetch(this.state.redirectUri)
          .then(response => response.json())
          .then(responseData => {
            this.setState({ds: responseData});
            this.setState({authorized: true});
          }).catch((error) => {
            console.error("Error in Navi!!");
          });
        }
    }

    showContent(url) {
        this.setState({playContent: true});
        this.setState({playUrl: url});
    }

      pressRow(rowData){
        var newDs = [];
        newDs = this.state.ds.slice();
        // newDs[0].Selection = newDs[0] == "AwayTeam" ? "HomeTeam" : "AwayTeam";
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
              <Text style={{fontSize:18}}>abb </Text>
              <View style={{flex:1}}>
                <Text style={styles.selectionText}>abbaab</Text>
              </View>
            </View>
          </TouchableHighlight>
    
        )
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
        onLogout: (url) => { dispatch(logout()); }
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(Secured);