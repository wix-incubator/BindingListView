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
  'https://i.imgur.com/JhkYX7Ob.jpg',
  'https://i.imgur.com/UvLRqGQb.jpg',
  'https://i.imgur.com/H7ZaN6Qb.jpg',
  'https://i.imgur.com/h5OS6fmb.jpg',
  'https://i.imgur.com/VyQDhx6b.jpg',
  'https://i.imgur.com/VcyAGdrb.jpg',
  'https://i.imgur.com/u68RL2tb.jpg',
  'https://i.imgur.com/nXvIbsNb.jpg',
  'https://i.imgur.com/TGkvvRSb.jpg',
  'https://i.imgur.com/SAk6HtRb.jpg',
  'https://i.imgur.com/7Bvc4kLb.png'
];

const names = require('./names.json');
const contacts = [];
for (let i=0 ; i<5000 ; i++) {
  const first = _.sample(names);
  const last = _.sample(names);
  contacts.push({
    name: `${first} ${last}`,
    initials: `${first.charAt(0)}${last.charAt(0)}`,
    image: [{uri: images[i%20]}]
  });
}

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BindingListView
          rows={contacts}
          binderMap={{
            initialsText: {
              toRowKey: 'initials'
            },
            nameText: {
              toRowKey: 'name'
            },
            thumbnail: {
              toRowKey: 'image'
            }
          }}
          // renderItemTemplate={this.renderItemTemplate_withTextInputs.bind(this)}
          // renderItemTemplate={this.renderItemTemplate_withTexts.bind(this)}
          renderItemTemplate={this.renderItemTemplate_withRelayout.bind(this)}
          // renderItemTemplate={this.renderItemTemplate_withImages.bind(this)}
          rowHeight={71}
          poolSize={20}
          style={{flex: 1}}
        />
      </View>
    );
  }
  renderItemTemplate_withTextInputs(binderMap) {
    return (
      <View style={styles.rowBody}>
        <View style={styles.initialsCircle}>
          <TextInput
            value={binderMap.initialsText}
            editable={false}
            style={styles.initials} />
        </View>
        <TextInput
          value={binderMap.nameText}
          editable={false}
          style={styles.name} />
      </View>
    );
  }
  renderItemTemplate_withTexts(binderMap) {
    return (
      <View style={styles.rowBody}>
        <View style={[styles.initialsCircle, {backgroundColor: '#e6796a'}]}>
          <Text style={styles.initials}>{binderMap.initialsText}</Text>
        </View>
        <Text style={styles.name}>{binderMap.nameText}</Text>
      </View>
    );
  }
  renderItemTemplate_withRelayout(binderMap) {
    return (
      <View style={styles.rowBodyRelayout}>
        <Text style={styles.nameRelayout}>{binderMap.nameText}</Text>
        <Text style={styles.initialsRelayout}>{binderMap.initialsText}</Text>
      </View>
    );
  }
  renderItemTemplate_withImages(binderMap) {
    return (
      <View style={styles.rowBody}>
        <Image
          style={styles.initialsCircle}
          source={{uri: binderMap.thumbnail}} />
        <Text style={styles.name}>{binderMap.nameText}</Text>
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
    // backgroundColor: '#49bed8',
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
  },
  nameRelayout: {
    fontSize: 20,
    backgroundColor: 'red',
    marginRight: 10
  },
  initialsRelayout: {
    fontSize: 20,
    backgroundColor: 'yellow'
  },
  rowBodyRelayout: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: 'white',
    height: 71
  },
});

AppRegistry.registerComponent('BindingListView', () => App);
