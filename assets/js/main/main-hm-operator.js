require(["../common" ], function (common) {  
    require(["main-function","../app/app-hm-operator"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});