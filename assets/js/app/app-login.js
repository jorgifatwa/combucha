define([
    "jQuery",
	"bootstrap",
    "jqvalidate",
    "datatables",
	], function (
    $,
	bootstrap,
    jqvalidate,
    datatables,
	) {
    return {  
        init: function () { 
        	App.initFunc();
            App.initEvent(); 
            console.log("loaded");
            $(".loadingpage").hide();
		},
         
        initEvent : function(){  
            $("#btn-login").removeAttr("disabled");
            const togglePassword = document.querySelector('#togglePassword');
            const password = document.querySelector('#inputPassword');
            
            togglePassword.addEventListener('click', function (e) {
                // toggle the type attribute
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                // toggle the eye slash icon
                this.classList.toggle('fa-eye-slash');
            });
            $("#form-login").validate({ 
                rules: {
                    username: {
                        required: true
                    },
                    password: {
                        required: true
                    }
                },
                messages: {
                    username: {
                        required: "Username is Required"
                    },
                    password: {
                        required: "Password is Required"
                    }
                }, 
                debug:true,
                
                errorPlacement: function(error, element) {
                    var name = element.attr('name');
                    var errorSelector = '.form-control-feedback[for="' + name + '"]';
                    var $element = $(errorSelector);
                    if ($element.length) {
                        $(errorSelector).html(error.html());
                    } else {
                        if ( element.prop( "type" ) === "select-one" ) {
                            error.appendTo(element.parent());
                        }else if ( element.prop( "type" ) === "select-multiple" ) {
                            error.appendTo(element.parent());
                        }else if ( element.prop( "type" ) === "checkbox" ) {
                            error.insertBefore( element.next( "label" ) );
                        }else if ( element.prop( "type" ) === "radio" ) {
                            error.insertBefore( element.parent().parent().parent());
                        }else if ( element.parent().attr('class') === "input-group" ) {
                            error.appendTo(element.parent().parent());
                        }else{
                            error.insertAfter(element);
                        }
                    }
                },
                submitHandler : function(form) { 
                    form.submit();
                }
            });
        }
	}
});