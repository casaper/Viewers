import { OHIF } from 'meteor/ohif:core';
import { MeasurementReport } from '../reports/measurement';

OHIF.measurements.exportPdf = (measurementApi, timepointApi) => {
    const currentTimepoint = timepointApi.current();
    const { timepointId } = currentTimepoint;
    const study = OHIF.viewer.Studies.findBy({
        studyInstanceUid: currentTimepoint.studyInstanceUids[0]
    });
    const report = new MeasurementReport({
        header: {
            trial: 'RECIST 1.1',
            patientName: OHIF.viewerbase.helpers.formatPN(study.patientName),
            mrn: study.patientId,
            timepoint: timepointApi.name(currentTimepoint)
        }
    });

    const printMeasurement = (measurement, callback) => {
        OHIF.measurements.getImageDataUrl({ measurement }).then(imageDataUrl => {
            const imageId = OHIF.viewerbase.getImageIdForImagePath(measurement.imagePath);
            const info = measurement.response || '';
            const type = measurementApi.toolsGroupsMap[measurement.toolType] || '';
            
            report.printMeasurement({
                type,
                number: measurement.measurementNumber,
                location: OHIF.measurements.getLocationLabel(measurement.location) || '',
                info,
                image: imageDataUrl
            });

            processMeasurements(callback);
        });
    };

    const processMeasurements = callback => {
        const current = iterator.next();
        if (current.done) {
            callback();
            return;
        }

        const measurement = current.value;
        printMeasurement(measurement, callback);
    };

    const measurements = measurementApi.fetch('allTools', { timepointId });
    const iterator = measurements[Symbol.iterator]();

    processMeasurements(() => report.save('measurements.pdf'));
};
