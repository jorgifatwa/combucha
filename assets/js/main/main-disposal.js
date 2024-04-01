require(["../common" ], function (common) {  
    require(["main-function","../app/app-disposal"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});