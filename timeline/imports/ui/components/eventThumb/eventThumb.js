import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './eventThumb.html';

class EventThumb {
	constructor($scope){
		'ngInject';
		// console.log($scope);
	}
}

const name = "eventThumb";

function eventThumb() {
	'ngInject';
	return{
		template,
		controllerAs: name,
		controller: EventThumb,
		restrict: 'E',
		replace: true,
	}
}


export default angular.module(name, [
	angularMeteor
]).directive(name, eventThumb);
