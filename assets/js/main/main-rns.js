require(["../common" ], function (common) {  
    require(["main-function","../app/app-rns"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});