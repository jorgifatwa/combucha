require(["../common" ], function (common) {  
    require(["main-function","../app/app-situasi-air"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});