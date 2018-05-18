Npm.depends({
    ajv: '4.10.4',
    jspdf: '1.3.3'
});

Package.describe({
    name: 'ohif:measurement-table',
    summary: 'OHIF Measurement table',
    version: '0.0.1'
});

Package.onUse(function(api) {
    api.versionsFrom('1.4');

    api.use('ecmascript');
    api.use('standard-app-packages');
    api.use('jquery');
    api.use('stylus');
    api.use('random');

    api.use('validatejs');
    api.use('momentjs:moment');

    // Schema for Data Models
    api.use('aldeed:simple-schema');
    api.use('aldeed:collection2');

    // Template overriding
    api.use('aldeed:template-extension@4.0.0');

    // Our custom packages
    api.use('ohif:design');
    api.use('ohif:cornerstone');
    api.use('ohif:core');
    api.use('ohif:cornerstone-settings');
    api.use('ohif:studies');
    api.use('ohif:select-tree');
    api.use('ohif:log');
    api.use('ohif:hanging-protocols');
    api.use('ohif:viewerbase');

    api.addFiles('both/index.js', [ 'client', 'server' ]);

    api.addFiles('server/index.js', 'server');

    api.addFiles('client/index.js', 'client');

    // Export client-side collections
    api.export('LesionLocations', 'client');
    api.export('LocationResponses', 'client');
    api.export('MeasurementSchemaTypes', ['client', 'server']);
});
