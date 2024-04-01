define([
    "jQuery",
    "bootstrap",
], function (
    $,
    bootstrap,
    ) {
        return {
            init: function () {
                App.initFunc();
                App.initEvent();
                console.log("loaded");
                $(".loadingpage").hide();
            },

            initEvent: function () {
            }
        }
    });
