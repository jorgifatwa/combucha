define([
    "jQuery",
    "bootstrap",
    "datatables",
    "select2",
    "datatablesBootstrap",
    "bootstrapDatetimepicker",
    "jqvalidate",
    "toastr"
    ], function (
    $,
    bootstrap,
    datatables,
    select2,
    datatablesBootstrap,
    bootstrapDatetimepicker,
    jqvalidate,
    toastr
    ) {
    return {
        table:null,
        start_time: null,
        end_time: null,
        diff_time: null,
        init: function () {
            App.initFunc();
            App.initEvent();
            App.initConfirm();
            App.changeTime();
            App.getDataFleetReason();
            App.onChangeLocation();
            App.searchTable();
            App.resetSearch();
            $(".loadingpage").hide();
        },
        onChangeLocation: function (){
            $('#location_id').on('change', function (){
                var id = $(this).val();
                $.ajax({
                    url: App.baseUrl+'fleet_event/getUnit',
                    type: 'POST',
                    data: {id: id},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);
                    var option = "<option value=''>Pilih Unit</option>";
                    $('#loading_unit_id').html(option);

                    if(data.status == true){
                        for (var i = 0; i < data.data.length; i++) {
                            if(App.selected_unit == data.data[i].id){
                                option += "<option value="+data.data[i].id+"> "+data.data[i].kode+" - "+data.data[i].brand_name+" - "+data.data[i].unit_model_name+"</option>";
                            }else{
                                option += "<option value="+data.data[i].id+"> "+data.data[i].kode+" - "+data.data[i].brand_name+" - "+data.data[i].unit_model_name+"</option>";
                            }
                        }
                    }
                    $('#loading_unit_id').html(option);
                })
                .fail(function() {
                    console.log("error");
                });
            });
        },
        searchTable: function(){
            $('#btn-filter').on('click', function () {
                var loading_unit_id = $("#loading_unit_id").val();
                var fleet_status_id = $("#fleet_status_id").val();
                var fleet_reason_id = $("#fleet_reason_id").val();
                var tanggal_mulai = $("#tanggal_mulai").val();
                var tanggal_akhir = $("#tanggal_akhir").val();

                App.table.column(1).search(loading_unit_id,true,true);
                App.table.column(3).search(fleet_status_id,true,true);
                App.table.column(4).search(fleet_reason_id,true,true);
                App.table.column(5).search(tanggal_mulai,true,true);
                App.table.column(6).search(tanggal_akhir,true,true);

                App.table.draw();

                App.loading_unit_id = $('#loading_unit_id').val();
                App.fleet_status_id = $('#fleet_status_id').val();
                App.fleet_reason_id = $('#fleet_reason_id').val();
                App.tanggal_mulai = $('#tanggal_mulai').val();
                App.tanggal_akhir = $('#tanggal_akhir').val();
            });
        },
        resetSearch:function(){
            $('#reset').on( 'click', function () {
                $("#loading_unit_id").val("").trigger("change");
                $("#fleet_status_id").val("").trigger("change");
                $("#fleet_reason_id").val("").trigger("change");
                $("#tanggal_mulai").val("").trigger("change");
                $("#tanggal_akhir").val("").trigger("change");

                App.table.search( '' ).columns().search( '' ).draw();
            });
        },
        changeTime : function(){
            $('#start_time').on('dp.change', function(e){ 
                App.start_time = new Date(e.date._d);
                if (App.end_time == null) {
                    App.diff_time = 0;
                } else {
                    App.diff_time = (App.end_time - App.start_time) / 1000 / 60 / 60;
                }
                $('#duration').val(App.diff_time.toFixed(2));
            })

            $('#end_time').on('dp.change', function (e){
                App.end_time = new Date(e.date._d);
                if (App.start_time == null) {
                    App.diff_time = 0;
                } else {
                    App.diff_time = (App.end_time - App.start_time) / 1000 / 60 / 60;
                }
                $('#duration').val(App.diff_time.toFixed(2));
            });
        },
        getDataFleetReason : function(){
            $("#fleet_status_id").on('change', function (){
                id = $(this).val();
                $.ajax({
                    url : App.baseUrl+"fleet_event/get_data_fleet_reason",
                    type : "POST",
                    data : {"id" : id},
                    success : function(data) {
                        var data = JSON.parse(data);
                        var option_fleet_reason = "<option selected hidden disabled>Pilih Alasan</option>";
                        $('#fleet_reason_id').html(option_fleet_reason);
                        var fleet_selected = $('#flet_reason_id_selected').val();
                        if(data.status == true){
                            for (var i = 0; i < data.data.length; i++) {
                                if(fleet_selected == data.data[i].id){
                                    option_fleet_reason += "<option value="+data.data[i].id+" selected> "+data.data[i].name+"</option>";
                                }else{
                                    option_fleet_reason += "<option value="+data.data[i].id+"> "+data.data[i].name+"</option>";
                                }
                            
                            }

                        }
                        $('#fleet_reason_id').html(option_fleet_reason);
                    },
                    error : function(data) {
                    }
                });
            });

            var check_fleet_status = $("#fleet_status_id").val();
            if(check_fleet_status != ""){
                $("#fleet_status_id").trigger('change');
            }
        },
        initEvent : function(){
            $('#tanggal').datetimepicker({
                format: 'DD-MM-YYYY'
            });
            $('#tanggal_mulai').datetimepicker({
                format: 'DD-MM-YYYY'
            });
            $('#tanggal_akhir').datetimepicker({
                format: 'DD-MM-YYYY'
            });
            $('#start_time').datetimepicker({
                format: 'HH:mm'
            });
            $('#end_time').datetimepicker({
                format: 'HH:mm'
            });
            $('#kategori').select2({
                width: "100%",
                placeholder: "Pilih Kategori",
            });
            $('#shift').select2({
                width: "100%",
                placeholder: "Pilih Shift",
            });
            $('#loading_unit_id').select2({
                width: "100%",
                placeholder: "Pilih Loading Unit",
            });
            $('#location_id').select2({
                width: "100%",
                placeholder: "Pilih Site",
            });
            $('#loading_model_id').select2({
                width: "100%",
                placeholder: "Pilih Loading Model",
            });
            $('#fleet_reason_id').select2({
                width: "100%",
                placeholder: "Pilih Fleet Reason",
            });
            $('#fleet_status_id').select2({
                width: "100%",
                placeholder: "Pilih Fleet Status",
            });
            App.table = $('#table').DataTable({
                "language": {
                    "search": "Cari",
                    "lengthMenu": "Tampilkan _MENU_ baris per halaman",
                    "zeroRecords": "Data tidak ditemukan",
                    "info": "Menampilkan _PAGE_ dari _PAGES_",
                    "infoEmpty": "Tidak ada data yang ditampilkan ",
                    "infoFiltered": "(pencarian dari _MAX_ total records)",
                    "paginate": {
                        "first":      "Pertama",
                        "last":       "Terakhir",
                        "next":       "Selanjutnya",
                        "previous":   "Sebelum"
                    },
                },
                "processing": true,
                "serverSide": true,
                "ajax":{
                    "url": App.baseUrl+"fleet_event/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "shift" },
                    { "data": "kategori" },
                    { "data": "loading_unit_name" },
                    { "data": "start_time" },
                    { "data": "end_time" },
                    { "data": "duration" },
                    { "data": "fleet_status_name" },
                    { "data": "fleet_reason_name" },
                    { "data": "action" ,"orderable": false}
                ]
            });


            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        tanggal: {
                            required: true
                        },
                        shift: {
                            required: true
                        },
                        kategori: {
                            required: true
                        },
                        loading_unit_id: {
                            required: true
                        },
                        start_time: {
                            required: true
                        },
                        end_time: {
                            required: true
                        },
                        fleet_status_id: {
                            required: true
                        },
                        fleet_reason_id: {
                            required: true
                        },
                    },
                    messages: {
                        tanggal: {
                            required: "Tanggal Harus Diisi"
                        },
                        shift: {
                            required: "Shift Harus Dipilih"
                        },
                        kategori: {
                            required: "Kategori Harus Dipilih"
                        },
                        loading_unit_id: {
                            required: "Loading Unit Harus Dipilih"
                        },
                        start_time: {
                            required: "Waktu Mulai Harus Diisi"
                        },
                        end_time: {
                            required: "Waktu Berakhir Harus Diisi"
                        },
                        fleet_status_id: {
                            required: "Status Harus Dipilih"
                        },
                        fleet_reason_id: {
                            required: "Alasan Harus Dipilih"
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
                        form.submit();
                    }
                });
            }
        },
        initConfirm :function(){
            $('#table tbody').on( 'click', '.delete', function () {
                var url = $(this).attr("url");
                console.log(url);
                App.confirm("Apakah Anda Yakin Untuk Mengubah Ini?",function(){
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
