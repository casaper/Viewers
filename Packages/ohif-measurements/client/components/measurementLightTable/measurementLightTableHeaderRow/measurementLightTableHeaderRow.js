import { Template } from 'meteor/templating';
import { OHIF } from 'meteor/ohif:core';
import { Viewerbase } from 'meteor/ohif:viewerbase';

Template.measurementLightTableHeaderRow.helpers({
    numberOfMeasurements(toolGroupId) {
        const { toolGroup, measurementRows } = Template.instance().data;
        if (toolGroup.id === 'newTargets') {
            let result = 0;

            measurementRows.forEach(measurementRow => {
                const measurementData = measurementRow.entries[0];
                if (measurementData.isSplitLesion) return;
                result++;
            });

            return result;
        }

        return measurementRows.length ? measurementRows.length : null;
    }
});
