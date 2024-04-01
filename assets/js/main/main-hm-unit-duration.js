require(["../common" ], function (common) {  
    require(["main-function","../app/app-hm-unit-duration"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});