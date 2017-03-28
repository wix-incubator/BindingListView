import _ from 'lodash';
import React, { Component } from 'react';
import ReactNative, { View, requireNativeComponent } from 'react-native';
import StaticContainer from './StaticContainer';
const ReactNativeAttributePayload = require('ReactNativeAttributePayload');

const RCTBindingListView = requireNativeComponent('RCTBindingListView');
const RCTBindingCell = requireNativeComponent('RCTBindingCell');

export default class BindingListView extends Component {
  render() {
    const poolChildren = [];
    for (let i=0 ; i<this.props.poolSize ; i++) {
      const child = (
        <BindingRow key={i} renderItemTemplate={this.props.renderItemTemplate} binderMap={this.props.binderMap} />
      );
      poolChildren.push(child);
    }
    const binding = _.mapValues(this.props.binderMap, (v) => v.toRowKey);
    return (
      <RCTBindingListView
        rows={this.props.rows}
        binding={binding}
        numRows={this.props.rows.length}
        rowHeight={this.props.rowHeight}
        style={this.props.style}
      >
        {poolChildren}
      </RCTBindingListView>
    );
  }
}

class BindingRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bindings: {}
    }
  }
  render() {
    return (
      <RCTBindingCell bindings={this.state.bindings} ref={this.elementCreated.bind(this)}>
        <StaticContainer>
          {this.props.renderItemTemplate(_createBinderMap(this.props.binderMap))}
        </StaticContainer>
      </RCTBindingCell>
    );
  }
  elementCreated(element) {
    if (!_.isEmpty(this.state.bindings)) return;
    const bindings = {};
    const inverseBinderMap = _.invert(_createBinderMap(this.props.binderMap));
    _getBindingsRecursivelyFromElement(element, bindings, inverseBinderMap);
    if (!_.isEmpty(bindings)) {
      this.setState({bindings});
    }
  }
}

function _hashBindingId(bindingId) {
  return `__${bindingId}__`;
}

function _createBinderMap(binderMapDict) {
  return _.mapValues(binderMapDict, (v, k) => _hashBindingId(k));
}

function _getBindingsRecursivelyFromElement(element, bindings, inverseBinderMap) {
  if (!element) return;
  while (element._renderedComponent) {
    element = element._renderedComponent;
  }
  if (element._renderedChildren) {
    _.forEach(element._renderedChildren, (child) => _getBindingsRecursivelyFromElement(child, bindings, inverseBinderMap));
  }
  if (element._currentElement && element.viewConfig) {
    const props = element._currentElement.props;
    const viewConfig = element.viewConfig;
    const propUpdates = ReactNativeAttributePayload.create(props, viewConfig.validAttributes);
    _.forEach(propUpdates, (newValue, propName) => {
      let bindingId;
      if (_.isString(newValue)) {
        bindingId = inverseBinderMap[newValue];
      }
      if (_.isArray(newValue) || _.isPlainObject(newValue)) {
        _.cloneDeepWith(newValue, (v) => {
          if (_.isString(v)) {
            foundBindingId = inverseBinderMap[v];
            if (foundBindingId) bindingId = foundBindingId;
            return foundBindingId;
          }
        });
      }
      if (bindingId) {
        bindings[bindingId] = {
          tag: ReactNative.findNodeHandle(element),
          prop: propName,
          viewName: _.get(viewConfig, 'uiViewClassName')
        };
      }
    });
  }
  if (element._currentElement && _.isString(element._currentElement)) {
    const bindingId = inverseBinderMap[element._currentElement];
    if (bindingId) {
      bindings[bindingId] = {
        tag: ReactNative.findNodeHandle(element),
        prop: 'text',
        viewName: 'RCTRawText'
      };
    }
  }
}
