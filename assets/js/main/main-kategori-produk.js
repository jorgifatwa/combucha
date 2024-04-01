require(["../common" ], function (common) {  
    require(["main-function","../app/app-kategori-produk"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});