import * as platformModule from "tns-core-modules/platform";
import { Component, NgZone } from "@angular/core";
import { OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { ViewChild } from "@angular/core";

import * as utils from "utils/utils";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    template: `
    
    
        <ActionBar 
          title="SampleApp"
        >
        </ActionBar>


        <GridLayout>
            <GridView 
                #gridview 
                [items]="items" 
                [colWidth]="itemWidth" 
                [rowHeight]="itemWidth" 
            >
                <ng-template let-item="item" let-i="index">
                    <Label 
                      [text]="i"    
                      fontSize="20"
                      textAlignment="center"
                      verticalAlignment="center"
                      backgroundColor="cyan"
                      [width]="itemWidth"
                      [height]="itemWidth"
                      borderWidth="1"
                      borderColor="white"
                    >
                    </Label>
                </ng-template>
            </GridView>

            <Label
              #scrollbar
              width="5"
              height="0"
              marginRight="2"
              backgroundColor="rgb(80,80,80)"
              horizontalAlignment="right"
              verticalAlignment="top"
            >
            </Label>

        </GridLayout>


    `,
})
export class ItemsComponent implements OnInit, AfterViewInit, OnDestroy{
    
    items: any;
    item_per_row: number = 3;
    itemWidth: number;

    @ViewChild('gridview') gridview: any;
    @ViewChild('scrollbar') scrollbar: any;

    constructor(
      private zone: NgZone) {
        
        this.items = Array.from({length: 100}, (v, k) => k);
    
        this.itemWidth = Math.floor(
          (platformModule.screen.mainScreen.widthDIPs)/(this.item_per_row)
        );
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        // [XXX] you must set scroll event outside of zone!!
        // otherwise, each scroll invokes a change detection, which results in a deterioration of performance
        this.zone.runOutsideAngular(() => {
            this.gridview.nativeElement.addEventListener("scroll",(e) => {
                this.updateScrollBar();
            });
        });
    }

    ngOnDestroy() {
        this.gridview.nativeElement.removeEventListener("scroll");
    }

    updateScrollBar() {
      
      if (this.gridview.nativeElement && this.gridview.nativeElement.android) {
        
        const recyclerView = this.gridview.nativeElement.android;
        const layoutManager = recyclerView.getLayoutManager();
        const currentFirstPos = layoutManager.findFirstVisibleItemPosition();
        const currentLastPos = layoutManager.findLastVisibleItemPosition();
        
        if (currentFirstPos > -1){
          const totalRows = Math.floor(this.items.length / this.item_per_row);
          const firstVisibleRow = Math.floor((currentFirstPos + 1)/this.item_per_row);
          const lastVisibleRow = Math.floor((currentLastPos + 1)/this.item_per_row);
          const relativeScrollOffset = firstVisibleRow / totalRows;  
          const relativeScrollExtent = (lastVisibleRow-firstVisibleRow)/totalRows; 
          const verticalScrollExtent = Math.floor(recyclerView.computeVerticalScrollExtent()/ utils.layout.getDisplayDensity());
          this.scrollbar.nativeElement.height = verticalScrollExtent * relativeScrollExtent;
          this.scrollbar.nativeElement.marginTop = verticalScrollExtent * relativeScrollOffset;

        }else{
          this.scrollbar.nativeElement.marginTop = 0;
        }

       }
    }


}
