import { OHIF } from 'meteor/ohif:core';
import { _ } from 'meteor/underscore';

OHIF.cornerstone = {};

OHIF.cornerstone.pixelToPage = (element, position) => {
    const enabledElement = cornerstone.getEnabledElement(element);
    const result = {
        x: 0,
        y: 0
    };

    // Stop here if the cornerstone element is not enabled or position is not an object
    if (!enabledElement || typeof position !== 'object') {
        return result;
    }

    const canvas = enabledElement.canvas;

    const canvasOffset = $(canvas).offset();
    result.x += canvasOffset.left;
    result.y += canvasOffset.top;

    const canvasPosition = cornerstone.pixelToCanvas(element, position);
    result.x += canvasPosition.x;
    result.y += canvasPosition.y;

    return result;
};

OHIF.cornerstone.repositionTextBoxWhileDragging = (eventData, measurementData) => {
    const element = eventData.element;
    const enabledElement = cornerstone.getEnabledElement(element);
    const $element = $(element);
    const image = enabledElement.image;

    const getAvailableBlankAreas = (enabledElement, labelWidth, labelHeight) => {
        const { element, canvas, image } = enabledElement;

        const topLeft = cornerstone.pixelToCanvas(element, {
            x: 0,
            y: 0
        });

        const bottomRight = cornerstone.pixelToCanvas(element, {
            x: image.width,
            y: image.height
        });

        const $canvas = $(canvas);
        const canvasWidth = $canvas.outerWidth();
        const canvasHeight = $canvas.outerHeight();

        const result = {};
        result['x-1'] = topLeft.x > labelWidth;
        result['y-1'] = topLeft.y > labelHeight;
        result.x1 = canvasWidth - bottomRight.x > labelWidth;
        result.y1 = canvasHeight - bottomRight.y > labelHeight;

        return result;
    };

    const calculateAxisCenter = (axis, start, end) => {
        const a = start[axis];
        const b = end[axis];
        const lowest = Math.min(a, b);
        const highest = Math.max(a, b);
        return lowest + ((highest - lowest) / 2);
    };

    const getTextBoxSizeInPixels = (element, axis, bounds) => {
        const topLeft = cornerstone.pageToPixel(element, 0, 0);
        const bottomRight = cornerstone.pageToPixel(element, bounds.x, bounds.y);
        const boxSize = bottomRight[axis] - topLeft[axis];
        return boxSize;
    };

    const modifiedCallback = () => {
        const handles = measurementData.handles;
        const textBox = handles.textBox;

        const bounds = {};
        bounds.x = textBox.boundingBox.width;
        bounds.y = textBox.boundingBox.height;

        const getHandlePosition = key => _.pick(handles[key], ['x', 'y']);
        const start = getHandlePosition('start');
        const end = getHandlePosition('end');

        const tool = {};
        tool.x = calculateAxisCenter('x', start, end);
        tool.y = calculateAxisCenter('y', start, end);

        const mid = {};
        mid.x = image.width / 2;
        mid.y = image.height / 2;

        const directions = {};
        directions.x = tool.x < mid.x ? -1 : 1;
        directions.y = tool.y < mid.y ? -1 : 1;

        const points = {};
        points.x = directions.x < 0 ? 0 : image.width;
        points.y = directions.y < 0 ? 0 : image.height;

        const diffX = directions.x < 0 ? tool.x : image.width - tool.x;
        const diffY = directions.y < 0 ? tool.y : image.height - tool.y;

        let cornerAxis = diffY < diffX ? 'y' : 'x';

        const availableAreas = getAvailableBlankAreas(enabledElement, bounds.x, bounds.y);
        const tempDirections = _.clone(directions);
        let tempCornerAxis = cornerAxis;
        let foundPlace = false;
        let current = 0;
        while (current < 4) {
            if (availableAreas[tempCornerAxis + tempDirections[tempCornerAxis]]) {
                foundPlace = true;
                break;
            }

            // Invert the direction for the next iteration
            tempDirections[tempCornerAxis] *= -1;

            // Invert the tempCornerAxis
            tempCornerAxis = tempCornerAxis === 'x' ? 'y' : 'x';

            current++;
        }

        if (foundPlace) {
            _.extend(directions, tempDirections);
            cornerAxis = tempCornerAxis;
        } else {
            const $canvas = $(enabledElement.canvas);
            const offset = $canvas.offset();
            const position = {
                x: directions.x < 0 ? offset.left : offset.left + $canvas.outerWidth(),
                y: directions.y < 0 ? offset.top : offset.top + $canvas.outerHeight()
            };
            const pixelPosition = cornerstone.pageToPixel(element, position.x, position.y);
            points[cornerAxis] = pixelPosition[cornerAxis];
        }

        const toolAxis = cornerAxis === 'x' ? 'y' : 'x';

        textBox[cornerAxis] = points[cornerAxis];
        textBox[toolAxis] = tool[toolAxis];

        // Adjust the text box position reducing its size from the corner axis
        const isDirectionPositive = directions[cornerAxis] > 0;
        if ((foundPlace && !isDirectionPositive) || (!foundPlace && isDirectionPositive)) {
            const boxSize = getTextBoxSizeInPixels(element, cornerAxis, bounds);
            textBox[cornerAxis] -= boxSize;
        }
    };

    const mouseUpCallback = () => {
        $element.off('CornerstoneToolsMeasurementModified', modifiedCallback);
    };

    $element.one('CornerstoneToolsMouseDrag', () => {
        $element.on('CornerstoneToolsMeasurementModified', modifiedCallback);
    });

    // Using mouseup because sometimes the CornerstoneToolsMouseUp event is not triggered
    $element.one('mouseup', mouseUpCallback);
};