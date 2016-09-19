import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import angularMaterialize from 'angular-materialize';
import ngSanitize from 'angular-sanitize';


import { name as TimelinesList } from '../timelinesList/timelinesList';
import { name as TimelineEditor } from '../timelineEditor/timelineEditor';
import { name as TimelineScale} from '../timelineScale/timelineScale';
import { name as TimelineViewer } from '../timelineEditor/timelineEditor';
import { name as EventsEditor } from '../eventsEditor/eventsEditor';
import { name as EventEditor } from '../eventEditor/eventEditor';
import { name as EventsFeed } from '../eventsFeed/eventsFeed';
import { name as EventThumb} from '../eventThumb/eventThumb';
import { name as Navigation } from '../navigation/navigation';
import {name as EventViewer} from '../eventViewer/eventViewer';

import template from './timelineapp.html';


class TimelineApp {}

const name = 'timelineApp';

export default angular.module(name,[
	angularMeteor,
	uiRouter,
	angularMaterialize,
	TimelinesList,
	TimelineEditor,
	TimelineScale,
	TimelineViewer,
	EventsEditor,
	EventEditor,
	EventsFeed,
	EventThumb,
	EventViewer,
	Navigation,
	ngSanitize
]).component(name,{
	template,
	controllerAs: name,
	controller: TimelineApp
}).config(config);

function config ($locationProvider, $urlRouterProvider){
	'ngInject';
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
}