import angular from 'angular';
import angularMeteor from 'angular-meteor';

 
import template from './timelineRemove.html';
import { Timelines } from '../../../api/timelines';

class TimelineRemove {
  remove() {
  	if (this.timeline) {
  		Timelines.remove(this.timeline._id);
  	}
  }
}
 
const name = 'timelineRemove';
 
// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  bindings:{
  	timeline: '<'
  },
  controllerAs: name,
  controller: TimelineRemove
});