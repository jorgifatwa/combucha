define([
    "jQuery",
    "bootstrap",
    "datatables",
    "select2",
    "datatablesBootstrap",
    "jqvalidate",
    "bootstrapDatetimepicker",
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
            App.changeTime();
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
                    $('#unit_id').html(option);

                    if(data.status == true){
                        for (var i = 0; i < data.data.length; i++) {
                            if(App.selected_unit == data.data[i].id){
                                option += "<option value="+data.data[i].id+"> "+data.data[i].kode+" - "+data.data[i].brand_name+" - "+data.data[i].unit_model_name+"</option>";
                            }else{
                                option += "<option value="+data.data[i].id+"> "+data.data[i].kode+" - "+data.data[i].brand_name+" - "+data.data[i].unit_model_name+"</option>";
                            }
                        }
                    }
                    $('#unit_id').html(option);
                })
                .fail(function() {
                    console.log("error");
                });
            });
        },
        changeTime : function(){
            $('#start_time').on('change', function (){
                start_time = $(this).val();
                end_time = $('#end_time').val();

                total = end_time - start_time;
                $('#duration').val(total);
            });

            $('#end_time').on('change', function (){
                end_time = $(this).val();
                start_time = $('#start_time').val();

                total = end_time - start_time;
                $('#duration').val(total);
            });
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
            $('#unit_id').select2({
                width: "100%",
                placeholder: "Pilih Loading Unit",
            });
            $('#operator_id').select2({
                width: "100%",
                placeholder: "Pilih Operator",
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
                    "url": App.baseUrl+"hours_meter/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "shift_name" },
                    { "data": "unit_name" },
                    { "data": "operator_name" },
                    { "data": "hm_start" },
                    { "data": "hm_end" },
                    { "data": "duration" },
                    { "data": "location_name" },
                    { "data": "week" },
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
                        shift_id: {
                            required: true
                        },
                        unit_id: {
                            required: true
                        },
                        hm_start: {
                            required: true
                        },
                        hm_end: {
                            required: true
                        },
                        duration: {
                            required: true
                        },
                        location_id: {
                            required: true
                        },
                    },
                    messages: {
                        tanggal: {
                            required: "Tanggal Harus Diisi"
                        },
                        shift_id: {
                            required: "Shift Harus Dipilih"
                        },
                        unit_id: {
                            required: "Loading Unit Harus Dipilih"
                        },
                        hm_start: {
                            required: "Waktu Mulai Harus Diisi"
                        },
                        hm_end: {
                            required: "Waktu Berakhir Harus Diisi"
                        },
                        duration: {
                            required: "Durasi Harus Diisi"
                        },
                        location_id: {
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
