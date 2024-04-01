require(["../common" ], function (common) {  
    require(["main-function","../app/app-fleet-event"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});