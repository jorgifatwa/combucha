require(["../common" ], function (common) {  
    require(["main-function","../app/app-breakdown"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});