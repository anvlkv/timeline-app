import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './eventViewer.html';

class EventViewer {
	constructor($scope){
		'ngInject';
		// console.log($scope);
	}
}

const name = "eventViewer";

function eventViewer() {
	'ngInject';
	return{
		template,
		controllerAs: name,
		controller: EventViewer,
		restrict: 'E',
		scope: {
			event: '<evEvent'
		},
	}
}


export default angular.module(name, [
	angularMeteor
]).directive(name, eventViewer);
