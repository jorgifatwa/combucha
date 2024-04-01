define([
    "jQuery",
    "bootstrap",
    "datatables",
    "select2",
    "datatablesBootstrap",
    "bootstrapDatepicker",
    "fullcalendar",
    "jqvalidate",
    "toastr",
    ], function (
    $,
    bootstrap,
    datatables,
    select2,
    datatablesBootstrap,
    bootstrapDatepicker,
    fullcalendar,
    jqvalidate,
    toastr
    ) {
    return {
        table:null,
        id_unit: null,
        init: function () {
            App.initFunc();
            App.groupData();
            App.initValidation();
            App.onChangeLocation();
            App.loadData();
            App.initConfirm();
            App.initEvent();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            $('#unit').select2({
                width: "100%",
                placeholder: "Pilih Unit",
            });

            $('#location_id').select2({
                width: "100%",
                placeholder: "Pilih Lokasi",
            });

            $('#location_id_filter').select2({
                width: "100%",
                placeholder: "Pilih Lokasi",
            });

            $('#bulan_input, #bulan').select2({
                width: "100%",
                placeholder: "Pilih Bulan",
            });

            $("#tahun_input, #tahun").datepicker({
                format: "yyyy",
                viewMode: "years", 
                minViewMode: "years",
                autoclose: true
            }); 
        },
        groupData: function(){
            $("#location_id_filter, #bulan, #tahun, #searching").on('change', function() {
                var location_id = $("#location_id_filter").val();
                var bulan = $("#bulan").val();
                var tahun = $("#tahun").val();
                var searching = $("#searching").val();
                if (location_id != "") {
                    $.ajax({
                        url : App.baseUrl+"ob_plan/dataList",
                        type : "POST",
                        data : {
                            location_id : location_id, 
                            bulan : bulan, 
                            tahun: tahun, 
                            searching: searching
                        },
                        success : function(data) {
                            var data = JSON.parse(data);
                            var tanggal_head = "<th>Data Tidak Tersedia</th>";
                            var nilai_body = "";
                            var total_body = "";
                            var total_head = "";
                            
                            var url = App.baseUrl + 'ob_plan/exportExcel';
                            var url_location = "";
                            if(location_id != null && location_id != "" && location_id != null){
                                var url_location = 'location='+location_id+'&';
                            }
                            url += '?'+url_location+'bulan='+bulan+'&tahun='+tahun;
                            $(".btn-export").attr('href', url);

                            if(data.status){
                                var tanggal_head = '<tr>';
                                tanggal_head += '<th style="min-width:150px">Nama Unit</th>';
                                tanggal_head += '<th style="min-width:100px">Total</th>';
                                for (let i = 1; i <= parseInt(data.akhir_bulan); i++) {
                                    tanggal_head += '<th>'+i+'</th>';
                                }
                                tanggal_head += '</tr>';

                                var nilai_body = "";
                                for (let i = 0; i < data.data.length; i++) {
                                    nilai_body += '<tr>';
                                    nilai_body += '<td class="text-left">'+data.data[i].name+'</td>';
                                    nilai_body += '<td class="text-right">'+data.data[i].total+'</td>';
                                    for(let x = 1; x <= data.akhir_bulan; x++){
                                        nilai_body += '<td class="text-right">'+data.data[i].datas[x]+'</td>';
                                    }
                                    nilai_body += '</tr>';
                                }
                                var total_head = '<tr>';
                                total_head += '<th class="text-center">Total OB Plan</th>';
                                total_head += '<th class="text-right">' +App.addCommas(data.data_total["total"].toFixed(2))+'</th>';
                                for(let y = 1; y <= data.akhir_bulan; y++){
                                    total_head += '<th class="text-right">'+App.addCommas(data.data_total[y].toFixed(2))+'</th>';
                                }
                                total_head += '</tr>';
                            }
                            $("#tanggal_head").html(tanggal_head);
                            $("#nilai_body").html(nilai_body);
                            $("#total_head").html(total_head);
                        },
                        error : function(data) {
                            // do something
                        }
                    });
                }
            });
            var check_bulan  = $("#bulan").val();
            var check_tahun  = $("#tahun").val();
            var bulan = new Date().getMonth();
            var tahun = new Date().getFullYear();
            if(check_bulan != "" && check_tahun !=""){
                // console.log(bulan);
                $("#bulan").val(bulan+1);
                $("#tahun").val(tahun);
                $("#bulan, #tahun").trigger('change');
            }
        },
        loadData: function(){
            $(".unit, .tahun_input, .bulan_input").on('change', function() {
                var unit = $('.unit').val();
                var tahun = $('.tahun_input').val();
                var bulan = $('.bulan_input').val();
                if(unit != "" && tahun != "" && bulan != ""){
                    App.id_unit = unit;
                    $.ajax({
                        url : App.baseUrl+"ob_plan/get_data",
                        type : "POST",
                        data : {
                            "tahun" : tahun,
                            "bulan" : bulan,
                            "unit" : unit,
                        },
                        success : function(data) {
                            var data = JSON.parse(data);
                            App.initCalendar(data.tanggal, data.data);
                        },
                        error : function(data) {
                            // do something
                        }
                    });
                }else{
                    $('#calendar').fullCalendar('destroy');
                }
            });
            var check_loading  = $(".loading_unit").val();
            if(check_loading != ""){
                $(".loading_unit").trigger('change');
            }
        },
        initCalendar: function(tanggal, data){
            var tmpt = [];
            $('#calendar').fullCalendar('destroy');
            $('#calendar').val("");

            $('#calendar').fullCalendar({
                //Random default events
                defaultDate: tanggal,
                header: {
                    left:   'title',
                    center: '',
                    right:  ''
                },
                monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
                monthNamesShort: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
                dayNames: ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'],
                dayNamesShort: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
                events    : data,
                editable  : false,
                selectable : false,
                showNonCurrentDates: false,
                droppable : false,
            });
        },
        initValidation: function(){
            if($("#form-create").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form-create").validate({
                    rules: {
                        unit: {
                            required: true
                        },
                        tahun_input: {
                            required: true
                        },
                        bulan_input: {
                            required: true
                        },
                        nilai_input: {
                            required: true
                        },
                    },
                    messages: {
                        unit: {
                            required: "Unit Harus Dipilih"
                        },
                        bulan_input: {
                            required: "Bulan Harus Dipilih"
                        },
                        tahun_input: {
                            required: "Tahun Harus Dipilih"
                        },
                        nilai_input: {
                            required: "Nilai Harus Diisi"
                        },
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
                        $(".alert-ok").removeClass("btn-danger");
                        $(".alert-ok").addClass("btn-primary");
                        App.confirm("Apakah Anda Yakin Menginput Data Ini?",function(){
                            var location_id = $("#location_id").val();
                            var unit = $("#unit").val();
                            var tahun = $("#tahun_input").val();
                            var bulan = $("#bulan_input").val();
                            var nilai = $("#nilai_input").val();
                            $.ajax({
                                url : App.baseUrl + 'ob_plan/input_data',
                                type : "POST",
                                dataType : "json",
                                data : {
                                    "location_id" : location_id, 
                                    "nilai" : nilai, 
                                    "tahun" : tahun, 
                                    "bulan" : bulan, 
                                    "unit": unit
                                },
                                success : function(data) {
                                    if(data.status){
                                        toastr.success("Data Plan Telah Ditambahkan", 'Berhasil', { timeOut: 3000 })
                                    }else{
                                        toastr.error("Data Plan Gagal Ditambahkan", 'Gagal', { timeOut: 3000 })
                                    }
                                    $(".unit").trigger('change');
                                    $("#nilai_input").val("");
                                },
                                error : function(data) {
                                    // do something
                                }
                            });
                        })
                    }
                });
            }
        },
        onChangeLocation: function(){
            $(".location_id").on("change", function(){
                var id = $(this).val();
                $.ajax({
                    url: App.baseUrl+'ob_plan/getUnit',
                    type: 'POST',
                    data: {id: id},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);
                    var option = "<option value=''>Pilih Unit</option>";
                    $('.unit').html(option);

                    if(data.status == true){
                        for (var i = 0; i < data.data.length; i++) {
                            option += "<option value="+data.data[i].id+"> "+data.data[i].kode+" - "+data.data[i].brand_name+" - "+data.data[i].unit_model_name+"</option>";
                        }
                    }
                    $('.unit').html(option);
                    $('.unit').trigger("change");
                })
                .fail(function() {
                    console.log("error");
                });
            });
        },
        initConfirm :function(){
            $('#table tbody').on( 'click', '.delete', function () {
                var url = $(this).attr("url");
                console.log(url);
                App.confirm("Apakah anda yakin untuk mengubah ini?",function(){
                   $.ajax({
                      method: "GET",
                      url: url
                    }).done(function( msg ) {
                        var data = JSON.parse(msg);
                        if (data.status == false) {
                            toastr.error(data.msg);
                        } else {
                            toastr.success(data.msg);
                            App.table.ajax.reload(null, true);
                        }
                    });
                })
            });
        }
	}
});
