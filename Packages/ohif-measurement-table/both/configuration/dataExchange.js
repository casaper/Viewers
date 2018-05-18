import { measurementTools } from './measurementTools';

export const retrieveMeasurements = (patientId, timepointIds) => {
    OHIF.log.info('retrieveMeasurements');

    return new Promise((resolve, reject) => {
        Meteor.call('retrieveMeasurements', patientId, timepointIds, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

export const storeMeasurements = (measurementData, timepointIds) => {
    OHIF.log.info('storeMeasurements');

    // Here is where we should do any required data transformation and API calls

    return new Promise((resolve, reject) => {
        Meteor.call('storeMeasurements', measurementData, timepointIds, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

export const retrieveTimepoints = filter => {
    OHIF.log.info('retrieveTimepoints');

    return new Promise((resolve, reject) => {
        Meteor.call('retrieveTimepoints', filter, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

export const storeTimepoints = (timepointData) => {
    OHIF.log.info('storeTimepoints');
    OHIF.log.info(timepointData);

    return new Promise((resolve, reject) => {
        Meteor.call('storeTimepoints', timepointData, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

export const updateTimepoint = (timepointData, query) => {
    OHIF.log.info('updateTimepoint');
    OHIF.log.info(timepointData);
    OHIF.log.info(query);

    return new Promise((resolve, reject) => {
        Meteor.call('updateTimepoint', timepointData, query, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

export const removeTimepoint = timepointId => {
    OHIF.log.info('removeTimepoint');
    OHIF.log.info(timepointId);

    return new Promise((resolve, reject) => {
        Meteor.call('removeTimepoint', timepointId, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

export const disassociateStudy = (timepointIds, studyInstanceUid) => {
    OHIF.log.info('disassociateStudy');
    OHIF.log.info(timepointIds);
    OHIF.log.info(studyInstanceUid);

    return new Promise((resolve, reject) => {
        Meteor.call('disassociateStudy', timepointIds, studyInstanceUid, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};
