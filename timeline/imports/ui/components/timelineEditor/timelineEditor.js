import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMaterialize from 'angular-materialize';
import uiRouter from 'angular-ui-router';
import { Timelines } from '../../../api/timelines';
import { name as EventsEditor } from '../eventsEditor/eventsEditor';
import { name as TimelineViewer } from '../timelineViewer/timelineViewer';
import { name as EventEditor } from '../eventEditor/eventEditor';
 
// console.log(EventsEditor);

import template from './timelineEditor.html';
 
class TimelineEditor {
  constructor($scope ,$stateParams, $reactive) {
    'ngInject';
 	
 	$reactive(this).attach($scope);

    this.timelineId = $stateParams.timelineId;

    this.helpers({
    	timeline () {
    		if ($stateParams.timelineId) {
    			let tl = Timelines.findOne({_id:$stateParams.timelineId});
    			return tl;
    		}else{
    			return {
    				public_timeline:true,
    				scale_step: '1_years',
    				events: [],
    			}
    		}
    	}
    });

    this.scaleOptions=[
	    {
	    	value: '1_hours',
	    	name: '1 hour'
	    },{
	    	value: '6_hours',
	    	name: '6 hours'
	    },{
	    	value: '12_hours',
	    	name: '12 hours'
	    },{
	    	value: '1_days',
	    	name: '1 day'
	    },{
	    	value: '1_weeks',
	    	name: '1 week'
	    },{
	    	value: '1_months',
	    	name: '1 month'
	    },{
	    	value: '3_months',
	    	name: '3 months'
	    },{
	    	value: '6_months',
	    	name: '6 months'
	    },{
	    	value: '1_years',
	    	name: '1 year'
	    },{
	    	value: '5_years',
	    	name: '5 years'
	    },{
	    	value: '10_years',
	    	name: '10 years'
	    },{
	    	value: '50_years',
	    	name: '50 years'
	    },{
	    	value: '100_years',
	    	name: '100 years'
	    }
    ]

  }

  saveTimeline (timeline){
  	Timelines.upsert({_id:timeline._id}, timeline, (error, result)=>{
  		// console.log(error, result);
  		if (!error && result.insertedId) {
  			// $state.go('editTimeline',{timelineId:result.insertedId});
  			// console.log(result);
  			this.timelineId = result.insertedId;
  			Materialize.toast('Timeline saved', 2000);
  		}else if(!error){
  			// console.log(result);
  			
  			Materialize.toast('Timeline updated', 2000);
  			
  		}else{
  			// console.log(error, result);
  			Materialize.toast('Error: '+error, 2000);
  		}
  	});
  }
}
 
const name = 'timelineEditor';
 
// create a module
export default angular.module(name, [
	angularMeteor,
	angularMaterialize,
	uiRouter,
	EventsEditor,
	TimelineViewer,
	EventEditor,
]).component(name, {
	template,
	controllerAs: name,
	controller: TimelineEditor
}).config(config);

function config($stateProvider){
	'ngInject';

	$stateProvider
	.state('editTimeline',{
		url:'/dashboard/edit/:timelineId',
		template: '<timeline-editor></timeline-editor>'
	}).state('newTimeline',{
		url:'/dashboard/new-timeline',
		template: '<timeline-editor></timeline-editor>'
	});;
}
