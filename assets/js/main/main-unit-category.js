require(["../common" ], function (common) {  
    require(["main-function","../app/app-unit-category"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});