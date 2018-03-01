package com.bindinglistview.list;


import android.support.v7.widget.RecyclerView;
import android.text.SpannableString;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.text.ReactTextView;

import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;

public class ReactListAdapter extends RecyclerView.Adapter<ReactListAdapter.ReactViewHolder> {

    private ReadableArray data;
    private Queue<ReactCell> unusedCells = new LinkedBlockingQueue<>();
    private ReadableMap bindings;

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

    void setBindings(ReadableMap bindings) {
        this.bindings = bindings;
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
            ReadableMapKeySetIterator iterator = bindings.keySetIterator();
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                View view = cell.getChildren().get(key);
                if (view instanceof ReactImageView) {
                    ((ReactImageView) view).setSource(item.getArray(bindings.getString(key)));
                    ((ReactImageView) view).maybeUpdateView();
                }
                if (view instanceof ReactTextView) {
                    final String text = item.getString(bindings.getString(key));
                    ((ReactTextView) view).setText(new SpannableString(text));
                }
            }
            //TODO:
        }
    }
}
