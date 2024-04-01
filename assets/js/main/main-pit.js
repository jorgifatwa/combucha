require(["../common" ], function (common) {  
    require(["main-function","../app/app-pit"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});