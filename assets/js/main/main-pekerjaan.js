require(["../common" ], function (common) {  
    require(["main-function","../app/app-pekerjaan"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});