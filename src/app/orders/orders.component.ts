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

@Component({
  selector: 'my-app',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

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

  ngOnInit(): void {
    this.timeline = new Timeline(this.timelineContainer.nativeElement, this.data, this.options);
    this.timeline.setGroups(this.groups);
    this.timeline.setItems(this.data);
  }

  getTimelineGroups(){
    // create groups
    this.groups = new DataSet([
      {id: 1, content: 'Packaging'},
      {id: 2, content: 'QA Release'},
      {id: 3, content: 'In Transist to shipping point'},
      {id: 4, content: 'Available on stock'},
      {id: 5, content: 'Pick and Pack'},
      {id: 6, content: 'Invoicing'},
      {id: 7, content: 'Planning'},
      {id: 8, content: 'Shipping to country'},
    ]);
  }

  getTimelineData(){
    var colors = ['blue','darkblue']
    const colorPicker = colors[Math.floor(Math.random() * colors.length)];
    var start = new Date("September 21,2022");
    var end = new Date("September 23,2022");

    var start1 = new Date("September 21,2022");
    var end1 = new Date("September 22,2022");



    this.data = new DataSet([])
    this.data.add(
      [
       {
        id:2,
        start: start,
        end:end,
        group: 1,
        content: 'actual',
        className:'darkblue'
        },
      {
        id:1,
        start: start1,
        end:end1,
        group: 1,
        content: 'requested',
        className:'blue'
      }
    ]
     
    )
    
  }

  getOptions(){
    this.options = {
      orientation: 'top',
      editable:true
    }
    
  }

}
