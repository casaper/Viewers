import { ToolGroupBaseSchema } from '../schema/tools/toolGroupSchema';
import { length } from './tools/length';
import { ellipticalRoi } from './tools/ellipticalRoi';

const trackedTools = [
    length,
    ellipticalRoi
];

export const measurementTools = [{
    id: 'allTools',
    name: 'Measurements',
    childTools: trackedTools,
    schema: ToolGroupBaseSchema
}];
