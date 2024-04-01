require(["../common" ], function (common) {  
    require(["main-function","../app/app-hauler-model"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});