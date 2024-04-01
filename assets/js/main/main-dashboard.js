require(["../common" ], function (common) {  
    require(["main-function","../app/app-dashboard2"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});