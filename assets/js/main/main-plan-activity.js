require(["../common" ], function (common) {  
    require(["main-function","../app/app-plan-activity"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});