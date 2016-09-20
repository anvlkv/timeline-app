import angular from 'angular';
import angularMeteor from 'angular-meteor';
import moment from 'moment';
import jQuery from 'jquery'
// import angularMaterialize from 'angular-materialize';
import {name as ScaleFactory} from '../scaleFactory/scaleFactory';

import template from './timelineScale.html';


class TimelineScale {
	constructor($scope, scaleFactory){
		'ngInject';
		$scope.steps = [];
		this.scaleParams = {};

		$scope.scaleFactory = scaleFactory;

		$scope.$watch('tlScale', (newVal, oldVal)=>{
			
			if (Object.keys(newVal).length > 0) {

				const changed = [];
				const keys = Object.keys(newVal);

				for (var i = 0; i < keys.length; i++) {
					// newVal[keys[i]]
					if (!this.scaleParams[keys[i]] || this.scaleParams[keys[i]] !== newVal[keys[i]] ) {
						this.scaleParams[keys[i]] = newVal[keys[i]];
						changed.push(true);
					}else{
						changed.push(false);
					}
				}

				if (!changed.every(elem => elem === false)) {
					scaleFactory.dropScale();
					$scope.steps = $scope.scaleFactory.getSteps(newVal);
				}
			}

		})

		
	}
}



const name = 'timelineScale';

function tlScale (){
	'ngInject';
	return {
		template,
		restrict: 'E',
		controllerAs: name,
		controller: TimelineScale,
		require: '?ngModel',
		scope:{
			tlScale: '=tlScale'
		},
		link: function(scope, iElement, iAttrs, ngModelCtrl){
			scope.$watch('scaleReady',(newVal, oldVal)=>{
				if (newVal) {
					ngModelCtrl.$setViewValue(scope.steps);
					ngModelCtrl.$render();
				}
			})
		}
	}
}


export default angular.module(name,[
	angularMeteor,
	ScaleFactory
]).directive(name, tlScale)
.directive('scaleStep', function($timeout){
	'ngInject';
	return {
		restrict: 'A',
		link: {
			post:function(scope, iElement, iAttrs, ngModelCtrl){
				scope.$watch('step',()=>{
					$timeout(function(){
						scope.scaleFactory.setPosition(
							scope.$index, 
							angular.element(iElement).prop('offsetTop')
							+ angular.element(iElement).prop('offsetHeight')/2
						);

						// console.log()

						if (scope.$last) {
							scope.scaleFactory.setScaleSize(
								angular.element(iElement).prop('offsetTop')
								+ angular.element(iElement).prop('offsetHeight')
							);
							scope.$parent.scaleReady = true;
						}else{
							scope.$parent.scaleReady = false;
						}
					});
				})
			}
		}
	}
});