import * as platformModule from "tns-core-modules/platform";
import { EventData, Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import { Page } from "ui/page";
import { GridItemEventData } from "nativescript-grid-view";

import * as frame from "ui/frame";
import * as label from "ui/label";
import * as utils from "utils/utils";

let viewModel: Observable;
const item_per_row : number = 3;

export function pageLoaded(args: EventData) {
    const page = args.object as Page;
    const items = new ObservableArray();

    for (let loop = 0; loop < 200; loop++) {
        items.push({ value: "test " + loop.toString() });
    }
    viewModel = new Observable();
    viewModel.set("items", items);

    const itemWidth = Math.floor(
      (platformModule.screen.mainScreen.widthDIPs)/(item_per_row)
    );

    viewModel.set("itemWidth", itemWidth);
    viewModel.set("scrollBarHeight", "0");
    viewModel.set("scrollBarMarginTop", "0");

    page.bindingContext = viewModel;

}

export function updateScrollBar(args: EventData) {
    
    const gridView = frame.topmost().getViewById("gridview");
    if (gridView && gridView.android) {
        
        const recyclerView = gridView.android;
        const layoutManager = recyclerView.getLayoutManager();
        const currentFirstPos = layoutManager.findFirstVisibleItemPosition();
        const currentLastPos = layoutManager.findLastVisibleItemPosition();
        
        if (currentFirstPos > -1) {
            const totalRows = Math.floor( viewModel.get("items").length / item_per_row);
            const firstVisibleRow = Math.floor((currentFirstPos + 1)/item_per_row);
            const lastVisibleRow = Math.floor((currentLastPos + 1)/item_per_row);
            const relativeScrollOffset = firstVisibleRow / totalRows;  
            const relativeScrollExtent = (lastVisibleRow-firstVisibleRow)/totalRows; 
            const verticalScrollExtent = Math.floor(recyclerView.computeVerticalScrollExtent()/ utils.layout.getDisplayDensity());
            
            viewModel.set("scrollBarHeight", verticalScrollExtent * relativeScrollExtent);
            viewModel.set("scrollBarMarginTop", verticalScrollExtent * relativeScrollOffset);
        }else{
            viewModel.set("scrollBarMarginTop", 0);
        }
    }

}
