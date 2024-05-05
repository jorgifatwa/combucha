require(["../common" ], function (common) {  
    require(["main-function","../app/app-pesanan-data"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});