import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { MeasurementSchemaTypes } from '../measurements';

const CornerstoneHandleSchema = MeasurementSchemaTypes.CornerstoneHandleSchema;

const LengthHandlesSchema = new SimpleSchema({
    start: {
        type: CornerstoneHandleSchema,
        label: 'Start'
    },
    end: {
        type: CornerstoneHandleSchema,
        label: 'End'
    },
    textBox: {
        type: CornerstoneHandleSchema,
        label: 'Text Box'
    }
});

const LengthSchema = new SimpleSchema([MeasurementSchemaTypes.CornerstoneToolMeasurement, {
    handles: {
        type: LengthHandlesSchema,
        label: 'Handles'
    },
    measurementNumber: {
        type: Number,
        label: 'Measurement Number'
    },
    toolType: {
        type: String,
        label: 'Measurement Tool Type',
        defaultValue: 'length'
    },
    length: {
        type: Number,
        label: 'Length',
        optional: true,
        decimal: true
    }
}]);

export default {
    LengthHandlesSchema,
    LengthSchema
}