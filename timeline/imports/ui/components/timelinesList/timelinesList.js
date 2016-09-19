import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMaterialize from 'angular-materialize';
import uiRouter from 'angular-ui-router';
import { Timelines } from '../../../api/timelines';
import { name as TimelineEditor } from '../timelineEditor/timelineEditor';
import { name as TimelineRemove } from '../timelineRemove/timelineRemove';
import { name as TimelineViewer } from '../timelineEditor/timelineEditor';

import template from './timelinesList.html'


class TimelinesList {
	constructor($scope, $reactive){
		'ngInject';

		$reactive(this).attach($scope);

		this.helpers({
			timelines () {
				return Timelines.find({});
			},
		});
	}
}



const name = 'timelinesList';

export default angular.module(name,[
	angularMeteor,
	uiRouter,
	TimelineViewer,
	TimelineEditor,
	TimelineRemove,
]).component(name,{
	template,
	controllerAs: name,
	controller: TimelinesList
}).config(config);

function config($stateProvider){
	'ngInject';

	$stateProvider
	.state('dashboard',{
		url:'/dashboard',
		template: '<timelines-list></timelines-list>'
	});
}