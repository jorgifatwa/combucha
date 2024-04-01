define([
    'jQuery',
    'toastr'
], 
function (
    $,
    toastr
) {
    return {
        clickEvent               : "click",
        loading                  : $("#loading"),
        baseUrl                  : document.getElementById("base_url").value,
        cloudUrl                  : document.getElementById("cloud_url").value,
        initFunc    : function () {
            App.initValidationForm();
            App.initToast();
            App.validInput();
        },
        
        initValidationForm :function(){
            $('.number').keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                     // Allow: Ctrl+A, Command+A
                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                     // Allow: home, end, left, right, down, up
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                         // let it happen, don't do anything
                         return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        },
        alert       : function(msg, callback){
            $("#alert_modal .modal-title").text("");
            // if (title != undefined && title != false && title != "") {
            //     $("#alert_modal .modal-title").text(title);
            // }
            $(".alert-msg").text(msg);
            $(".alert-cancel").hide();
            $(".alert-ok").show();

            $('#alert_modal').modal('show');

            $("#alert_modal .alert-ok").bind(App.clickEvent, function (e) {
                if (callback != undefined && callback != null && callback != false) {
                    callback();
                }

                setTimeout(function() {
                    $("#alert_modal").modal("hide");
                }, 200);

                e.preventDefault();
                $(this).unbind();
            });
        },
        confirm       : function(msg, callbackOk, callbackCancel){
            $("#alert_modal .modal-title").text("");
            // if (title != undefined && title != false && title != "") {
            //     $("#alert_modal .modal-title").text(title);
            // }

            $(".alert-msg").text(msg);
            $(".alert-cancel").removeClass("d-none");
            $(".alert-ok").removeClass("d-none");

            $('#alert_modal').modal('show');
            $("#alert_modal .alert-ok").bind(App.clickEvent, function (e) {
                if (callbackOk != undefined && callbackOk != null && callbackOk != false) {
                    callbackOk();
                }
                setTimeout(function() {
                    $("#alert_modal").modal("hide");
                }, 200);

                e.preventDefault();
                $(this).unbind();
                $("#alert_modal .alert-cancel").unbind();
            });

            $("#alert_modal .alert-cancel").bind(App.clickEvent, function (e) {
                if (callbackCancel != undefined && callbackCancel != null && callbackCancel != false) {
                    callbackCancel();
                }
                setTimeout(function() {
                    $("#alert_modal").modal("hide");
                }, 200);

                e.preventDefault();
                $(this).unbind();
                $("#alert_modal .alert-ok").unbind();
            });
        },
        approval       : function(msg, callbackOk, callbackCancel){
            $("#alert_approval .modal-title").text("");

            $(".alert-msg").text(msg);
            $(".alert-cancel").show();
            $(".alert-reject").show();
            $(".alert-approve").show();

            $('#alert_approval').modal('show');
            $("#alert_approval .alert-cancel").bind(App.clickEvent, function (e) {
                setTimeout(function() {
                    $("#alert_approval").modal("hide");
                }, 200);

                e.preventDefault();
                $(this).unbind();
                $("#alert_approval .alert-approve").unbind();
            });
            $("#alert_approval .alert-approve").bind(App.clickEvent, function (e) {
                if (callbackOk != undefined && callbackOk != null && callbackOk != false) {
                    callbackOk();
                }
                setTimeout(function() {
                    $("#alert_approval").modal("hide");
                }, 200);

                e.preventDefault();
                $(this).unbind();
                $("#alert_approval .alert-cancel").unbind();
            });

            $("#alert_approval .alert-reject").bind(App.clickEvent, function (e) {
                if (callbackCancel != undefined && callbackCancel != null && callbackCancel != false) {
                    callbackCancel();
                }
                setTimeout(function() {
                    $("#alert_approval").modal("hide");
                }, 200);

                e.preventDefault();
                $(this).unbind();
                $("#alert_approval .alert-ok").unbind();
            });
        },
        format : function(obj){

            var restoreMoneyValueFloat = function(obj)
            {
                var r = obj.value.replace(/\./g, '');
            	r = r.replace(/,/, '#');
            	r = r.replace(/,/g, '');
            	r = r.replace(/#/, '.');
            	return r;
            }

            var getDecimalSeparator = function ()
            {
            	var f = parseFloat(1/4);
            	var n = new Number(f);
    	        var r = new RegExp(',');
            	if (r.test(n.toLocaleString())) return ',';
    	        else return '.';
            }

            if (obj.value == '-') return;

          	var val = restoreMoneyValueFloat(obj);

          	var myreg		= /\.([0-9]*)$/;
          	var adakoma = myreg.test(val);
          	var lastkoma= adakoma ? (RegExp.$1=='') : false;

          	myreg = /\.(0+)$/;
          	var lastnol = adakoma && myreg.test(val);

          	myreg = /(0+)$/;
          	var tailnol = adakoma && myreg.test(val);
          	var adanol	 = tailnol ? RegExp.$1 : '';

          	var n   = parseFloat(val);

          	n = isNaN(n) ? 0 : n;
          	//if (entryFormatMoney.arguments[1] && n > entryFormatMoney.arguments[1]) n = entryFormatMoney.arguments[1];
          	var n = new Number(n);
          	var r = n.toLocaleString();


          	if (getDecimalSeparator()=='.')
          	{
          		r = r.replace(/\./g, '#');
          		r = r.replace(/,/g, '.');
          		r = r.replace(/#/g, ',');
          	}


          	myreg = /([0-9\.]*)(,?[0-9]{0,4})/;
          	if (myreg.test(r)) { r = RegExp.$1 + RegExp.$2; }

          	obj.value = r + (lastkoma || lastnol ? ',' : '') + (tailnol ? adanol : '');
        },
        validInput : function(){
            $(".text-only").keyup(function(e) {
                var regex = /^[a-zA-Z X]+$/;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/[^a-zA-Z X]+/, '');
                }
            });
            $(".number-only").keyup(function(e) {
                var regex = /^[0-9 X]+$/;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/[^0-9 X]+/, '');
                }
            });
            $(".text-nospace").keyup(function(e) {
                var regex = /^[a-zA-Z]+$/;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/[^a-zA-Z]+/, '');
                }
            });
            $(".number-nospace").keyup(function(e) {
                var regex = /^[0-9]+$/;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/[^0-9]+/, '');
                }
            });
            $(".textnumber").keyup(function(e) {
                var regex = /^[a-zA-Z0-9 X]+$/;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/[^a-zA-Z0-9 X]+/, '');
                }
            });
            $(".textnumber-nospace").keyup(function(e) {
                var regex = /^[a-zA-Z0-9]+$/;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/[^a-zA-Z0-9]+/, '');
                }
            });
            $(".textsymbol").keyup(function(e) {
                var regex = /^[a-zA-Z(&).,:\-/ X]+$/;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/[^a-zA-Z(&).,:\-/ X]+/, '');
                }
            });
            $(".textnumbersymbol").keyup(function(e) {
                var regex = /^[a-zA-Z0-9(&).,:\-/ X]+$/;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/[^a-zA-Z0-9(&).,:\-/ X]+/, '');
                }
            });
            $(".numbersymbol").keyup(function(e) {
                var regex = /^[0-9(&).,:\-/ X]+$/;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/[^0-9(&).,:\-/ X]+/, '');
                }
            });
            $(".procentage").keyup(function(e) {
                var regex = /(^100([.]0{1,2})?)$|(^\d{1,2}([.]\d{1,2})?)$/i;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/(^100([.]0{1,2})?)$|(^\d{1,2}([.]\d{1,2})?)$/i, '');
                }
            });
            $(".basic-url").keyup(function(e) {
                var regex = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
                if (regex.test(this.value) !== true) {
                    this.value = this.value.replace(/^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i, '');
                }
            });

            $(".currency").on("keyup", function(){
                value = $(this).val().replace(/,/g, '');
                if (!$.isNumeric(value) || value == NaN) {
                    $(this).val('0').trigger('change');
                    value = 0;
                }
                $(this).val(parseFloat(value, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            });
        },
        // fungsi untuk mengembalikan nilai 122.311.312 tanpa tanda titik sebelum submit form.
        noFormattedNumber : function(element)
        {
            if(Array.isArray(element))
            {
                $.each(element, function(index,value){
                    this.noFormattedNumber(value)
                });
            }

            var val;
            function restoreMoneyValueFloatFromStr(str)
            {
                // fungsi ini utk mengembalikan string dari format money standar ke nilai float
                // nilai float dengan saparator decimal titik biar php/javascript bisa parsing
                var rr = new String(str);
                var r = rr.replace(/ /g, '');
                r = r.replace(/\./g, '');
                r = r.replace(/,/, '#');
                r = r.replace(/,/g, '');
                r = r.replace(/#/, '.');
                return r;
            }
            val = restoreMoneyValueFloatFromStr($(element).val());
            $(element).val(val);
        },
        initToast : function(){
            toastr.options.preventDuplicates = true;
            toastr.options.timeOut = 1000;
            toastr.options.positionClass = 'toast-top-right';
            
            if ($('#display_alert_message').val() != undefined) {
                toastr.options.timeOut = 3000;
                toastr.success($('#display_alert_message').val());
            }
            if ($('#display_alert_message_error').val() != undefined) {
                toastr.options.timeOut = 3000;
                toastr.error($('#display_alert_message_error').val());
            }
            if ($('#display_alert_validation_errors').val() != undefined) {
                toastr.options.timeOut = 3000;
                toastr.error($('#display_alert_validation_errors').val());
            }
            if ($('#display_alert_message_get_true').val() != undefined) {
                toastr.options.timeOut = 3000;
                toastr.success($('#display_alert_message_get_true').val());
            }
            if ($('#display_alert_message_get_false').val() != undefined) {
                toastr.options.timeOut = 3000;
                toastr.error($('#display_alert_message_get_false').val());
            }
        },
        addCommas : function(nStr){
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return (x1 + x2);
        }
    }
});
