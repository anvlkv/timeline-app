import {name as TimelineEditor} from '../timelineEditor';
import { Timelines } from '../../../../api/timelines';
import 'angular-mocks';

describe('TimelineEditor', ()=>{
	beforeEach(()=>{
		window.module(TimelineEditor);
	});

	describe('controller', ()=>{
		let controller;
		const timeline ={
			name: 'Foo',
			description: 'Birthday of Foo'
		};

		beforeEach(()=>{
			inject(($rootScope, $componentController)=>{
				controller = $componentController(TimelineEditor,{
					$scope: $rootScope.$new(true)
				});
			});
		});

		describe('saveTimeline(timeline)',()=>{
			beforeEach(()=>{
				spyOn(Timelines, 'upsert');
				controller.saveTimeline(timeline);
			});

			it('should upsert a timeline',()=>{
				expect(Timelines.upsert).toHaveBeenCalledWith(timeline);
			});
		})
	})
});