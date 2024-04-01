require(["../common" ], function (common) {  
    require(["main-function","../app/app-gudang"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});