import { moment } from 'meteor/momentjs:moment';
import { OHIF } from 'meteor/ohif:core';

OHIF.measurements.createTimepointForUnicStudyInstanceUID = study => {

    //OHIF.log.info('Saving associations');
    const Timepoints = OHIF.studylist.timepointApi.timepoints;


    // Create an empty object to group studies into
    const studies = {};

    studies['baseline'] = study;

    const studiesKeys = Object.keys(studies);
    const studyDate = moment(study.studyDate).toDate();

    const patientId = study.patientId;
    Timepoints.remove({ patientId });

    let existingTimepoint;
    existingTimepoint = Timepoints.findOne({
        timepointId: study.studyInstanceUid,
        timepointType: 'baseline'
    });

    if(!existingTimepoint) {
        // Create a new timepoint to represent the (baseline or follow-up) studies
        let timepoint = {
            timepointType: 'baseline',
            timepointId: study.studyInstanceUid,
            studyInstanceUids: [study.studyInstanceUid],
            patientId: patientId,
            earliestDate: studyDate,
            latestDate: studyDate,
            isLocked: false
        };

        // Insert this timepoint into the Timepoints Collection
        Timepoints.insert(timepoint);
        timepointId = timepoint.timepointId;

        OHIF.studylist.timepointApi.storeTimepoints();
    }

    return study;
};
