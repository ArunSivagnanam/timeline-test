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
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})



export class AppComponent implements OnInit  {
 
  constructor() {
   
  }
  

  ngOnInit() {
  
  }

  
}
