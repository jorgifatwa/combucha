require(["../common" ], function (common) {  
    require(["main-function","../app/app-hauling-unit"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});