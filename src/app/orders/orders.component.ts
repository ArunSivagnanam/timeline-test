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
  styleUrls: ['../app.component.scss']
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

  zoomInFunc(){
    this.timeline.zoomIn(1)
  }

  zoomOutFunc(){
    this.timeline.zoomOut(1)
  }
  moveLeftFunc(){
    var currentTime = new Date()
    currentTime = this.timeline.getWindow().start
    currentTime.setDate(currentTime.getDate()-0.1)
    this.timeline.moveTo(currentTime)
  }
  moveRightFunc(){
    var currentTime = new Date()
    currentTime = this.timeline.getWindow().end
    currentTime.setDate(currentTime.getDate()+0.2)
    this.timeline.moveTo(currentTime)
  }

  

  getTimelineGroups(){
    // create groups
    this.groups = new DataSet([
      {id: 1, content: 'Packaging',subgroupStack:{sg:true,sg1:false}},
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
    

    var start = new Date();
    start.setDate(start.getDate())
    var end = new Date();
    end.setDate(start.getDate()+1)
    console.log(end)

    var start1 = new Date();
    start1.setDate(start1.getDate())
    var end1 = new Date();
    end1.setDate(start1.getDate()+3)

    var start2 = new Date();
    start2.setDate(start2.getDate())
    var end2 = new Date();
    end2.setDate(start2.getDate()+2)


    this.data = new DataSet([])
    this.data.add(
    [
      {
        id:0,
        start: start,
        end:end,
        group: 1,
        content: 'requested',
        className:'blue',
        subgroup:'sg1'
      },
      {
        id:1,
        start: start1,
        end:end1,
        group: 1,
        content: 'actual',
        className:'darkblue',
        subgroup:'sg'
      },
      {
        id:2,
        start:start2,
        end:end2,
        group:1,
        content:'expected',
        className:'striped',
        subgroup:'sg'
      }
    ])
  }

  getOptions(){
    var currentTime = new Date()
    currentTime.setDate(currentTime.getDate())
    currentTime.setMonth(currentTime.getMonth())
    this.options = {
      start: new Date(currentTime.getFullYear(),currentTime.getMonth(),currentTime.getDate()-2),
      end: new Date(currentTime.getFullYear(),currentTime.getMonth()+1),
      orientation: 'top',
      editable:true,
      align:'center'
    }
  }

}
