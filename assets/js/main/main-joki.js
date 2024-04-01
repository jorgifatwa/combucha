require(["../common" ], function (common) {  
    require(["main-function","../app/app-joki"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});