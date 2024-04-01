require(["../common" ], function (common) {  
    require(["main-function","../app/app-coal-actual"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});