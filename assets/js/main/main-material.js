require(["../common" ], function (common) {  
    require(["main-function","../app/app-material"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});