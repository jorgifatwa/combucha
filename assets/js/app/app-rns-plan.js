define([
    "bootstrap",
    "jQuery",
    "moment",
    "datatables",
    "bootstrapDatepicker",
    "datatablesBootstrap",
    "jqvalidate",
    "fullcalendar",
    "select2",
    "toastr",
    ], function (
    $,
    bootstrap,
    moment,
    bootstrapDatepicker,
    datatables,
    fullcalendar,
    datatablesBootstrap,
    jqvalidate,
    select2,
    toastr,
    ) {
    return {
        table:null,
        id_loading: null,
        dataLoading: null,
        init: function () {
            App.initFunc();
            App.initEvent();
            App.initConfirm();
            App.loadData();
            App.groupData();
            App.initValidation();
            $(".loadingpage").hide();
        },
        initEvent: function(){
            $('#location_id').select2({
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
            $("#bulan, #tahun, #searching").on('change', function() {
                var bulan = $("#bulan").val();
                var tahun = $("#tahun").val();
                var searching = $("#searching").val();
                $.ajax({
                    url : App.baseUrl+"rns_plan/dataList",
                    type : "POST",
                    data : {bulan : bulan, tahun: tahun, searching: searching},
                    success : function(data) {
                        var data = JSON.parse(data);
                        
                        var tanggal_head = "";
                        var nilai_body = "";
                        var total_body = "";
                        var total_head = "";
                        var tanggal_head_rainfall = "";
                        var nilai_body_rainfall = "";
                        var total_body_rainfall = "";
                        var total_head_rainfall = "";
                        
                        if(data.status){
                            var url = App.baseUrl + 'plan/exportExcel';
                            url += '?bulan='+bulan+'&tahun='+tahun;
                            $(".btn-export").attr('href', url);
                            var tanggal_head = '<tr>';
                            tanggal_head += '<th style="min-width:150px">Nama Lokasi</th>';
                            tanggal_head += '<th style="min-width:100px">Total</th>';
                            for (let i = 1; i <= parseInt(data.akhir_bulan); i++) {
                                tanggal_head += '<th>'+i+'</th>';
                            }
                            tanggal_head += '</tr>';

                            var nilai_body = "";
                            for (let i = 0; i < data.data.length; i++) {
                                nilai_body += '<tr>';
                                nilai_body += '<td class="text-center">'+data.data[i].name+'</td>';
                                nilai_body += '<td class="text-center">'+data.data[i].total_rns+'</td>';
                                for(let x = 0; x < data.data[i].data_date_rns.length; x++){
                                    nilai_body += '<td class="text-center">'+data.data[i].data_date_rns[x]+'</td>';
                                }
                                nilai_body += '</tr>';
                            }
                            var total_body = '<tr>';
                            total_body += '<td class="text-center">Total RNS</td>';
                            total_body += '<td class="text-center">' +data.data_total[0].total_rns+'</td>';
                            for(let y = 0; y < data.data_total[0].data_date_rns.length; y++){
                                total_body += '<td class="text-center">'+data.data_total[0].data_date_rns[y]+'</td>';
                            }
                            total_body += '</tr>';

                            // data rainfall
                            var tanggal_head_rainfall = '<tr>';
                            tanggal_head_rainfall += '<th style="min-width:150px">Nama Lokasi</th>';
                            tanggal_head_rainfall += '<th style="min-width:100px">Total</th>';
                            for (let i = 1; i <= parseInt(data.akhir_bulan); i++) {
                                tanggal_head_rainfall += '<th>'+i+'</th>';
                            }
                            tanggal_head_rainfall += '</tr>';

                            var nilai_body_rainfall = "";
                            for (let i = 0; i < data.data.length; i++) {
                                nilai_body_rainfall += '<tr>';
                                nilai_body_rainfall += '<td class="text-center">'+data.data[i].name+'</td>';
                                nilai_body_rainfall += '<td class="text-center">'+data.data[i].total_rainfall+'</td>';
                                for(let x = 0; x < data.data[i].data_date_rainfall.length; x++){
                                    nilai_body_rainfall += '<td class="text-center">'+data.data[i].data_date_rainfall[x]+'</td>';
                                }
                                nilai_body_rainfall += '</tr>';
                            }
                            var total_body_rainfall = '<tr>';
                            total_body_rainfall += '<td class="text-center">Total Rainfall</td>';
                            total_body_rainfall += '<td class="text-center">' +data.data_total[0].total_rainfall+'</td>';
                            for(let y = 0; y < data.data_total[0].data_date_rainfall.length; y++){
                                total_body_rainfall += '<td class="text-center">'+data.data_total[0].data_date_rainfall[y]+'</td>';
                            }
                            total_body_rainfall += '</tr>';
                        }
                        $("#tanggal_head").html(tanggal_head);
                        $("#nilai_body").html(nilai_body);
                        $("#total_body").html(total_body);
                        $("#total_head").html(total_head);

                        $("#tanggal_head_rainfall").html(tanggal_head_rainfall);
                        $("#nilai_body_rainfall").html(nilai_body_rainfall);
                        $("#total_body_rainfall").html(total_body_rainfall);
                        $("#total_head_rainfall").html(total_head_rainfall);
                        console.log(data);
                    },
                    error : function(data) {
                        // do something
                    }
                });
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
            $(".location_id, .tahun_input, .bulan_input").on('change', function() {
                var location_id = $('.location_id').val();
                var tahun = $('.tahun_input').val();
                var bulan = $('.bulan_input').val();
                if(location_id != "" && tahun != "" && bulan != ""){
                    App.id_loading = location_id;
                    $.ajax({
                        url : App.baseUrl+"rns_plan/get_data",
                        type : "POST",
                        data : {
                            "tahun" : tahun,
                            "bulan" : bulan,
                            "location_id" : location_id,
                        },
                        success : function(data) {
                            var data = JSON.parse(data);
                            App.initCalendar(data.tanggal, data.data);
                            var countDay = ($('td.fc-past').length+$('td.fc-today').length+$('td.fc-future').length)/2;
                            console.log(countDay)
                        },
                        error : function(data) {
                            // do something
                        }
                    });
                }
            });
            var check_loading  = $(".location_id").val();
            if(check_loading != ""){
                $(".location_id").trigger('change');
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
                selectable : true,
                showNonCurrentDates: false,
                droppable : false,
                select: function(info) {
                    var date_click = moment.utc(info._d).toDate();
                    date_click = moment(date_click).format('DD-MM-YYYY');
                    
                    var location_id = $("#location_id").val();
                    $('#location_id_edit').val(location_id);

                    $('#tanggal_edit').val("");
                    $('#rns_edit').val("");
                    $('#rainfall_edit').val("");
                    $.ajax({
                        url : App.baseUrl+"rns_plan/cek_data",
                        type : "POST",
                        data : {
                            "tanggal" : date_click,
                            "location_id" : location_id
                        },
                        success : function(data) {
                            var data = JSON.parse(data);
                            if(data.status){
                                $("#rns_edit").val(data.data.rns);
                                $("#rainfall_edit").val(data.data.rainfall);
                                $('#tanggal_edit').val(date_click);
                                $('#modalEditPlan').modal('show');
                            }
                        },
                        error : function(data) {
                            console.log($('td.fc-day').length)
                        }
                    });
                        
                },
            });
        },
        initValidation: function(){
            if($("#form-create").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form-create").validate({
                    rules: {
                        location_id: {
                            required: true
                        },
                        tahun_input: {
                            required: true
                        },
                        bulan_input: {
                            required: true
                        },
                        rns_input: {
                            required: true
                        },
                        rainfall_input: {
                            required: true
                        },
                    },
                    messages: {
                        location_id: {
                            required: "Lokasi Harus Dipilih"
                        },
                        bulan_input: {
                            required: "Bulan Harus Dipilih"
                        },
                        tahun_input: {
                            required: "Tahun Harus Dipilih"
                        },
                        rns_input: {
                            required: "RNS Harus Diisi"
                        },
                        rainfall_input: {
                            required: "Rainfall Harus Diisi"
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
                        $(".alert-ok").removeClass("btn-danger").addClass("btn-primary");
                        
                        App.confirm("Apakah Anda Yakin Menginput Data Ini?",function(){
                            var location_id = $("#location_id").val();
                            var tahun    = $("#tahun_input").val();
                            var bulan    = $("#bulan_input").val();
                            var rns      = $("#rns_input").val();
                            var rainfall = $("#rainfall_input").val();

                            $.ajax({
                                url : App.baseUrl + 'rns_plan/input_data',
                                type : "POST",
                                dataType : "json",
                                data : {
                                    "rns" : rns, 
                                    "rainfall" : rainfall, 
                                    "tahun" : tahun, 
                                    "bulan" : bulan, 
                                    "location_id": location_id
                                },
                                success : function(data) {
                                    if(data.status){
                                        toastr.success("Data Plan Telah Ditambahkan", 'Berhasil', { timeOut: 3000 })
                                    }else{
                                        toastr.error("Data Plan Gagal Ditambahkan", 'Gagal', { timeOut: 3000 })
                                    }
                                    $(".location_id").trigger('change');
                                    $("#rns_input").val("");
                                    $("#rainfall_input").val("");
                                },
                                error : function(data) {
                                    // do something
                                }
                            });
                        })
                    }
                });
            }

            if($("#form-edit").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form-edit").validate({
                    rules: {
                        location_id_edit: {
                            required: true
                        },
                        tanggal_edit: {
                            required: true
                        },
                        rns_edit: {
                            required: true
                        },
                        rainfall_edit: {
                            required: true
                        },
                    },
                    messages: {
                        location_id_edit: {
                            required: "Lokasi Harus Dipilih"
                        },
                        tanggal_edit: {
                            required: "Tanggal Harus Diisi"
                        },
                        rns_edit: {
                            required: "RNS Harus Diisi"
                        },
                        rainfall_edit: {
                            required: "Rainfall Harus Diisi"
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
                        $(".alert-ok").removeClass("btn-danger").addClass("btn-primary");
                        App.confirm("Apakah Anda Yakin Menginput Data Ini?",function(){
                            console.log("tes tes")
                            var location_id = $("#location_id_edit").val();
                            var tanggal     = $("#tanggal_edit").val();
                            var rns         = $("#rns_edit").val();
                            var rainfall    = $("#rainfall_edit").val();

                            $.ajax({
                                url : App.baseUrl + 'rns_plan/edit_data',
                                type : "POST",
                                dataType : "json",
                                data : {
                                    "rns" : rns, 
                                    "rainfall" : rainfall, 
                                    "tanggal" : tanggal, 
                                    "location_id": location_id
                                },
                                success : function(data) {
                                    if(data.status){
                                        toastr.success("Data Plan Telah Diubah", 'Berhasil', { timeOut: 3000 })
                                    }else{
                                        toastr.error("Data Plan Gagal Diubah", 'Gagal', { timeOut: 3000 })
                                    }
                                    $('#modalEditPlan').modal('hide');
                                    $(".location_id").trigger('change');

                                    $("#location_id_edit").val("");
                                    $("#tanggal_edit").val("");
                                    $("#rns_edit").val("");
                                    $("#rainfall_edit").val("");
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
        initConfirm :function(){
            $('#table tbody').on( 'click', '.delete', function () {
                var url = $(this).attr("url");
                App.confirm("Apakah anda yakin untuk mengubah ini?",function(){
                   $.ajax({
                      method: "GET",
                      url: url
                    }).done(function( msg ) {
                        App.table.ajax.reload(null,true);
                    });
                })
            });
        }
	}
});
