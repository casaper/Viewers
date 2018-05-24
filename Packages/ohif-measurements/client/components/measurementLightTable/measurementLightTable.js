import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';
import { OHIF } from 'meteor/ohif:core';

Template.measurementLightTable.onCreated(() => {
    const instance = Template.instance();

    instance.data.measurementLightTableLayout = new ReactiveVar('comparison');
    instance.data.timepoints = new ReactiveVar([]);

    // Run this computation every time table layout changes
    instance.autorun(() => {
        // Get the current table layout
        const tableLayout = instance.data.measurementLightTableLayout.get();

        const timepointApi = instance.data.timepointApi;
        let timepoints;
        if (!timepointApi) {
            timepoints = [];
        } else if (tableLayout === 'key') {
            timepoints = timepointApi.key();
        } else {
            timepoints = timepointApi.comparison();
        }

        // Return key timepoints
        instance.data.timepoints.set(timepoints);
    });
});

Template.measurementLightTable.onRendered(() => {
    const instance = Template.instance();

    instance.autorun(() => {
        // Run this computation every time the lesion table layout is changed
        instance.data.measurementLightTableLayout.dep.depend();

        if (instance.data.state.get('rightSidebar') !== 'measurements') {
            // Remove the amount attribute from sidebar element tag
            instance.$('#measurementLightTableContainer').closest('.sidebarMenu').removeAttr('data-timepoints');
            return;
        }

        // Get the amount of timepoints being shown
        const timepointAmount = instance.data.timepoints.get().length;

        // Set the amount in an attribute on sidebar element tag
        instance.$('#measurementLightTableContainer').closest('.sidebarMenu').attr('data-timepoints', timepointAmount);
    });
});
