require(["../common" ], function (common) {  
    require(["main-function","../app/app-password"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});