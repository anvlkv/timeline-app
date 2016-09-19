import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMaterialize from 'angular-materialize';
import uiRouter from 'angular-ui-router';
import { Timelines } from '../../../api/timelines';
import { name as TimelineScale} from '../timelineScale/timelineScale';
import { Events } from '../../../api/events';
 
import template from './timelineViewer.html';
 
class TimelineViewer {
  constructor($scope ,$stateParams, $reactive, $attrs) {
    'ngInject';
 	
 	$reactive(this).attach($scope);

    this._id = $stateParams.timelineId;

    this.helpers({
    	timeline () {
	        return Timelines.findOne({_id:this._id});
    	},
    	events () {
    		let timeline = Timelines.findOne({_id:this._id});
    		if (timeline) {
    			let eventsList = timeline.events;
    			if (eventsList) {
    				let events = Events.find({_id:{$in:eventsList}},{sort:{date:1}});
    				// console.log(events.fetch());
    				$scope.events = events.fetch();
    				return events;
    			}
    		}
    		
    	},
    	scaleParams () {
    		const scale = {};
    		let timeline = Timelines.findOne({_id:this._id});
    		let events = [];
    		if (timeline) {
    			let eventsList = timeline.events;
    			if (eventsList) {
	    			events = Events.find({_id:{$in:eventsList}}, {sort:{date:1}}).fetch();
    			}
    		}
    		if (events.length > 0 && timeline) {
    			// console.log('lets build a scale');
    			scale.startDate = events[0].date;
    			scale.endDate  = events[events.length - 1].date;
    			scale.step = timeline.scale_step;

    		}
    		return scale;
    	}
    });

    // console.log(this, $scope);
  }
}
 
const name = 'timelineViewer';
 
// create a module
export default angular.module(name, [
	angularMeteor,
	angularMaterialize,
	uiRouter,
  TimelineScale,
]).component(name, {
	template,
	controllerAs: name,
	controller: TimelineViewer
}).config(config);

function config($stateProvider){
	'ngInject';

	$stateProvider
	.state('viewTimeline',{
		url:'/timeline/:timelineId',
		template: '<timeline-viewer></timeline-viewer>'
	});
}