require(["../common" ], function (common) {  
    require(["main-function","../app/app-pengeluaran-karyawan"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});