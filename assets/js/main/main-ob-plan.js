require(["../common" ], function (common) {  
    require(["main-function","../app/app-ob-plan"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});