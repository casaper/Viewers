import { ToolGroupBaseSchema } from '../schema/tools/toolGroupSchema';
import { length } from './tools/length';
import { ellipticalRoi } from './tools/ellipticalRoi';
import { rectangleRoi } from './tools/rectangleRoi';

const trackedTools = [
    length,
    ellipticalRoi,
    rectangleRoi
];

export const measurementTools = [{
    id: 'allTools',
    name: 'Measurements',
    childTools: trackedTools,
    schema: ToolGroupBaseSchema
}];
