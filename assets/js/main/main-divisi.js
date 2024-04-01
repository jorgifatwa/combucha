require(["../common" ], function (common) {  
    require(["main-function","../app/app-divisi"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});