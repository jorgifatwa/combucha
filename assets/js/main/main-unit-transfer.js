require(["../common" ], function (common) {  
    require(["main-function","../app/app-unit-transfer"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});