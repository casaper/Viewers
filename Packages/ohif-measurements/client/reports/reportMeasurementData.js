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
        const { seriesDescription, seriesDate, modality } = cornerstone.metaData.get('series', imageId);

        measurementData.data.push({
            seriesModality: modality,
            seriesDate: moment(seriesDate).toDate(),
            seriesDescription: seriesDescription,
            imageId: imageId,
            measurementTool: measurement.toolType,
            measurementDescription: OHIF.measurements.getLocationLabel(measurement.location) || '',
            measurementValue: info,
            number: measurement.measurementNumber,
            length: measurement.length || '-',
            mean: measurement.meanStdDev.mean || '-', 
            stdDev: measurement.meanStdDev.stdDev || '-',
            area: measurement.area || '-'
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
