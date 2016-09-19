import angular from 'angular';
import angularMeteor from 'angular-meteor';
// import angularMaterialize from 'angular-materialize'
import template from './navigation.html';
 
const name = 'navigation';
 
// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name
});