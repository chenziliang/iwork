var config = {
    baseUrl: $C.MRSPARKLE_ROOT_PATH + "/" + $C.LOCALE + "/static/js",
    //wrapShim: true,
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'fullcalendar': {
            deps: ['jquery', 'moment']
        },
        'ResizeSensor': {
            deps: ['jquery']
        },
        'ElementQueries': {
            deps: ["ResizeSensor"]
        }
    },
    paths: {
        'app': '../app/Splunk_TA_iwork/js',
        'lib': '../app/Splunk_TA_iwork/lib/',
        'core': '../../static/js',
        'bootstrap': '../app/Splunk_TA_iwork/lib/bootstrap/js/bootstrap.min',
        'd3': '../app/Splunk_TA_iwork/lib/d3/d3.min',
        'moment': '../app/Splunk_TA_iwork/lib/moment/moment.min',
        'fullcalendar': '../app/Splunk_TA_iwork/lib/fullcalendar/fullcalendar.min',
        'ElementQueries': '../app/Splunk_TA_iwork/lib/CSS-Element-Queries/ElementQueries',
        'ResizeSensor': '../app/Splunk_TA_iwork/lib/CSS-Element-Queries/ResizeSensor',
    },
    enforceDefine: false
};

require.config(config);
