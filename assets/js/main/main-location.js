require(["../common" ], function (common) {  
    require(["main-function","../app/app-location"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});