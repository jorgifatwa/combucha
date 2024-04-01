require(["../common" ], function (common) {  
    require(["main-function","../app/app-set-bintang"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});