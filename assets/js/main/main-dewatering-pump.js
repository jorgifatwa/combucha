require(["../common" ], function (common) {  
    require(["main-function","../app/app-dewatering-pump"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});