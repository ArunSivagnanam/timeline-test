import { Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import { Timeline, DataSetDataItem } from 'vis-timeline';
import { DataSet } from 'vis-data';
import BinarySortedArray from 'binary-sorted-array'
import {
  asyncScheduler,
  concat,
  from,
  fromEvent,
  interval,
  observable,
  Observable,
  OperatorFunction,
  timer,
} from 'rxjs';
import {
  scan,
  map,
  debounceTime,
  first,
  throttle,
  throttleTime,
  concatMap,
  ignoreElements,
  startWith,
  bufferTime,
  buffer,
  endWith,
} from 'rxjs/operators';
import { bs, insert as binarySortInsert } from '@kometbomb/binarysearch';
import { of } from 'rxjs';
import { ReturnStatement } from '@angular/compiler';

export interface AggregatedDocuments {

  sortedDocuments: BinarySortedArray;

  uniqueDocuments: Record<string, any>;

}

@Component({
  selector: 'my-app',
  templateUrl: './flights.component.html',
  styleUrls: [ '../app.component.scss' ],
})



export class FlightsComponent implements OnInit  {
  timeline: Timeline;
  options: {};
  data: any;
  groups: any;

  

  @ViewChild('timeline', { static: true }) timelineContainer: ElementRef;

  constructor() {
    this.getTimelineData();
    this.getTimelineGroups();
    this.getOptions();
  }
  


  ngOnInit() {
    this.timeline = new Timeline(this.timelineContainer.nativeElement, this.data, this.options);
    this.timeline.setGroups(this.groups);
    this.timeline.setItems(this.data); 
  }
  // attach events to the navigation buttons
  zoomInFunc(){
    this.timeline.zoomIn(1)
  }

  zoomOutFunc(){
    this.timeline.zoomOut(1)
  }
  moveLeftFunc(){
    var currentTime = new Date()
    currentTime = this.timeline.getWindow().start
    currentTime.setDate(currentTime.getDate()-0.2)
    this.timeline.moveTo(currentTime)
  }
  moveRightFunc(){
    var currentTime = new Date()
    currentTime = this.timeline.getWindow().end
    currentTime.setDate(currentTime.getDate()+0.2)
    this.timeline.moveTo(currentTime)
  }

  getTimelineGroups() {
     // create groups
    this.groups = new DataSet([
      {id: 1, content: 'Airline&nbsp;1'},
      {id: 2, content: 'Airline&nbsp;2'},
      {id: 3, content: 'Airline&nbsp;3'},
      {id: 4, content: 'Airline&nbsp;4'},
      {id: 5, content: 'Airline&nbsp;5'},
      {id: 6, content: 'Airline&nbsp;6'},
      {id: 7, content: 'Airline&nbsp;7'},
      {id: 8, content: 'Airline&nbsp;8'},
      {id: 9, content: 'Airline&nbsp;9'},
      {id: 10, content: 'Airline&nbsp;10'}

    ]);
    }

  getTimelineData() {
      // Create a DataSet (allows two way data-binding)
    // create items

    this.data = new DataSet([]);
    var airports = ["Paris", "Madrid", "London", "Athens", "Moscow", "Milan", "Berlin", "Sofia", "Wien"] // Random airports. 
    var colors = ['red','blue','orange','purple','green']
    /* Theese are the documents already received for a subscription and saved in store.. */
    const store = {
      // subsciption_id
      
      5: {
        // filled in by query stream subscription as documents ar received. Currently empty.
          
      },
    };

    const documentToTableTransformer = (
      subscriptionId: number,
      comparator: (a: string, b: string) => number): Observable<AggregatedDocuments> => 
      {
        const documentsAlreadyInStoreForThisSubscription$ = from(
        Object.values(store[5]));

  /* Theese are random incomming documents. The script can be optimized to create better random dates**/
        const newDocuments$ = interval(2000).pipe( //Interval defines every how many miliseconds data are generated.
          map((e) =>  {

            var id = Math.floor(Math.random() * 10); //defines how many items will be inserted in the timeline (e.g. 10)
            
            const colorPicker = colors[Math.floor(Math.random() * colors.length)];
            const airport = airports[Math.floor(Math.random() * airports.length)];
            var date1 = new Date();
            date1.setHours(date1.getHours()  + 6 * Math.random());
            var start = new Date(date1);

            var date2 = new Date();
            date2.setHours(date2.getHours() + 10 +   Math.floor(Math.random()*4));
            var end = new Date(date2);



            return {className:colorPicker, id:id, start:start, end:end,group: Math.floor(Math.random() * 10) + 1,content:'flight ' + id + 
            '<img src="../assets/img/airplane.jpg" style="width="30px"; height="30px"> Departs for ' + airport}

          })
        );

  /** Already received documents are merged with new incomming to handle "late subscribers".
   * but document processing is still only one document at a time
   */

    const aggregatedDocuments = <AggregatedDocuments> {
        sortedDocuments: new BinarySortedArray({} as any, comparator),
        uniqueDocuments: {}
      }

    const documentToTableTransformed$ = concat(
      documentsAlreadyInStoreForThisSubscription$,
      newDocuments$)
      .pipe(
      /* mapping layer where we map one document to a ui compatible format and calculate visual cues */
      map((d) => d ),

      /* ordering and reducing layer, where we summarize to an aggregated view like ui table */
      scan((aggregatedDocuments:AggregatedDocuments, newDocument:any):AggregatedDocuments => 
      {
        /** Here each document can be inserted into the right index using a comparator and binary search */

        const newIncomingDocument = newDocument
        const oldDocument = aggregatedDocuments.uniqueDocuments[newDocument.id]

        if(aggregatedDocuments.uniqueDocuments[newDocument.id]){
          aggregatedDocuments.sortedDocuments.remove(oldDocument)
        }

        aggregatedDocuments.sortedDocuments.insert(newIncomingDocument);
        aggregatedDocuments.uniqueDocuments[newDocument.id] = newIncomingDocument;

        

        return aggregatedDocuments;
      }, aggregatedDocuments),
        //debounceTime(1000)
    );

    return documentToTableTransformed$;
  };

    const comparator = (a: any, b:any) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    };

    const documentToTableTransformed$ = documentToTableTransformer(5, comparator);

    documentToTableTransformed$.subscribe((data:AggregatedDocuments) => { 
        this.data.update(data.sortedDocuments.getArray()) 
    });
         
  }

  getOptions() {
    this.options = {
      
      start: new Date(),
      end: new Date(1000*60*60*24 + (new Date()).valueOf()),
      editable: true, 
    
      orientation: 'top'
    };
  }
  
}
