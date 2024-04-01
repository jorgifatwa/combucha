define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "bootstrapDatetimepicker",
    "jqvalidate",
    "select2",
    "toastr"
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    bootstrapDatetimepicker,
    jqvalidate,
    select2,
    toastr
    ) {
    return {
        cek: false,
        table:null,
        selected_pit: $("#selected_pit").val(),
        selected_seam: $("#selected_seam").val(),
        selected_blok: $("#selected_blok").val(),
        init: function () {
            App.initFunc();
            App.initTable();
            App.initValidation();
            App.onChangeTanggal();
            App.onChangeType();
            App.onChangeLocation();
            App.onChangePit();
            App.onChangeSeam();
            App.onChangeBlok();
            App.initConfirm();
            App.initEvent();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            $('#start').datetimepicker({
                format: 'HH:mm'
            });
            $('#stop').datetimepicker({
                format: 'HH:mm'
            });
            $('#tanggal').datetimepicker({
                format: 'DD-MM-YYYY'
            });
            $('#type').select2({
                width: "100%",
                placeholder: "Pilih Tipe",
            });
            $('#location_id').select2({
                width: "100%",
                placeholder: "Pilih Site",
            });
            $('#pit_id').select2({
                width: "100%",
                placeholder: "Pilih PIT",
            });
            $('#seam_id').select2({
                width: "100%",
                placeholder: "Pilih Seam",
            });
            $('#blok_id').select2({
                width: "100%",
                placeholder: "Pilih Blok",
            });
            $('#shift').select2({
                width: "100%",
                placeholder: "Pilih Shift",
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
                "order": [[ 0, "desc" ]], //agar kolom id default di order secara desc
                "processing": true,
                "serverSide": true,
                "ajax":{
                    "url": App.baseUrl+"rns_actual/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "type" },
                    { "data": "site_name" },
                    { "data": "pit_name" },
                    { "data": "seam_name" },
                    { "data": "blok_name" },
                    { "data": "shift" },
                    { "data": "start" },
                    { "data": "stop" },
                    { "data": "rainfall" },
                    { "data": "action" },
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
                        type: {
                            required: true
                        },
                        location_id: {
                            required: true
                        },
                        pit_id: {
                            required: true
                        },
                        seam_id: {
                            required: true
                        },
                        blok_id: {
                            required: true
                        },
                        shift: {
                            required: true
                        },
                        start: {
                            required: true
                        },
                        stop: {
                            required: true
                        },
                        rainfall: {
                            required: function(element){
                                return $("#type").val() == 0;
                            }
                        },
                    },
                    messages: {
                        tanggal: {
                            required: "Tanggal Harus Diisi"
                        },
                        type: {
                            required: "Type Harus Diisi"
                        },
                        location_id: {
                            required: "Site Harus Dipilih"
                        },
                        pit_id: {
                            required: "PIT Harus Dipilih"
                        },
                        seam_id: {
                            required: "Seam Harus Dipilih"
                        },
                        blok_id: {
                            required: "Blok Harus Dipilih"
                        },
                        shift: {
                            required: "Shift Harus Dipilih"
                        },
                        start: {
                            required: "Start Harus Diisi"
                        },
                        stop: {
                            required: "Stop Harus Diisi"
                        },
                        rainfall: {
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
                        form.submit();
                    }
                });
            }
        },
        cekValidation :function()
        {
            var type = $('#type').val();
            var location_id = $('#location_id').val();
            var pit_id = $('#pit_id').val();
            var seam_id = $('#seam_id').val();
            var blok_id = $('#blok_id').val();
            $.ajax({
                url: App.baseUrl+'rns_actual/cekData',
                type: 'POST',
                data: {
                    type: type, 
                    location_id: location_id, 
                    pit_id: pit_id, 
                    seam_id: seam_id, 
                    blok_id: blok_id
                },
            })
            .done(function( response ) {
                var data = JSON.parse(response);
                console.log(data.status)
                if(data.data == 'Kosong'){
                    $('#iterasi').val(1);
                }else{
                    var iterasi = parseInt(data.data.iterasi);
                    var total = iterasi + 1;
                    $('#iterasi').val(total);
                    $('#id').val(data.data.id);
                    $('#rainfall').val(data.data.rainfall);
                }
                if(data.status == true){
                    $('.start').addClass('d-none');
                    $('.stop').removeClass('d-none');
                }else{
                    $('.start').removeClass('d-none');
                    $('.stop').addClass('d-none');
                }
            })
            .fail(function() {
                console.log("error");
            });

        },
        onChangeTanggal: function(){
            $('#tanggal').on('dp.change', function(e){ 
                App.cekValidation();
            });
        },
        onChangeType: function(){
            $("#type").on("change", function(){
                App.cekValidation();
                if($(this).val() == 0){
                    $('.rainfall').removeClass('d-none');
                }else {
                    $('.rainfall').addClass('d-none');
                }
            });
        },
        onChangeLocation: function(){
            $("#location_id").on("change", function(){
                var id = $(this).val();
                $.ajax({
                    url: App.baseUrl+'blok/getPit',
                    type: 'POST',
                    data: {id: id},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);
                    var option = "<option value=''>Pilih PIT</option>";
                    $('#pit_id').html(option);

                    if(data.status == true){
                        for (var i = 0; i < data.data.length; i++) {
                            if(App.selected_pit == data.data[i].id){
                                option += "<option value="+data.data[i].id+" selected> "+data.data[i].name+"</option>";
                            }else{
                                option += "<option value="+data.data[i].id+"> "+data.data[i].name+"</option>";
                            }
                        }
                    }
                    App.cekValidation();
                    $('#pit_id').html(option);
                    $('#pit_id').trigger("change");
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
        onChangePit: function(){
            $("#pit_id").on("change", function(){
                var id = $(this).val();
                $.ajax({
                    url: App.baseUrl+'blok/getSeam',
                    type: 'POST',
                    data: {id: id},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);
                    var option = "<option value=''>Pilih Seam</option>";
                    $('#seam_id').html(option);

                    if(data.status == true){
                        for (var i = 0; i < data.data.length; i++) {
                            if(App.selected_seam == data.data[i].id){
                                option += "<option value="+data.data[i].id+" selected> "+data.data[i].name+"</option>";
                            }else{
                                option += "<option value="+data.data[i].id+"> "+data.data[i].name+"</option>";
                            }
                        }
                    }
                    App.cekValidation();
                    $('#seam_id').html(option);
                    $('#seam_id').trigger("change");
                })
                .fail(function() {
                    console.log("error");
                });
            });

            var pit_id = $("#pit_id").val();
            if(pit_id != "" && pit_id != null && pit_id != undefined){
                $("#pit_id").trigger("change");
            }
        },
        onChangeSeam: function(){
            $("#seam_id").on("change", function(){
                var id = $(this).val();
                $.ajax({
                    url: App.baseUrl+'rns_actual/getBlok',
                    type: 'POST',
                    data: {id: id},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);
                    var option = "<option value=''>Pilih Blok</option>";
                    $('#blok_id').html(option);

                    if(data.status == true){
                        for (var i = 0; i < data.data.length; i++) {
                            if(App.selected_blok == data.data[i].id){
                                option += "<option value="+data.data[i].id+" selected> "+data.data[i].name+"</option>";
                            }else{
                                option += "<option value="+data.data[i].id+"> "+data.data[i].name+"</option>";
                            }
                        }
                    }
                    App.cekValidation();

                    $('#blok_id').html(option);
                    $('#blok_id').trigger("change");
                })
                .fail(function() {
                    console.log("error");
                });
            });

            var pit_id = $("#pit_id").val();
            if(pit_id != "" && pit_id != null && pit_id != undefined){
                $("#pit_id").trigger("change");
            }
        },
        onChangeBlok: function(){
            $("#blok_id").on("change", function(){
                App.cekValidation();
            });
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
        },
	}
});
