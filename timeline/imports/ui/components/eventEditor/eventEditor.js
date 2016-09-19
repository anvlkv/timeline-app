import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMaterialize from 'angular-materialize';
// import uiRouter from 'angular-ui-router';
import { Events } from '../../../api/events';
// import { name as EventsEditor } from './eventsEditor/eventsEditor';
// import { name as TimelineViewer } from '../timelineViewer/timelineViewer';
 
// console.log(EventsEditor);

import template from './eventEditor.html';
 
class EventEditor {
  constructor($scope ,$stateParams, $reactive) {
    'ngInject';

    let RC = $reactive(this).attach($scope);

    // $scope.eventId = this.eeEvent;
    this.helpers({
    	event() {
    		let currentEvent = $scope.getReactively('eeEvent');

    		// console.log(currentEvent);
    		return Events.findOne({_id:currentEvent});
    	}
    });
  }

  saveEvent (event){
  	console.log(event);
  	Events.upsert({_id:event._id}, event, (error, result)=>{
  		// console.log(result);
  		// console.log(error, result);
  		if (!error && result.insertedId) {
  			// $state.go('editTimeline',{timelineId:result.insertedId});

  			// console.log(result,this);
  			// this.reset();
  			Materialize.toast('Event saved', 2000);
  		}else if(!error){
  			// console.log(result);
  			Materialize.toast('Event updated', 2000);
  		}else{
  			// console.log(error, result);
  			Materialize.toast('Error: '+error, 2000);
  		}
  	});
  }

  // reset(){
  // 	this.event = {};
  // }
}
 
const name = 'eventEditor';

function eventEditorDirective () {
	return {
		template,
		controllerAs: name,
		controller: EventEditor,
		scope: {
			eeEvent: '<'
		},
		link: function(scope, iElement, iAttrs){
			// console.log(ngModelCtrl.$viewValue)
		}
	}
}
 
// create a module
export default angular.module(name, [
	angularMeteor,
	angularMaterialize,
	// uiRouter,
	// EventsEditor,
	// TimelineViewer,
]).directive(name, eventEditorDirective);


//.config(config);

// function config($stateProvider){
// 	'ngInject';

// 	$stateProvider
// 	.state('editTimeline',{
// 		url:'/dashboard/edit/:timelineId',
// 		template: '<timeline-editor></timeline-editor>'
// 	}).state('newTimeline',{
// 		url:'/dashboard/new-timeline',
// 		template: '<timeline-editor></timeline-editor>'
// 	});;
// }
