require(["../common" ], function (common) {  
    require(["main-function","../app/app-rns-actual"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});