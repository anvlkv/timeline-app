import angular from 'angular';
import angularMeteor from 'angular-meteor';
import moment from 'moment';

const name = 'scaleFactory';

function scaleFactory (){
	'ngInject';
	let scaleFactory = {};

	scaleFactory.dropScale = ()=>{
		scaleFactory.scaleParams={};
		scaleFactory.scale=[];
		scaleFactory.scaleIndex=[];
		scaleFactory.endDate='';
		scaleFactory.startDate='';
		scaleFactory.unit = [];
		scaleFactory.fraction = [];
		scaleFactory.alignment= '';
		scaleFactory.labelFormat='',
		scaleFactory.fractionLabelFormat='';
	}

	// init scale;
	scaleFactory.dropScale();

	scaleFactory.setParams = (params)=>{
		if (params.step) {
			scaleFactory.unit = params.step.split('_');
			scaleFactory.unit[0] = Number(scaleFactory.unit[0]);
			// unit fraction as tuple
			if (scaleFactory.unit[0] > 1) {
				
				scaleFactory.fraction = [1, scaleFactory.unit[1]];

				switch (scaleFactory.unit[1]){
					case 'hours':
						scaleFactory.alignment = 'days';
						break;
					case 'months':
						scaleFactory.alignment = 'years';
						break;
					case 'years':
						scaleFactory.alignment = 'decades';
						break;
					default:
						scaleFactory.alignment = scaleFactory.unit[1];
						break;
				}

			}else if (scaleFactory.unit[0] === 1){
				scaleFactory.alignment = scaleFactory.unit[1];
				switch (scaleFactory.unit[1]){
					case 'years':
						scaleFactory.fraction = [3, 'months'];
						break;
					case 'months':
						scaleFactory.fraction = [1, 'weeks'];
						break;
					case 'weeks':
						scaleFactory.fraction = [1, 'days'];
						break;
					case 'hours':
						scaleFactory.fraction = [15, 'minutes'];
						break;
					case 'days':
						scaleFactory.fraction = [6, 'hours'];
						break;
					default:
						scaleFactory.fraction = [1, scaleFactory.unit[1]];
						break;
				}
			}
			// label formating
			switch (scaleFactory.unit[1]){
				case 'hours':
					scaleFactory.labelFormat = 'HH:mm [<small>]DD/MM/YYYY[</small>]';
					scaleFactory.fractionLabelFormat = 'HH:mm';
					break;
				case 'days':
					scaleFactory.labelFormat = 'DD/MM [<small>]YYYY[</small>]';
					scaleFactory.fractionLabelFormat = 'HH:mm';
					break;
				case 'weeks':
					scaleFactory.labelFormat = 'ww [<small>]MM/YYYY[</small>]';
					scaleFactory.fractionLabelFormat = 'ddd';
					break;
				case 'months':
					scaleFactory.labelFormat = 'MMM [<small>]YYYY[</small>]';
					if (scaleFactory.unit[0] === 1) {
						scaleFactory.fractionLabelFormat = 'DD MMM';
					}else{
						scaleFactory.fractionLabelFormat = 'MMM';
					}
					break;
				case 'years':
					scaleFactory.labelFormat = 'YYYY';
					if (scaleFactory.unit[0] === 1) {
						scaleFactory.fractionLabelFormat = 'MMM';
					}else{
						scaleFactory.fractionLabelFormat = 'YYYY';
					}
					break;
				default:
					scaleFactory.labelFormat = 'HH:MM DD/MM/YYYY';
					scaleFactory.fractionLabelFormat = scaleFactory.labelFormat;
					break;
			}

		}else{
			scaleFactory.unit = [1, 'years'];
			scaleFactory.fraction = [1, 'months'];
		}


		// console.log(alignment);
		// scale's 0
		if (!params.isRelative) {
			if (params.startDate) {
				scaleFactory.startDate = moment(params.startDate).startOf(scaleFactory.alignment)._d;
			}else{
				scaleFactory.startDate = moment().startOf(scaleFactory.alignment)._d;
			}

			if (params.endDate) {

				scaleFactory.endDate = moment(params.endDate).endOf(scaleFactory.alignment)._d;
				// console.log(scaleFactory.endDate, params.endDate);
			}else{
				scaleFactory.endDate = moment(scaleFactory.startDate)
					.add(scaleFactory.unit[0], scaleFactory.unit[1])
					.endOf(scaleFactory.alignment)._d;
			}
		} else {
			scaleFactory.startDate = moment(0)._d;
		}
	}

	scaleFactory.computeScale = (params)=>{
		scaleFactory.setParams(params);

		let steps = [];
			unit= scaleFactory.unit,
			fraction= scaleFactory.fraction,
			alignment= scaleFactory.alignment,
			labelFormat= scaleFactory.labelFormat,
			fractionLabelFormat= scaleFactory.fractionLabelFormat;

		buildFullScale(
			scaleFactory.startDate,
			moment(scaleFactory.endDate).add(unit[0], unit[1])._d
		);

		// build intemediate scale
		function buildIntermScale(startD, targetD){
			let startM = moment(startD);
			// console.log(fraction);
			// minor step
			let mStep = {
				date: moment(startD).add(fraction[0], fraction[1])._d,
				fractionLabel: moment(startD).add(fraction[0], fraction[1]).format(fractionLabelFormat),
			};

			steps.push(mStep);
			scaleFactory.addToScaleIndex(startD);

			if(moment(mStep.date).isBefore(targetD)){
				buildIntermScale(mStep.date, targetD)
			}
		}


		// build full scale
		function buildFullScale(startD, targetD){

			// console.log(startD, targetD);
			// add current major step
			steps.push({
				label: moment(startD).format(labelFormat),
				date: startD,
				fractionLabel: moment(startD).format(fractionLabelFormat),
			});

			scaleFactory.addToScaleIndex(startD);

			let nextStep = moment(startD).add(unit[0], unit[1])._d;

			// add intermediate steps
			buildIntermScale(startD, 
				moment(nextStep).subtract(fraction[0], fraction[1])._d
			);

			if (moment(nextStep).isBefore(targetD)) {
				buildFullScale(nextStep ,targetD);
			}
		}

		return steps;
	}

	scaleFactory.addToScaleIndex = (date)=>{
		scaleFactory.scaleIndex.push(date);
	}

	scaleFactory.getSteps = (newParams)=>{
		scaleFactory.scaleParams = newParams;
		scaleFactory.scale = scaleFactory.computeScale(newParams);
		return scaleFactory.scale
	}

	scaleFactory.setPosition = (index, position)=>{
		scaleFactory.scale[index].position = position;
	}

	scaleFactory.getEventPosition = (date)=>{
		let position;
		// find closest date
		const adjacentDates = findAdjDates(date);

		// calculate position
		if (adjacentDates && scaleFactory.scale[adjacentDates[0]] && scaleFactory.scale[adjacentDates[1]]) {
			if (scaleFactory.scale[adjacentDates[0]].position && scaleFactory.scale[adjacentDates[1]].position) {
				let prevStep = scaleFactory.scale[adjacentDates[0]],
					nextStep = scaleFactory.scale[adjacentDates[1]],
					positionDiff = nextStep.position - prevStep.position,
					dateDiff = nextStep.date - prevStep.date,
					dateOff = date - prevStep.date,
					positionOff = dateOff/(dateDiff/positionDiff);

					position = Math.round(prevStep.position + positionOff);
			}
		}


		function findAdjDates(testDate) {
			const dates = scaleFactory.scaleIndex;
			let bestPrevDate = dates.length;
			let bestNextDate = dates.length;

			let max_date_value = Math.abs((new Date(0,0,0)).valueOf());

			let bestPrevDiff = max_date_value;
			let bestNextDiff = -max_date_value;

			let currDiff = 0;

			for(let i = 0; i < dates.length; ++i){
			   currDiff = testDate - dates[i];
			   // console.log(currDiff);
			   if(currDiff < 0 && currDiff > bestNextDiff){
			   // If currDiff is negative, then testDate is more in the past than dates[i].
			   // This means, that from testDate's point of view, dates[i] is in the future
			   // and thus by a candidate for the next date.

			       bestNextDate = i;
			       bestNextDiff = currDiff;
			       // console.log('currDiff < 0 && currDiff > bestNextDiff', bestNextDate, bestNextDiff);
			   }
			   if(currDiff > 0 && currDiff < bestPrevDiff){
			   // If currDiff is positive, then testDate is more in the future than dates[i].
			   // This means, that from testDate's point of view, dates[i] is in the past
			   // and thus by a candidate for the previous date.
			       bestPrevDate = i;
			       bestPrevDiff = currDiff;
			       // console.log('currDiff > 0 && currDiff < bestPrevDiff', bestNextDate, bestNextDiff);
			   }   

			}

			return [bestPrevDate, bestNextDate];
		}

		return position ? position : 0;

	}

	return scaleFactory;
}

export default angular.module('ScaleFactoryProvider',[
	angularMeteor
]).factory(name, scaleFactory);