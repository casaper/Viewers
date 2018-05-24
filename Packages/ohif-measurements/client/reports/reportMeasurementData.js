import { moment } from 'meteor/momentjs:moment';
import { OHIF } from 'meteor/ohif:core';
import { MeasurementReport } from '../reports/measurement';

export const getExportMeasurementData = async (measurementApi, timepointApi) => {
    const currentTimepoint = timepointApi.current();
    const { timepointId } = currentTimepoint;
    const study = OHIF.viewer.Studies.findBy({
        studyInstanceUid: currentTimepoint.studyInstanceUids[0]
    });
    const patientName = OHIF.viewerbase.helpers.formatPN(study.patientName);
    const mrn = study.patientId
    
    // All headers
    const measurementData = {
        studyInfo: {
            patientName: patientName,
            mrn: mrn,
            studyDate: moment(study.studyDate).toDate(),
            studyDescription: study.studyDescription
        },
        data: []
    };

    const addNewMeasurement = async (measurement) => {
        const imageDataUrl = await OHIF.measurements.getImageDataUrl({ measurement });
            
        const imageId = OHIF.viewerbase.getImageIdForImagePath(measurement.imagePath);
        const info = measurement.length || '';
        const type = measurement.toolType || '';
        
        measurementData.data.push({
            seriesModality: 'Series Modality',
            seriesDate: 'Series Date',
            seriesDescription: 'Series Description',
            imageId: '<imageId>',
            imageDataUrl: imageDataUrl,
            measurementTool: type,
            measurementDescription: OHIF.measurements.getLocationLabel(measurement.location) || '',
            measurementValue: info,
            number: measurement.measurementNumber,
        });
    };

    const measurements = measurementApi.fetch('allTools', { timepointId });
    const iterator = measurements[Symbol.iterator]();

    let measurement;
    const current = iterator.next();
    while (!current.done) {
        measurement = current.value;
        await addNewMeasurement(measurement);
        current = iterator.next();
    }
    
    return measurementData;
};
