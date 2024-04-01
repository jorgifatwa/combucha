define([
    "jQuery",
    "datatables",
    "moment",
    "bootstrap",
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
                    url : App.baseUrl+"situasi_air_plan/dataList",
                    type : "POST",
                    data : {bulan : bulan, tahun: tahun, searching: searching},
                    success : function(data) {
                        var data = JSON.parse(data);
                        
                        var tanggal_head = "";
                        var nilai_body = "";
                        var total_body = "";
                        
                        if(data.status){
                            console.log(data)
                            var url = App.baseUrl + 'plan/exportExcel';
                            url += '?bulan='+bulan+'&tahun='+tahun;
                            $(".btn-export").attr('href', url);
                            var tanggal_head = '<tr>';
                            tanggal_head += '<th style="min-width:150px">Nama Lokasi</th>';
                            tanggal_head += '<th style="min-width:100px">Rata - rata<br>Elevasi (mdpl)</th>';
                            for (let i = 1; i <= parseInt(data.akhir_bulan); i++) {
                                tanggal_head += '<th>'+i+'</th>';
                            }
                            tanggal_head += '</tr>';

                            var nilai_body = "";
                            for (let i = 0; i < data.data.length; i++) {
                                nilai_body += '<tr>';
                                nilai_body += '<td class="text-center">'+data.data[i].name+'</td>';
                                nilai_body += '<td class="text-center">'+data.data[i].total+'</td>';
                                for(let x = 0; x < data.data[i].data_date.length; x++){
                                    nilai_body += '<td class="text-center">'+data.data[i].data_date[x]+'</td>';
                                }
                                nilai_body += '</tr>';
                            }
                        }
                        $("#tanggal_head").html(tanggal_head);
                        $("#nilai_body").html(nilai_body);
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
                        url : App.baseUrl+"situasi_air_plan/get_data",
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
                    $('#nilai_input_edit').val("");
                    $.ajax({
                        url : App.baseUrl+"situasi_air_plan/cek_data",
                        type : "POST",
                        data : {
                            "tanggal" : date_click,
                            "location_id" : location_id
                        },
                        success : function(data) {
                            var data = JSON.parse(data);
                            if(data.status){
                                $("#nilai_input_edit").val(data.data.nilai);
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
                        nilai_input: {
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
                        nilai_input: {
                            required: "Nilai Elevasi Harus Diisi"
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
                        
                        App.confirm("Apakah anda yakin untuk menginput data ini?",function(){
                            var location_id = $("#location_id").val();
                            var tahun    = $("#tahun_input").val();
                            var bulan    = $("#bulan_input").val();
                            var nilai      = $("#nilai_input").val();

                            $.ajax({
                                url : App.baseUrl + 'situasi_air_plan/input_data',
                                type : "POST",
                                dataType : "json",
                                data : {
                                    "nilai" : nilai, 
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
                        nilai_input_edit: {
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
                        nilai_input_edit: {
                            required: "Nilai Elevasi Harus Diisi"
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
                        App.confirm("Apakah anda yakin untuk mengubah ini?",function(){
                            console.log("tes tes")
                            var location_id = $("#location_id_edit").val();
                            var tanggal     = $("#tanggal_edit").val();
                            var nilai         = $("#nilai_input_edit").val();

                            $.ajax({
                                url : App.baseUrl + 'situasi_air_plan/edit_data',
                                type : "POST",
                                dataType : "json",
                                data : {
                                    "nilai" : nilai, 
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
                                    $("#nilai_input_edit").val("");
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
