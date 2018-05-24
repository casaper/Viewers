import { Meteor } from 'meteor/meteor';
import { Viewerbase } from 'meteor/ohif:viewerbase';

Meteor.startup(function() {
    const toolManager = Viewerbase.toolManager;

    toolManager.addTool('deleteLesionKeyboardTool', {
        mouse: cornerstoneTools.deleteLesionKeyboardTool,
        touch: cornerstoneTools.deleteLesionKeyboardTool
    });

    // Update default state for tools making sure each tool is only inserted once
    let currentDefaultStates = toolManager.getToolDefaultStates();
    let newDefaultStates = {
        enable: [],
        deactivate: [],
        activate: ['deleteLesionKeyboardTool']
    };

    Object.keys(newDefaultStates).forEach(state => {
        newDefaultStates[state].forEach(tool => {
            let tools = currentDefaultStates[state];
            // make sure each tool is only inserted once
            if (tools && tools.indexOf(tool) < 0) {
                tools.push(tool);
            }
        });
    });

    toolManager.setToolDefaultStates(currentDefaultStates);
});
