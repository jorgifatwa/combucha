require(["../common" ], function (common) {  
    require(["main-function","../app/app-set-joki"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});