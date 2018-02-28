package com.bindinglistview.list;


import android.support.v7.widget.RecyclerView;
import android.text.SpannableString;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.image.ReactImageView;

import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;

public class ReactListAdapter extends RecyclerView.Adapter<ReactListAdapter.ReactViewHolder> {

    private ReactContext context;
    private ReadableArray data;
    private UIManagerModule uiManager;
    private Queue<ReactCell> unusedCells = new LinkedBlockingQueue<>();

    ReactListAdapter(ReactContext reactContext) {
        context = reactContext;
        this.uiManager = reactContext.getNativeModule(UIManagerModule.class);
    }

    @Override
    public ReactViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        if (unusedCells.size() > 0) {
            return new ReactViewHolder(unusedCells.poll());
        } else {
            throw new IllegalStateException("You need to provide more cells for pool");
        }
    }

    @Override
    public void onBindViewHolder(ReactViewHolder holder, int position) {
        holder.bindData();
    }

    @Override
    public int getItemCount() {
        return data.size();
    }

//    @Override
//    public void onViewDetachedFromWindow(ReactViewHolder holder) {
//        addCell((ReactCell) holder.itemView);
//    }

//    @Override
//    public void onViewRecycled(ReactViewHolder holder) {
//        addCell((ReactCell) holder.itemView);
//    }

    void setData(ReadableArray data) {
        this.data = data;
    }

    void addCell(ReactCell cell) {
        unusedCells.add(cell);
    }

    int getPoolSize() {
        return unusedCells.size();
    }

    class ReactViewHolder extends RecyclerView.ViewHolder {

        private ReactCell cell;

        ReactViewHolder(ReactCell itemView) {
            super(itemView);
            cell = itemView;
        }

        void bindData() {
            ReadableMap item = data.getMap(getAdapterPosition());
            final String text = item.getString("name");
            View imageView = cell.getViewGroup().getChildAt(0);
            if (imageView instanceof ReactImageView) {
                ((ReactImageView) imageView).setSource(item.getArray("image"));
                ((ReactImageView) imageView).maybeUpdateView();
            }
            View view = cell.getViewGroup().getChildAt(1);
            if (view instanceof TextView) {
                ((TextView) view).setText(new SpannableString(text));
            }
//            ((TextView)((ViewGroup)this.itemView).getChildAt(0)).setText(text);
//            context.runOnNativeModulesQueueThread(() -> {
//                uiManager.updateView(cell.getTextTag(), ReactRawTextManager.REACT_CLASS, JavaOnlyMap.of(ReactTextShadowNode.PROP_TEXT, text));
//                uiManager.onBatchComplete();
//            });
            //TODO:
        }
    }
}
