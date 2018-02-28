package com.bindinglistview.list;

import android.content.Context;
import android.support.annotation.NonNull;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;


public class ReactCell extends FrameLayout {

    private int textTag;
    private int imageTag;

    public ReactCell(@NonNull Context context) {
        super(context);
    }

    public void setHeight(int height) {
        setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, height));
    }

    public void setBinding(ReadableMap binding) {
        if (binding.hasKey("nameText")) {
            textTag = binding.getMap("nameText").getInt("tag");
        }
        if (binding.hasKey("thumbnail")) {
            imageTag = binding.getMap("thumbnail").getInt("tag");
        }
    }

    public int getTextTag() {
        return textTag;
    }

    public ReactViewGroup getViewGroup() {
        return (ReactViewGroup) getChildAt(0);
    }
}
