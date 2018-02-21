package com.bindinglistview.list;


import android.support.v7.widget.RecyclerView;
import android.view.ViewGroup;

import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.text.ReactRawTextManager;
import com.facebook.react.views.text.ReactTextShadowNode;

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
            context.runOnNativeModulesQueueThread(() -> {
                uiManager.updateView(cell.getTextTag(), ReactRawTextManager.REACT_CLASS, JavaOnlyMap.of(ReactTextShadowNode.PROP_TEXT, text));
                uiManager.onBatchComplete();
            });
            //TODO:
        }
    }
}
