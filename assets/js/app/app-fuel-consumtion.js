define([
    "jQuery",
    "bootstrap",
    "datatables",
    "select2",
    "datatablesBootstrap",
    "bootstrapDatepicker",
    "jqvalidate",
    "toastr",
    ], function (
    $,
    bootstrap,
    datatables,
    select2,
    datatablesBootstrap,
    bootstrapDatepicker,
    jqvalidate,
    toastr
    ) {
    return {
        table:null,
        selected_pit:$("#selected_pit").val(),
        selected_pic:$("#selected_pic").val(),
        selected_unit:$("#selected_unit").val(),
        selected_disposal:$("#selected_lokasi_pengisian").val(),
        init: function () {
            App.initFunc();
            App.initTable();
            App.initValidation();
            App.onChangeLocation();
            App.initConfirm();
            App.initEvent();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            $('#location_id').select2({
                width: "100%",
                placeholder: "Pilih Lokasi",
            });

            $('#lokasi_pengisian_id').select2({
                width: "100%",
                placeholder: "Pilih Lokasi Pengisian",
            });

            $('#unit_id').select2({
                width: "100%",
                placeholder: "Pilih Unit",
            });

            $('#pit_id').select2({
                width: "100%",
                placeholder: "Pilih PIT",
            });

            $('#pic_id').select2({
                width: "100%",
                placeholder: "Pilih PIC",
            });

            $("#tanggal").datepicker({
                format: "dd-mm-yyyy",
                autoclose: true,
                todayHighlight: true
            });
        },
        initTable : function(){
            App.table = $('#table').DataTable({
                "language": {
                    "search": "Cari",
                    "lengthMenu": "Lihat _MENU_ data",
                    "zeroRecords": "Tidak ada data yang cocok ditemukan",
                    "info": "Menampilkan _START_ hingga _END_ dari _TOTAL_ data",
                    "infoEmpty": "Tidak ada data di dalam tabel",
                    "infoFiltered": "(cari dari _MAX_ total catatan)",
                    "loadingRecords": "Loading...",
                    "processing": "Processing...",
                    "paginate": {
                        "first":      "Pertama",
                        "last":       "Terakhir",
                        "next":       "Selanjutnya",
                        "previous":   "Sebelumnya"
                    },
                },
                "order": [[ 0, "desc" ]], 
                "processing": true,
                "serverSide": true,
                "ajax":{
                    "url": App.baseUrl+"fuel_consumtion/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "location_name" },
                    { "data": "pit_name" },
                    { "data": "hm" },
                    { "data": "pic_name" },
                    { "data": "unit" },
                    { "data": "shift" },
                    { "data": "lokasi_pengisian" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        tanggal: {
                            required: true
                        },
                        location_id: {
                            required: true
                        },
                        pit_id: {
                            required: true
                        },
                        hour_meter: {
                            required: true
                        },
                        pic_id: {
                            required: true
                        },
                        unit_id: {
                            required: true
                        },
                        shift: {
                            required: true
                        },
                        lokasi_pengisian_id: {
                            required: true
                        },
                        qty_in: {
                            required: true
                        },
                        qty_out: {
                            required: true
                        }
                    },
                    messages: {
                        tanggal: {
                            required: "Tanggal Harus Dipilih"
                        },
                        location_id: {
                            required: "Site Harus Dipilih"
                        },
                        pit_id: {
                            required: "PIT Harus Dipilih"
                        },
                        hour_meter: {
                            required: "Hour Meter Harus Diisi"
                        },
                        pic_id: {
                            required: "PIC Harus Dipilih"
                        },
                        unit_id: {
                            required: "Unit Harus Dipilih"
                        },
                        shift: {
                            required: "Shift Harus Dipilih"
                        },
                        lokasi_pengisian_id: {
                            required: "Lokasi Pengisian Harus Dipilih"
                        },
                        qty_in: {
                            required: "QTY In Harus Diisi"
                        },
                        qty_out: {
                            required: "QTY Out Harus Diisi"
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
        onChangeLocation: function(){
            $("#location_id").on("change", function(){
                var id = $(this).val();
                $.ajax({
                    url: App.baseUrl+'fuel_consumtion/getDataByLocation',
                    type: 'POST',
                    data: {id: id},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);
                    var option_pit = "<option value=''>Pilih PIT</option>";
                    var option_pic = "<option value=''>Pilih PIC</option>";
                    var option_unit = "<option value=''>Pilih Unit</option>";
                    var option_disposal = "<option value=''>Pilih Lokasi Pengisian</option>";
                    $('#pit_id').html(option_pit);
                    $('#pic_id').html(option_pic);
                    $('#unit_id').html(option_unit);
                    $('#lokasi_pengisian_id').html(option_disposal);

                    if(data.status == true){
                        //data pit
                        for (var i = 0; i < data.pit.length; i++) {
                            if(App.selected_pit == data.pit[i].id){
                                option_pit += "<option value="+data.pit[i].id+" selected> "+data.pit[i].name+"</option>";
                            }else{
                                option_pit += "<option value="+data.pit[i].id+"> "+data.pit[i].name+"</option>";
                            }
                        }
                        
                        //data pic
                        if(data.pic != false){
                            for (var i = 0; i < data.pic.length; i++) {
                                if(App.selected_pic == data.pic[i].id){
                                    option_pic += "<option value="+data.pic[i].id+" selected> "+data.pic[i].first_name+"</option>";
                                }else{
                                    option_pic += "<option value="+data.pic[i].id+"> "+data.pic[i].first_name+"</option>";
                                }
                            }
                        }

                        //data lokasi pengisian
                        if(data.disposal != false){
                            for (var i = 0; i < data.disposal.length; i++) {
                                if(App.selected_disposal == data.disposal[i].id){
                                    option_disposal += "<option value="+data.disposal[i].id+" selected> "+data.disposal[i].name+"</option>";
                                }else{
                                    option_disposal += "<option value="+data.disposal[i].id+"> "+data.disposal[i].name+"</option>";
                                }
                            }
                        }

                        //data unit
                        if(data.unit != false){
                            for (var i = 0; i < data.unit.length; i++) {
                                if(App.selected_unit == data.unit[i].id){
                                    option_unit += "<option value="+data.unit[i].id+" selected> "+ data.unit[i].kode +" - "+ data.unit[i].brand_name +" - "+ data.unit[i].unit_model_name +"</option>";
                                }else{
                                    option_unit += "<option value="+data.unit[i].id+"> "+ data.unit[i].kode +" - "+ data.unit[i].brand_name +" - "+ data.unit[i].unit_model_name +"</option>";
                                }
                            }
                        }
                    }
                    $('#pit_id').html(option_pit);
                    $('#pit_id').trigger("change");

                    $('#pic_id').html(option_pic);
                    $('#pic_id').trigger("change");

                    $('#unit_id').html(option_unit);
                    $('#unit_id').trigger("change");

                    $('#lokasi_pengisian_id').html(option_disposal);
                    $('#lokasi_pengisian_id').trigger("change");
                })
                .fail(function() {
                    console.log("error");
                });
            });

            var location_id = $("#location_id").val();
            if(location_id != "" && location_id != null && location_id != undefined){
                $("#location_id").trigger("change");
            }
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
