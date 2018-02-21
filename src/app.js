import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  Image
} from 'react-native';
import _ from 'lodash';
import BindingListView from './BindingListView';

const images = [
  'https://i.imgur.com/GCBVgXDb.jpg',
  'https://i.imgur.com/EXQVxqQb.jpg',
  'https://i.imgur.com/zADtGy9b.jpg',
  'https://i.imgur.com/EZDQNshb.jpg',
  'https://i.imgur.com/Jvh1OQmb.jpg',
  'https://i.imgur.com/tqZm14Rb.jpg',
  'https://i.imgur.com/9NltrAUb.jpg',
  'https://i.imgur.com/t6X0wXBb.jpg',
  'https://i.imgur.com/w7L7Rdkb.jpg',
  'https://i.imgur.com/JhkYX7Ob.jpg'
];

const names = require('./names.json');
const contacts = [];
for (let i=0 ; i<5000 ; i++) {
  const first = _.sample(names);
  const last = _.sample(names);
  contacts.push({
    name: `${first} ${last}`,
    initials: `${first.charAt(0)}${last.charAt(0)}`,
    image: [{uri: images[i%10]}]
  });
}

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BindingListView
          rows={contacts}
          binding={[
            { id: 'initialsText', toRowKey: 'initials' },
            { id: 'nameText', toRowKey: 'name' },
            { id: 'thumbnail', toRowKey: 'image'}
          ]}
          // renderItemTemplate={this.renderItemTemplate_withTextInputs.bind(this)}
          // renderItemTemplate={this.renderItemTemplate_withTexts.bind(this)}
          renderItemTemplate={this.renderItemTemplate_withImages.bind(this)}
          rowHeight={71}
          poolSize={40}
          style={{flex: 1}}
        />
      </View>
    );
  }
  renderItemTemplate_withTextInputs(bind) {
    return (
      <View style={styles.rowBody}>
        <View style={styles.initialsCircle}>
          <TextInput
            ref={(element) => bind(element, { id: 'initialsText', toProp: 'text' })}
            editable={false}
            style={styles.initials} />
        </View>
        <TextInput
          ref={(element) => bind(element, { id: 'nameText', toProp: 'text' })}
          editable={false}
          style={styles.name} />
      </View>
    );
  }
  renderItemTemplate_withTexts(bind) {
    return (
      <View style={styles.rowBody}>
        <View style={[styles.initialsCircle, {backgroundColor: '#e6796a'}]}>
          <Text
            ref={(element) => bind(element, { id: 'initialsText', toProp: 'children' })}
            style={styles.initials}>FL</Text>
        </View>
        <Text
          ref={(element) => bind(element, { id: 'nameText', toProp: 'children' })}
          style={styles.name}>First Last</Text>
      </View>
    );
  }
  renderItemTemplate_withImages(bind) {
    return (
      <View style={styles.rowBody}>
        <Image
          ref={(element) => bind(element, { id: 'thumbnail', toProp: 'source' })}
          style={styles.initialsCircle}
          source={{uri: images[0]}} />
        <Text
          ref={(element) => bind(element, { id: 'nameText', toProp: 'children' })}
          style={styles.name}>First Last</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  rowBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: 'white'
  },
  initialsCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#49bed8',
    borderRadius: 25,
    width: 50,
    height: 50,
    marginRight: 15
  },
  imageCircle: {
    width: 50,
    height: 50
  },
  initials: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
  name: {
    fontSize: 20,
    backgroundColor: 'white',
    flex: 1
  }
});

AppRegistry.registerComponent('BindingListView', () => App);
