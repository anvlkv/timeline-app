import angular from 'angular';
import angularMeteor from 'angular-meteor';
import jQuery from 'jquery';
// import angularMaterialize from 'angular-materialize';
import { name as TimelineScale} from '../timelineScale/timelineScale';
import { name as EventsFeed} from '../eventsFeed/eventsFeed';
import { name as EventThumb} from '../eventThumb/eventThumb';
import { name as EventEditor } from '../eventEditor/eventEditor';

// import { name as TimelineEditor} from '../timelineEditor';

import { Events } from '../../../api/events';
// console.log(Events);

// console.log(TimelineEditor);

import template from './eventsEditor.html';

class EventsEditor{
	constructor($scope, $reactive){
		'ngInject';

		$reactive(this).attach($scope);

		this.helpers({
			events () {
				let eventsList = $scope.timelineEditor.getReactively('timeline.events', true);
				if (eventsList) {
					let events = Events.find({_id:{$in:eventsList}},{sort:{date:1}});
					// console.log(events.fetch());
					$scope.events = events.fetch();
					return events;
				}
			},
			timeline () {
				return $scope.timelineEditor.getReactively('timeline', true);
			},
			scaleParams () {
				const scale = {};
				const timeline = $scope.timelineEditor.getReactively('timeline', true);
				let eventsList = $scope.timelineEditor.getReactively('timeline.events', true);
				let events = [];
				if (eventsList) {
					events = Events.find({_id:{$in:eventsList}}, {sort:{date:1}}).fetch();
				}
				

				// console.log(eventsList,events)

				if (events.length > 0 && timeline) {
					// console.log('lets build a scale');
					scale.startDate = events[0].date;
					scale.endDate  = events[events.length - 1].date;
				}

				if ($scope.timelineEditor.getReactively('timeline.scale_step', true)) {
					scale.step = $scope.timelineEditor.getReactively('timeline.scale_step', true);
				}
				// console.log(scale);
				// $scope.scaleParams = scale;
				return scale;
			}
		});

		// console.log($scope);
	}
}

function eventsEditorDirective(){
	'ngInject';
	return{
		template,
		require: 'ngModel',
		controller: EventsEditor,
		controllerAs: name,
		transclude: true,
		bindings:{
			tlTimeline: '<'
		},
		link: function (scope, iElement, iAttrs, ngModelController){
			// console.log(scope, iElement, iAttrs, ngModelController);
			function pushToModel(eventId){
				let val =  ngModelController.$viewValue;
				val.push(eventId);
				ngModelController.$setViewValue(val,'NEW_EVENT');
			}

			function createEvent(){
				let id = Events.insert({});
				return id;
			}

			scope.newEvent = function(){
				let event = createEvent();
				pushToModel(event);

				scope.editingEvent = event;
			}

			// closes on submit !!! not on success
			$(iElement).find('form').submit(function(event) {
				// console.log(event);
				$('#newEventModal').closeModal();

				scope.editingEvent = '';
			});
		}
	}
}

const name = 'eventsEditor';

// create a module
export default angular.module(name, [
  angularMeteor,
  // angularMaterialize,
  TimelineScale,
  EventsFeed,
  EventThumb,
  EventEditor,
  // TimelineEditor
]).directive(name, eventsEditorDirective);



