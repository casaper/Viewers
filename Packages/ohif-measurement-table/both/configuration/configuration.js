import { OHIF } from 'meteor/ohif:core';

import { measurementTools } from './measurementTools';
import { retrieveMeasurements, storeMeasurements, retrieveTimepoints, storeTimepoints, removeTimepoint, updateTimepoint, disassociateStudy } from './dataExchange';
import { validateMeasurements } from './dataValidation';
import { FieldLesionLocation, FieldLesionLocationResponse } from 'meteor/ohif:measurement-table/both/schema/fields';

OHIF.measurements.MeasurementApi.setConfiguration({
    measurementTools,
    newLesions: [{
        id: 'allTools',
        name: 'All Tools',
        toolGroupId: 'allTools'
    }],
    dataExchange: {
        retrieve: retrieveMeasurements,
        store: storeMeasurements
    },
    dataValidation: {
        validation: validateMeasurements
    },
    schema: {
        nonTargetLocation: FieldLesionLocation,
        nonTargetResponse: FieldLesionLocationResponse
    }
});

OHIF.measurements.TimepointApi.setConfiguration({
    dataExchange: {
        retrieve: retrieveTimepoints,
        store: storeTimepoints,
        remove: removeTimepoint,
        update: updateTimepoint,
        disassociate: disassociateStudy
    }
});
