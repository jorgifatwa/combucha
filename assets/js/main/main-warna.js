require(["../common" ], function (common) {  
    require(["main-function","../app/app-warna"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});