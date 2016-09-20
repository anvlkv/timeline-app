import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Events } from '../../../api/events';
import jQuery from 'jquery';
import _ from 'underscore';
import {name as ScaleFactory} from '../scaleFactory/scaleFactory';
import {name as EventViewer} from '../eventViewer/eventViewer';


import template from './eventsFeed.html';

const name = 'eventsFeed';

class EventsFeed {
	constructor ($scope, scaleFactory){
		'ngInject';

		$scope.unfoldedEvents = {};
		$scope.eventsPositions = {};

		$scope.eventsLayout = [];

		$scope.viewCursor = {
			onScale:0,
			width:0,
		};

		$scope.scaleFactory = scaleFactory;

		this.setEventPosition = function (event) {
			let position = scaleFactory.getEventPosition(event.date);
			$scope.eventsPositions[event._id] = {
					onScale: position
				}
		}

		this.setPositionForAllEvents = function(){
			let events = $scope.efEvents;
			if (events) {
				for (var i = 0; i < events.length; i++) {
					this.setEventPosition(events[i]);
				}
			}
		}

		this.offsetEvents = function(){
			let interferences = [];
			for (let e in $scope.eventsLayout){
				// console.log(e);
				for (let e2 in $scope.eventsLayout) {
					if ($scope.eventsLayout[e].event !== $scope.eventsLayout[e2].event) {
						if(
							($scope.eventsLayout[e].top <= $scope.eventsLayout[e2].bottom)
							&& ($scope.eventsLayout[e].bottom >= $scope.eventsLayout[e2].top)
							&& ($scope.eventsLayout[e].left < $scope.eventsLayout[e2].right)
							&& ($scope.eventsLayout[e].right > $scope.eventsLayout[e2].left)
						){
							let flat = [].concat.apply([], interferences);
							if (
								flat.indexOf($scope.eventsLayout[e].event) < 0
								|| flat.indexOf($scope.eventsLayout[e2].event) < 0
							) {
								interferences.push([$scope.eventsLayout[e].event, $scope.eventsLayout[e2].event]);
							}
						}
					}
				}
			}

			for (let i in interferences) {
				let position0 = $scope.eventsPositions[interferences[i][0]],
					position1 = $scope.eventsPositions[interferences[i][1]],
					layout_index0 = _.findIndex($scope.eventsLayout, el=>el.event === interferences[i][0]),
					layout_index1 = _.findIndex($scope.eventsLayout, el=>el.event === interferences[i][1]),
					offScaleVal;



				if (position0 && layout_index0 >=0 && position1 && layout_index1 >=0) {
					let layout0 = $scope.eventsLayout[layout_index0],
						layout1 = $scope.eventsLayout[layout_index1];

					offScaleVal = layout0.right;
				}else{
					console.log('cant figure out appropriate layout... yet');
				}

				$scope.eventsPositions[interferences[i][1]].offScale = offScaleVal;
			}

		}

		this.unfoldEvent = (id)=>{
			if (!$scope.unfoldedEvents[id]) {
				$scope.unfoldedEvents[id] = true;
			}
		}

		this.foldEvent = (id)=>{
			if ($scope.unfoldedEvents[id]) {
				$scope.unfoldedEvents[id] = false;
			}
		}

		this.positionCursor = (id)=>{
			let layout_index = _.findIndex($scope.eventsLayout, el=>el.event === id);
			if (layout_index >= 0) {
				let event_layout = $scope.eventsLayout[layout_index];
				$scope.viewCursor.onScale = event_layout.top - 1;
				$scope.viewCursor.width = 100;
			}
		}

		this.releaseCursor = ()=>{
			$scope.viewCursor.onScale = 0;
			$scope.viewCursor.width = 0;
		}
	}
}

function eventsFeed($timeout){
	'ngInject';
	return{
		template,
		restrict:'A',
		controller: EventsFeed,
		controllerAs: name,
		scope:{
			efSteps: '=efSteps',
			efEvents: '=efEvents',
			viewType: '@efViewType'
		},
		link: function(scope, element, attrs){
			scope.$watch('efSteps', (newVal, oldVal)=>{
				if (newVal) {
					scope.eventsFeed.setPositionForAllEvents();
				}
			})

			scope.$watch('efEvents', (newVal, oldVal)=>{
				if (newVal) {
					for (var i = 0; i < newVal.length; i++) {
						scope.eventsFeed.setEventPosition(newVal[i]);
					}
				}
			});

			scope.$watch('scaleFactory.scaleSize', (val)=>{
				$(element).height(val);
			})

			// $timeout(()=>{
			// 	console.log(element);
			// })
		}
	}
}

function eventItem ($timeout){
	'ngInject';
	return {
		restrict: 'A',
		link:{
			post: function(scope, element, attrs){
				scope.$parent.$watch('eventsPositions', (newVal, oldVal)=>{
					// console.log(newVal, oldVal);
					const changed = [];
					for (let e in newVal) {
						for (let p in newVal[e]) {
							// if (p !== 'offScale') {
								if (!oldVal[e] 
									|| !oldVal[e][p]
									|| newVal[e][p] !== oldVal[e][p]) {
									changed.push(true);
								}else{
									changed.push(false);
								}
							// }else{
							// 	changed.push(false);
							// }
						}
					}

					if (!changed.every(elem => elem === false)) {
						$timeout(()=>{
							if (scope.$first) {
								scope.$parent.eventsLayout = [];
							}

							scope.$parent.eventsLayout.push({
								event: scope.event._id,
								top: $(element).position().top,
								bottom: $(element).position().top + $(element).height(),
								height: $(element).height(),
								left: $(element).position().left,
								right: $(element).position().left + $(element).outerWidth(),
								width: $(element).outerWidth(),
							})

							// console.log($(element).position().left + $(element).outerWidth());
							// console.log($(element).position().left);

							if (scope.$last) {
								scope.$parent.eventsFeed.offsetEvents();
							}
								
						})
					}

				}, true);
				
			}

		}
	}
}

export default angular.module(name, [
	angularMeteor,
	ScaleFactory,
	EventViewer
]).directive(name, eventsFeed)
.directive('eventItem', eventItem);
