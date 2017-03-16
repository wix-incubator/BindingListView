import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View
} from 'react-native';
import _ from 'lodash';
import BindingListView from './BindingListView';

const names = require('./names.json');
const contacts = [];
for (let i=0 ; i<5000 ; i++) {
  const first = _.sample(names);
  const last = _.sample(names);
  contacts.push({
    name: `${first} ${last}`,
    initials: `${first.charAt(0)}${last.charAt(0)}`
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
            { id: 'nameText', toRowKey: 'name' }
          ]}
          renderItemTemplate={this.renderItemTemplate.bind(this)}
          rowHeight={71}
          poolSize={20}
          style={{flex: 1}}
        />
      </View>
    );
  }
  renderItemTemplate(bind) {
    return (
      <View style={styles.rowBody}>
        <View style={styles.initialsCircle}>
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
  renderItemTemplate2(bind) {
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
