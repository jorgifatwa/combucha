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
        init: function () {
            App.initFunc();
            App.initEvent();
            App.initConfirm();
            App.getDataFleetReason();
            App.onChangeLocation();
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
            $('#tanggal_bd').datetimepicker({
                format: 'DD-MM-YYYY'
            });
            $('#tanggal_mulai').datetimepicker({
                format: 'DD-MM-YYYY'
            });
            $('#tanggal_akhir').datetimepicker({
                format: 'DD-MM-YYYY'
            });
            $('#loading_unit_id').select2({
                width: "100%",
                placeholder: "Pilih Loading Unit",
            });
            $('#job_status_id').select2({
                width: "100%",
                placeholder: "Pilih Job Status",
            });
            $('#location_id').select2({
                width: "100%",
                placeholder: "Pilih Lokasi",
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
                    "url": App.baseUrl+"breakdown/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "loading_unit_name" },
                    { "data": "job_status_name" },
                    { "data": "trouble" },
                    { "data": "location_name" },
                    { "data": "action" ,"orderable": false}
                ]
            });


            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        tanggal_bd: {
                            required: true
                        },
                        loading_unit_id: {
                            required: true
                        },
                        job_status_id: {
                            required: true
                        },
                        tanggal_bd: {
                            required: true
                        },
                        trouble_description: {
                            required: true
                        },
                        location_id: {
                            required: true
                        },
                    },
                    messages: {
                        tanggal_bd: {
                            required: "Tanggal Harus Diisi"
                        },
                        loading_unit_id: {
                            required: "Loading Unit Harus Dipilih"
                        },
                        job_status_id: {
                            required: "Job Status Harus Dipilih"
                        },
                        trouble_description: {
                            required: "Deskripsi Masalah Harus Diisi"
                        },
                        location_id: {
                            required: "Lokasi Harus Diisi"
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
