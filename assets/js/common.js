var App;
if(!window.console) {
        var console = {
            log : function(){},
            warn : function(){},
            error : function(){},
            time : function(){},
            timeEnd : function(){}
        }
    }
var log = function() {};

require.config({
    paths: {
        "jQuery": "../../plugins/jquery/jquery.min",
        "jQuerySlim": "../../plugins/jquery/jquery.slim.min",
        "bootstrap" : "../../plugins/bootstrap/js/bootstrap.bundle.min",
        "select2" : "../../plugins/select2/js/select2.full.min",
        "toastr" : "../../plugins/toastr/toastr.min",
        "jqvalidate" : "../../plugins/jquery-validate/jquery.validate.min",
        "fullcalendar" : "../../plugins/fullcalendar/main.min",
        "moment" : "../../plugins/moment/moment.min",
        "datatables" : "../../plugins/datatables/jquery.dataTables.min",
        "html2pdf" : "../../plugins/html2pdf.js-master/dist/html2pdf.bundle.min",
        "datatablesBootstrap" : "../../plugins/datatables-bs4/js/dataTables.bootstrap4.min",
        "highcharts" : "../../plugins/highchart/highcharts.src",
        "highcharts3d" : "../../plugins/highchart/highcharts-3d.src",
        "Handsontable" : "../../plugins/handsontable/handsontable.full.min",
        "bootstrapDatetimepicker" : "../../plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min",
        "bootstrapDatepicker" : "../../plugins/bootstrap-datepicker/bootstrap-datepicker.min",
        "bootstrapTimepicker" : "../../plugins/bootstrap-timepicker/bootstrap-timepicker",
        "jqueryqueue" : "../../plugins/jqueryqueue/jQuery.ajaxQueue",
        "fatZoom" : "../../plugins/jquery-fat-zoom.js/js/zoom",
        "bsDropzone" : "../../plugins/bs-dropzone/dist/js/bs-dropzone",
        
        // "bootstrap4" : "../../plugins/bootstrap4/js/bootstrap.bundle.min",
        // "jQueryUI" : "../../plugins/jquery-ui/jquery-ui.min",
        // "highstock" : "../../plugins/highchart/stock/highstock",
        // "exporting" : "../../plugins/highchart/stock/exporting",
        // "treeview" : "../../plugins/treeview",
        // "uiForm" : "../../plugins/ui-form",
        // "sidebar" : "../../plugins/sidebar",
        // "jqueryStep" : "../../plugins/jquery-step/jquery.steps",
        // "bootstrapWizard" : "../../plugins/twitter-bootstrap-wizard/jquery.bootstrap.wizard",
        // "tinymce" : "../../plugins/tinymce/js/tinymce/tinymce.min",
        // "slick" : "../../plugins/slick/slick",
    },
    waitSeconds: 10,
    urlArgs: "bust=" + (new Date()).getTime(),
    shim: {
        "jQuery": {
            exports: "jQuery",
            init: function(){
                console.log('JQuery inited..');
            }
        },
        "jQuerySlim": {
            exports: "jQuery",
            init: function(){
                console.log('JQuery Slim inited..');
            }
        },
        "bootstrap": {
            deps: ["jQuery"],
            exports: "bootstrap",
            init: function(){
                console.log('bootstrap inited..');
            }
        },
        "bootstrap4": {
            deps: ["jQuery"],
            exports: "bootstrap4",
            init: function(){
                console.log('bootstrap4 inited..');
            }
        },
        "datatables": {
            deps: ["jQuery"],
            exports: "datatables",
            init: function(){
                console.log('datatables inited..');
            }
        },
         "datatablesBootstrap": {
            deps: ["jQuery","datatables"],
            exports: "datatablesBootstrap",
            init: function(){
                console.log('datatablesBootstrap inited..');
            }
        },
        "jqvalidate": {
            deps: ["jQuery"],
            exports: "jqvalidate",
            init: function(){
                console.log('jqvalidate inited..');
            }
        },
        "jQueryUI": {
            deps: ["jQuery"],
            exports: "jQueryUI",
            init: function(){
                console.log('jQueryUI inited..');
            }
        },
        "treeview": {
            deps: ["jQuery"],
            exports: "treeview",
            init: function(){
                console.log('treeview inited..');
            }
        },
        "uiForm": {
            deps: ["jQuery"],
            exports: "uiForm",
            init: function(){
                console.log('uiForm inited..');
            }
        },
        "moment": {
            exports: "moment",
            init: function(){
                console.log('moment inited..');
            }
        },
        "bootstrapDatepicker": {
            deps: ["jQuery","bootstrap"],
            exports: "bootstrapDatepicker",
            init: function(){
                console.log('bootstrapDatepicker inited..');
            }
        },
        "bootstrapTimepicker": {
            deps: ["jQuery","bootstrap"],
            exports: "bootstrapTimepicker",
            init: function(){
                console.log('bootstrapTimepicker inited..');
            }
        },
        "sidebar": {
            deps: ["jQuery"],
            exports: "sidebar",
            init: function(){
                console.log('sidebar inited..');
            }
        },
        "bootstrapWizard": {
            deps: ["jQuery"],
            exports: "bootstrapWizard",
            init: function(){
                console.log('bootstrapWizard inited..');
            }
        },
         "jqueryStep": {
            deps: ["jQuery"],
            exports: "jqueryStep",
            init: function(){
                console.log('jqueryStep inited..');
            }
        },
        "highcharts": {
            deps: ["jQuery"],
            exports: "highcharts",
            init: function(){
                console.log('highcharts inited..');
            }
        },
        "highcharts3d": {
            deps: ["jQuery", "highcharts"],
            exports: "highcharts3d",
            init: function(){
                console.log('highcharts3d inited..');
            }
        },
        "select2": {
            deps: ["jQuery"],
            exports: "select2",
            init: function(){
                console.log('select2 inited..');
            }
        },
        "highstock": {
            deps: ["jQuery"],
            exports: "highstock",
            init: function(){
                console.log('highstock inited..');
            }
        },
        "exporting": {
            deps: ["jQuery","highstock"],
            exports: "exporting",
            init: function(){

            }
        },
        "tinymce": {
            exports: "tinymce",
            init: function(){
            }
        },
        "bootstrapDatetimepicker": {
            deps: ["jQuery"],
            exports: "bootstrapDatetimepicker",
            init: function(){
                
            }
        },
        "slick": {
            deps: ["jQuery"],
            exports: "slick",
            init: function(){
                
            }
        },
        "jqueryqueue": {
            deps: ["jQuery"],
            exports: "jqueryqueue",
            init: function(){
                console.log('jqueryqueue inited..');  
            }
        },
        "fullcalendar": {
            deps: ["jQuery"],
            exports: "fullcalendar",
            init: function(){
                
            }
        },
        "toastr": {
            exports: "toastr",
            deps: ["jQuery"],
            init: function () {
                console.log('toastr inited..');
            }
        },
        "html2pdf": {
            exports: "html2pdf",
            deps: ["jQuery"],
            init: function () {
                console.log('html2pdf inited..');
            }
        },
        "Handsontable": {
            exports: "Handsontable",
            deps: ["jQuery"],
            init: function () {
                console.log('Handsontable inited..');
            }
        },
        "fatZoom": {
            exports: "fatZoom",
            deps: ["jQuery"],
            init: function () {
                console.log('fatZoom inited..');
            }
        },
        "bsDropzone": {
            exports: "bsDropzone",
            deps: ["jQuery"],
            init: function () {
                console.log('bsDropzone inited..');
            }
        },
    },
    map: {
        '*': {
            'datatables.net': 'datatables',
            'datatables.net-responsive': 'datatablesResponsive',
            'googlemaps!': 'googlemaps',
            '@tmcw/togeojson': 'togeojson',
            'leafletBoundaryCanvas': 'leafletBoundaryCanvas'
        }
    }
});
