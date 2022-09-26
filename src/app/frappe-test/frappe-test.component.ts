import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Gantt from 'frappe-gantt';
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

export interface AggregatedDocuments {

  sortedDocuments: BinarySortedArray;

  uniqueDocuments: Record<string, any>;

}

@Component({
  selector: 'my-app',
  templateUrl: './frappe-test.component.html',
  styleUrls: ['./frappe-test.component.scss']
})
export class FrappeTestComponent implements OnInit {

  gantt: Gantt;
  options: {};
  tasks:any

  @ViewChild('gantt', { static: true }) ganttEl: ElementRef;

  constructor() {
    //this.getTimelineData();
    this.tasks = [{
      id:"1",
      start: '2022-02-03',
      end: '2022-02-07',
      class: 'pink'
    }]
    this.getTimelineData()
   }

  ngOnInit(): void {

    this.gantt = new Gantt('#gantt',this.tasks,{
      view_mode:"Month",
      bar_corner_radius: 50,
      bar_height: 50,
      step:100,
      padding:30,
      custom_popup_html: function(task){
        return `
          <div class="gantt-container">
            <p>Flight: ${task.id} <img src="../assets/img/airplane.jpg" style="width="30px"; height="30px"></p>
            <p>Expected to reach destination: ${task.end}</p>
            <p>Destination is: ${task.destination}</p>
          </div>
          
        
        `
      }
    })
        
  }

  zoomDayFunc(){
    this.gantt.change_view_mode("Day")
  }
  zoomWeekFunc(){
    this.gantt.change_view_mode("Week")
  }
  zoomMonthFunc(){
    this.gantt.change_view_mode("Month")
  }

  zoomYearFunc(){
    this.gantt.change_view_mode("Year")
  }
  

  getTimelineData() {
    var airports = ["Paris", "Madrid", "London", "Athens", "Moscow", "Milan", "Berlin", "Sofia", "Wien"] // Random airports. 
    var colors = ['blue','purple','pink']
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

          const colorPicker = colors[Math.floor(Math.random() * colors.length)];
          var id = Math.floor(Math.random() * 10); //defines how many items will be inserted in the timeline (e.g. 10)
          const airport = airports[Math.floor(Math.random() * airports.length)];
          var date1 = new Date();
          date1.setFullYear(2022);
          date1.setMonth(date1.getMonth()+6*Math.random())
          date1.setDate(date1.getDate()+2*Math.random())
          var start = date1.getFullYear()+'-'+date1.getMonth()+'-'+date1.getDate()


          var date2 = new Date();
          date2.setFullYear(2022);
          date2.setMonth(date2.getMonth()+10*Math.random())
          date2.setDate(date2.getDate()+10*Math.random())
         
          var end = date2.getFullYear()+'-'+date2.getMonth()+'-'+date2.getDate()
          
        
          return { id:id, 
            start:start, 
            end:end, 
            name:"flight "+id + " departs for "+airport,
            destination:airport,
            dependencies:'',
            custom_class: colorPicker
          }

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
    
      //let destination = airports[Math.floor(Math.random() * airports.length)];
      this.tasks = data.sortedDocuments.getArray()  
      this.gantt.refresh(this.tasks)
     
  });
}

}
