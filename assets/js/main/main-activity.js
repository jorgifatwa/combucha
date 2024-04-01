require(["../common" ], function (common) {  
    require(["main-function","../app/app-activity"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});