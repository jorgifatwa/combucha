require(["../common" ], function (common) {  
    require(["main-function","../app/app-pencairan"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});