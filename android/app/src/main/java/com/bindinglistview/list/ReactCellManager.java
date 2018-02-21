package com.bindinglistview.list;

import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;


public class ReactCellManager extends ViewGroupManager<ReactCell> {
    @Override
    public String getName() {
        return "RCTBindingCell";
    }

    @Override
    protected ReactCell createViewInstance(ThemedReactContext reactContext) {
        return new ReactCell(reactContext);
    }

    @ReactProp(name = "bindings")
    public void setBindings(ReactCell view, ReadableMap bindings) {
        view.setBinding(bindings);
    }
}
