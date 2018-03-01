package com.bindinglistview.reacthacks;

import android.support.annotation.Nullable;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.text.ReactTextView;

public class ReactViewHelper<T extends View> {

    private final UIManagerModule uiManager;

    public ReactViewHelper(UIManagerModule uiManager) {
        this.uiManager = uiManager;
    }

    public View getView(final int tag, final String name) {
        Class clazz = getViewClass(name);
        NativeViewHierarchyManager nativeViewHierarchyManager = ReactHacks.getNativeViewHierarchyManager(uiManager);
        if (nativeViewHierarchyManager == null) {
            return null;
        }
        try {
            final View maybeView = nativeViewHierarchyManager.resolveView(tag);
            final T view = (T) (clazz.isAssignableFrom(maybeView.getClass()) ? maybeView : findChildByClass((ViewGroup) maybeView, clazz));
            if (view == null) {
                return null;
            }
            return view;
        } catch (IllegalViewOperationException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Nullable
    private static <T> T findChildByClass(ViewGroup root, Class clazz) {
        for (int i = 0; i < root.getChildCount(); i++) {
            View view = root.getChildAt(i);
            if (clazz.isAssignableFrom(view.getClass())) {
                return (T) view;
            }

            if (view instanceof ViewGroup) {
                view = findChildByClass((ViewGroup) view, clazz);
                if (view != null && clazz.isAssignableFrom(view.getClass())) {
                    return (T) view;
                }
            }
        }
        return null;
    }

    private static Class getViewClass(String viewName) {
        switch (viewName) {
            case "RCTRawText":
                return ReactTextView.class;
            case "RCTImageView":
                return ReactImageView.class;
        }
        return View.class;
    }
}
