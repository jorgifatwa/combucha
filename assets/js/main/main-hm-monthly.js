require(["../common" ], function (common) {  
    require(["main-function","../app/app-hm-monthly"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});