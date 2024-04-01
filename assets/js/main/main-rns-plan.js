require(["../common" ], function (common) {  
    require(["main-function","../app/app-rns-plan"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});