require(["../common" ], function (common) {  
    require(["main-function","../app/app-user-shift"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});