require(["../common" ], function (common) {  
    require(["main-function","../app/app-retur"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});