require(["../common" ], function (common) {  
    require(["main-function","../app/app-fuel-consumtion"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});