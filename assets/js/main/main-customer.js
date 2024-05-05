require(["../common" ], function (common) {  
    require(["main-function","../app/app-customer"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});