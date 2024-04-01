require(["../common" ], function (common) {  
    require(["main-function","../app/app-history-pekerjaan"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});