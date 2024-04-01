require(["../common" ], function (common) {  
    require(["main-function","../app/app-seam"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});