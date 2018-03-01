package com.bindinglistview.list;

import android.support.annotation.NonNull;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.bindinglistview.reacthacks.ReactViewHelper;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashMap;
import java.util.Map;


public class ReactCell extends FrameLayout {

    private ReadableMap rootBindings;
    private Map<String, View> children;
    private UIManagerModule uiManager;

    public ReactCell(@NonNull ReactContext context) {
        super(context);
        uiManager = context.getNativeModule(UIManagerModule.class);
        children = new HashMap<>();
    }

    public void setHeight(int height) {
        setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, height));
    }

    public void setBinding(ReadableMap binding) {
        if (rootBindings != null) {
            ReadableMapKeySetIterator iterator = rootBindings.keySetIterator();
            ReactViewHelper helper = new ReactViewHelper(uiManager);
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                if (binding.hasKey(key)) {
                    ReadableMap viewBindings = binding.getMap(key);
                    String viewName = viewBindings.getString("viewName");
                    int tag = viewBindings.getInt("tag");
                    children.put(key, helper.getView(tag, viewName));
                }
            }
        }
    }

    public void setRootBindings(ReadableMap rootBindings) {
        this.rootBindings = rootBindings;
    }

    public Map<String, View> getChildren() {
        return children;
    }

    public ReactViewGroup getViewGroup() {
        return (ReactViewGroup) getChildAt(0);
    }
}
