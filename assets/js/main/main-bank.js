require(["../common" ], function (common) {  
    require(["main-function","../app/app-bank"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});