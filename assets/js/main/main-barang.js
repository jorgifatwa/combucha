require(["../common" ], function (common) {  
    require(["main-function","../app/app-barang"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});