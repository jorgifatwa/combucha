require(["../common" ], function (common) {  
    require(["main-function","../app/app-fuel-plan"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});