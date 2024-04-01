define([
    "jQuery",
	"bootstrap",
    "jqvalidate",
    "datatables",
    "toastr"
	], function (
    $,
	bootstrap,
    jqvalidate,
    datatables,
    toastr
	) {
    return {  
        init: function () { 
        	App.initFunc();
            App.initEvent(); 
            // console.log("loaded");
            $(".loadingpage").hide();
		},

        initEvent: function (){
            $('#btn-kirim').on('click', function (){
                var email = $('#email').val();
                $.ajax({
                    url : App.baseUrl+"auth/forgot_password",
                    type : "POST",
                    data : {'email' : email},
                    success : function(data) {
                        console.log(data);
                    },
                    error : function(data) {
                    
                    }
                });
            });
        }
         
        
	}
});