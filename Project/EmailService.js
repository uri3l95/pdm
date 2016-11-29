
import React, { Component } from 'react';
import Button from 'react-native-button';
import * as Progress from 'react-native-progress';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TextInput,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
class EmailService extends Component {
    constructor(props){
        super(props);
        this.state={
            to:'',
            subject:'',
            body:'',
            visible:false
        }
    }
    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
                navigationBar={
                    <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                                             routeMapper={NavigationBarRouteMapper} />
                } />
        );
    }
    _sendEmail() {
        let to = this.state.to;
        let subject = this.state.subject;
        let body= this.state.body;
        if(to==''){
            ToastAndroid.show('Field required !', ToastAndroid.SHORT);
            return;
        }
        if(subject==''){
            ToastAndroid.show('Subject required !', ToastAndroid.SHORT);
            return;
        }
        if(body==''){
            ToastAndroid.show('Body required !', ToastAndroid.SHORT);
            return;
        }
        this.setState({
            visible:!this.state.visible
        });
        let serverUrl='http://192.168.43.237:3000';
        setTimeout(()=>{
            fetch(serverUrl+'/SendEmail?email=' + to +
                '&subject=' + subject +
                '&body=' + body
                , {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.valid ==1) {
                        this.setState({
                            visible:false
                        });
                        ToastAndroid.show('Email was send successfull...', ToastAndroid.SHORT);
                    }
                    else {
                        this.setState({
                            visible:!this.state.visible
                        });
                        ToastAndroid.show('Error...', ToastAndroid.SHORT);
                    }
                })
        },2000);
    }
    renderScene(route, navigator) {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                <Progress.CircleSnail size={70} animating={this.state.visible}/>
                <TextInput
                    style={{width: 200}}
                    placeholder="To"
                    onChangeText={(to) => this.setState({to})}
                    value={this.state.to}
                />
                <TextInput
                    style={{width: 200}}
                    placeholder="Subject"
                    onChangeText={(subject) => this.setState({subject})}
                    value={this.state.subject}
                />
                <TextInput
                    style={{width: 200}}
                    placeholder="Body"
                    onChangeText={(body) => this.setState({body})}
                    value={this.state.body}
                />
                <Button
                    style={{fontSize: 20, color: 'green',backgroundColor:'pink'}}
                    styleDisabled={{color: 'red'}}
                    onPress={() => this._sendEmail()}>
                    Send
                </Button>
            </View>
        );
    }
}

var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        return (
            <Button style={{flex: 1, justifyContent: 'center'}}
                    onPress={() => navigator.parentNavigator.pop()}>
                <Text style={{color: 'white', margin: 10,}}>
                    Back
                </Text>
            </Button>
        );
    },
    RightButton(route, navigator, index, navState) {
        return null;
    },
    Title(route, navigator, index, navState) {
        return (
            <Text style={{color: 'white', marginLeft: 80,marginTop:10,marginBottom:10, fontSize: 16}}>
                Email
            </Text>
        );
    }
};

module.exports = EmailService;
