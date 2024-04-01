require(["../common" ], function (common) {  
    require(["main-function","../app/app-history-pencairan"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});