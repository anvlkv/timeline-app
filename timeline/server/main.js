import { Meteor } from 'meteor/meteor';
import { Timelines } from '../imports/api/timelines'
import { Events } from '../imports/api/events'

Meteor.startup(() => {
  if (Timelines.find().count() === 0) {
    const timelines = [{
      'name': 'Dubstep-Free Zone',
      'description': 'Fast just got faster with Nexus S.'
    }, {
      'name': 'All dubstep all the time',
      'description': 'Get it on!'
    }, {
      'name': 'Savage lounging',
      'description': 'Leisure suit required. And only fiercest manners.'
    }];
 
    timelines.forEach((timeline) => {
      Timelines.insert(timeline)
    });
  }

  // console.log(Events.find({}).fetch());
});