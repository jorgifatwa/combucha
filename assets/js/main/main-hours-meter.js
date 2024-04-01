require(["../common" ], function (common) {  
    require(["main-function","../app/app-hours-meter"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});