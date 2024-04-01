require(["../common" ], function (common) {  
    require(["main-function","../app/app-set-point"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});