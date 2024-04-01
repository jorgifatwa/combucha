require(["../common" ], function (common) {  
    require(["main-function","../app/app-hm-location"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});