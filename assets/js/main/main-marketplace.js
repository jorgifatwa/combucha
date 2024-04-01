require(["../common" ], function (common) {  
    require(["main-function","../app/app-marketplace"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});