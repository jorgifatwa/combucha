require(["../common" ], function (common) {  
    require(["main-function","../app/app-ob-actual"], function (func,application) { 
    App = $.extend(application,func);
        App.init();  
    }); 
});