require(["../common" ], function (common) {  
    require(["main-function","../app/app-loading-unit"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});