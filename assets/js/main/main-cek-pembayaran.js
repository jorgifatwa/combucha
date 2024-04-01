require(["../common" ], function (common) {  
    require(["main-function","../app/app-cek-pembayaran"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});