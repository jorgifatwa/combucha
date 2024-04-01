define([
    "jQuery",
    "bootstrap",
    "datatables",
    "select2",
    "datatablesBootstrap",
    "bootstrapDatepicker",
    "bootstrapDatetimepicker",
    "jqvalidate",
    "toastr"
    ], function (
    $,
    bootstrap,
    datatables,
    select2,
    datatablesBootstrap,
    bootstrapDatepicker,
    bootstrapDatetimepicker,
    jqvalidate,
    toastr
    ) {
    return {
        table:null,
        selected_pit: $("#selected_pit").val(),
        selected_seam: $("#selected_seam").val(),
        selected_blok: $("#selected_blok").val(),
        init: function () {
            App.initFunc();
            App.initEvent();
            App.initTable();
            App.initValidation();
            App.initNoTiket();
            App.initCalculateNetto();
            App.onChangeLocation();
            App.onChangePit();
            App.onChangeSeam();
            App.initConfirm();
            App.filterData();
            $(".loadingpage").hide();
        },
        initEvent : function(){
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
            $('#dumping_id').select2({
                width: "100%",
                placeholder: "Pilih Dumping",
            });
            $('#loading_unit_id').select2({
                width: "100%",
                placeholder: "Pilih Loading Unit",
            });
            $('#penimbang_id').select2({
                width: "100%",
                placeholder: "Pilih Penimbang",
            });
            $('#material_id').select2({
                width: "100%",
                placeholder: "Pilih Material",
            });
            $('#loading_model_id').select2({
                width: "100%",
                placeholder: "Pilih Loading Model",
            });
            $('#loader_id').select2({
                width: "100%",
                placeholder: "Pilih Loader",
            });
            $('#hauling_unit_id').select2({
                width: "100%",
                placeholder: "Pilih Hauling Unit",
            });
            $('#shift').select2({
                width: "100%",
                placeholder: "Pilih Shift",
            });
            $('#aktivitas').select2({
                width: "100%",
                placeholder: "Pilih Aktivitas",
            });
            $('#hauler_id').select2({
                width: "100%",
                placeholder: "Pilih Hauler",
            });
            $(".tanggal").datetimepicker({
                format: "DD-MM-YYYY",
            });
            $('.jam').datetimepicker({
                format: "HH:mm"
            });
            $("#filter-tanggal").datetimepicker({
                format: "DD-MM-YYYY",
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
                    "url": App.baseUrl+"coal_actual/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "jam" },
                    { "data": "shift" },
                    { "data": "aktivitas" },
                    { "data": "loading_unit_name" },
                    { "data": "hauling_unit_name" },
                    { "data": "location_name" },
                    { "data": "seam_name" },
                    { "data": "disposal_name" },
                    { "data": "gross" },
                    { "data": "netto" },
                    { "data": "action" ,"orderable": false}
                ]
            });
            if ($('#filter-tanggal').val() != undefined) {
                var split = $('#filter-tanggal').val().split('-');
                var default_date = split[2]+'-'+split[1]+'-'+split[0];
                App.table.column(0).search(default_date,true,true);
                App.table.draw();
            }
            
        },
        initValidation : function(){
            if($("#form-actual").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form-actual").validate({
                    rules: {
                        tanggal: {
                            required: true
                        },
                        jam_mulai: {
                            required: true
                        },
                        jam_akhir: {
                            required: true
                        },
                        shift: {
                            required: true
                        },
                        loading_unit_id: {
                            required: true
                        },
                        loading_model_id: {
                            required: true
                        },
                        loader_id: {
                            required: true
                        },
                        hauling_unit_id: {
                            required: true
                        },
                        hauling_model_id: {
                            required: true
                        },
                        hauler_id: {
                            required: true
                        },
                        material_id: {
                            required: true
                        },
                        disposal_id: {
                            required: true
                        },
                        supervisor_id: {
                            required: true
                        },
                        seam_id: {
                            required: true
                        },
                        blok_id: {
                            required: true
                        },
                        distance: {
                            required: true
                        },
                        location_id: {
                            required: true
                        },
                        total_ritase: {
                            required: true
                        },
                        capacity: {
                            required: true
                        },
                        total_production: {
                            required: true
                        },
                        dumping_id: {
                            required: true
                        },
                        pit_id: {
                            required: true
                        },
                        aktivitas: {
                            required: true
                        },
                        gross: {
                            required: true
                        },
                        tare: {
                            required: true
                        },
                        "penimbang_id[]": {
                            required: true
                        },
                    },
                    messages: {
                        tanggal: {
                            required: "Tanggal Harus Diisi"
                        },
                        jam_mulai: {
                            required: "Jam Harus Diisi"
                        },
                        jam_akhir: {
                            required: "Jam Harus Diisi"
                        },
                        shift: {
                            required: "Shift Harus Dipilih"
                        },
                        loading_unit_id: {
                            required: "Loading Unit Harus Dipilih"
                        },
                        loading_model_id: {
                            required: "Loading Model Harus Dipilih"
                        },
                        loader_id: {
                            required: "Loader Harus Diisi"
                        },
                        hauling_unit_id: {
                            required: "Hauling Unit Harus Dipilih"
                        },
                        hauling_model_id: {
                            required: "Hauling Model Harus Dipilih"
                        },
                        hauler_id: {
                            required: "Hauler Harus Dipilih "
                        },
                        material_id: {
                            required: "Material Harus Dipilih"
                        },
                        disposal_id: {
                            required: "Disposal Harus Dipilih"
                        },
                        supervisor_id: {
                            required: "Supervisor Harus Dipilih"
                        },
                        seam_id: {
                            required: "Seam Harus Dipilih"
                        },
                        blok_id: {
                            required: "Blok Harus Dipilih"
                        },
                        distance: {
                            required: "Distance Harus Diisi"
                        },
                        location_id: {
                            required: "Location Harus Dipilih"
                        },
                        total_ritase: {
                            required: "Total Ritase Harus Diisi"
                        },
                        capacity: {
                            required: "Capacity Harus Diisi"
                        },
                        total_production: {
                            required: "Total Production Harus Diisi"
                        },
                        dumping_id: {
                            required: "Lokasi Dumping Harus Dipilih"
                        },
                        pit_id: {
                            required: "Lokasi PIT Harus Dipilih"
                        },
                        aktivitas: {
                            required: "Aktivitas Coal Harus Dipilih"
                        },
                        gross: {
                            required: "Total Gross Harus Diisi"
                        },
                        tare: {
                            required: "Total Tare Harus Diisi"
                        },
                        "penimbang_id[]": {
                            required: "Penimbang Harus Dipilih"
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
                        var aksi = $(this.submitButton).attr("id");
                        if(aksi == "simpan"){
                            $.ajax({
                                url : App.baseUrl+"coal_actual/create",
                                type : "POST",
                                data : {
                                    aksi            : aksi,
                                    no_tiket        : $("#no_tiket").val(),  
                                    tanggal         : $("#tanggal").val(),  
                                    jam_mulai       : $("#jam_mulai").val(),  
                                    jam_akhir       : $("#jam_akhir").val(),  
                                    shift           : $("#shift").val(),  
                                    aktivitas       : $("#aktivitas").val(),  
                                    location_id     : $("#location_id").val(),  
                                    pit_id          : $("#pit_id").val(),  
                                    seam_id         : $("#seam_id").val(),  
                                    blok_id         : $("#blok_id").val(),  
                                    dumping_id      : $("#dumping_id").val(),  
                                    loading_unit_id : $("#loading_unit_id").val(),  
                                    loader_id       : $("#loader_id").val(),  
                                    hauling_unit_id : $("#hauling_unit_id").val(),  
                                    hauler_id       : $("#hauler_id").val(),  
                                    penimbang_id    : $("#penimbang_id").val(),  
                                    material_id     : $("#material_id").val(),  
                                    distance        : $("#distance").val(),  
                                    gross           : $("#gross").val(),  
                                    tare            : $("#tare").val(),  
                                    netto           : $("#netto").val(),  
                                },
                                success : function(data) {
                                    var data = JSON.parse(data);
                                    if(data.status){
                                        toastr.success("Data Coal Aktual Berhasil Disimpan!");
                                        $("#loading_unit_id").val("").trigger("change");
                                        $("#loader_id").val("").trigger("change");
                                        $("#hauling_unit_id").val("").trigger("change");
                                        $("#hauler_id").val("").trigger("change");
                                        $("#penimbang_id").val([]).trigger("change");
                                        $("#material_id").val("").trigger("change");
                                        $("#distance").val("");
                                        $("#gross").val("");
                                        $("#tare").val("");
                                        $("#netto").val("");
                                    }else{
                                        toastr.error("Data Coal Aktual Gagal Disimpan!");
                                    }
                                },
                                error : function(data) {
                                    toastr.error("Data Coal Aktual Gagal Disimpan!");
                                }
                            });
                        }else{
                            form.submit();
                        }
                    }
                });
            }
        },
        initNoTiket : function(){
            $("#tanggal, #jam_mulai, #jam_akhir").on("dp.change", function(){
                var tanggal = $("#tanggal").val();
                var jam_mulai = $("#jam_mulai").val();
                var no_tiket = "";
                if(tanggal != "" && tanggal != undefined && jam_mulai != "" && jam_mulai != undefined){
                    var format_tanggal = tanggal.split("-");
                    var format_jam = jam_mulai.replace(":","");
                    no_tiket = format_tanggal[2]+format_tanggal[1]+format_tanggal[0]+ format_jam;
                }
                $("#no_tiket").val(no_tiket);
            });
        },
        initCalculateNetto : function(){
            $("#gross, #tare").on("change", function(){
                var gross = $("#gross").val();
                var tare  = $("#tare").val();
                var netto = 0;
                if(gross != undefined && gross != "" && tare != undefined && tare !=""){
                    gross = parseFloat(gross);
                    tare = parseFloat(tare);
                    netto = gross - tare;
                }
                $("#netto").val(netto);
            });
        },
        onChangeLocation: function(){
            $("#location_id").on("change", function(){
                var id = $(this).val();
                $.ajax({
                    url: App.baseUrl+'coal_actual/getPit',
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
                    url: App.baseUrl+'coal_actual/getSeam',
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
                    url: App.baseUrl+'coal_actual/getBlok',
                    type: 'POST',
                    data: {id: id},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);
                    var option = "<option value=''>Pilih Seam</option>";
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
                    $('#blok_id').html(option);
                    $('#blok_id').trigger("change");
                })
                .fail(function() {
                    console.log("error");
                });
            });

            var seam_id = $("#seam_id").val();
            if(seam_id != "" && seam_id != null && seam_id != undefined){
                $("#seam_id").trigger("change");
            }
        },
        resetProduction : function(){
            $("#btn-reset").on('click', function(){
                $('#bulan_production').val("").change() 
                $('#tahun_production').val("").change()
                $('#total_production').val("")
                $('#modal-production').modal('toggle');
            });
        },
        clearProduction : function(){
            $('#bulan_production').val("").change() 
            $('#tahun_production').val("").change()
            $('#total_production').val("")
        },
        onClickProdction : function(){
            $("#btn-production").on('click', function(){
                $('#modal-production').modal('show');
            });
            if($("#form-create-production").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form-create-production").validate({
                    rules: {
                        no_tiket: {
                            required: true
                        },
                        tanggal: {
                            required: true
                        },
                        jam_mulai: {
                            required: true
                        },
                        jam_akhir: {
                            required: true
                        },
                        shift: {
                            required: true
                        },
                        aktivitas: {
                            required: true
                        },
                        location: {
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
                        dumping_id: {
                            required: true
                        },
                        loading_unit_id: {
                            required: true
                        },
                        loader_id: {
                            required: true
                        },
                        hauling_unit_id: {
                            required: true
                        },
                        hauler_id: {
                            required: true
                        },
                        "penimbang_id[]": {
                            required: true
                        },
                        material_id: {
                            required: true
                        },
                        distance: {
                            required: true
                        },
                        gross: {
                            required: true
                        },
                        tare: {
                            required: true
                        },
                        netto: {
                            required: true
                        },
                    },
                    messages: {
                        no_tiket: {
                            required: "Nomor Tiker Harus Diisi"
                        },
                        tanggal: {
                            required: "Tanggal Harus Dipilih"
                        },
                        jam_mulai: {
                            required: "Jam Mulai Harus Dipilih"
                        },
                        jam_akhir: {
                            required: "Jam Berakhir Harus Dipilih"
                        },
                        shift: {
                            required: "Shift Harus Dipilih"
                        },
                        aktivitas: {
                            required: "Aktivitas Harus Dipilih"
                        },
                        location: {
                            required: "Lokasi Harus Diisi"
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
                        dumping_id: {
                            required: "Dumping Harus Dipilih"
                        },
                        loading_unit_id: {
                            required: "Loading Unit Name Harus Dipilih"
                        },
                        loader_id: {
                            required: "Loader Name Harus Dipilih"
                        },
                        hauling_unit_id: {
                            required: "Hauling Unit Harus Dipilih"
                        },
                        hauler_id: {
                            required: "Hauler Name Harus Dipilih"
                        },
                        "penimbang_id[]": {
                            required: "Penimbang Harus Dipilih"
                        },
                        material_id: {
                            required: "Material Harus Dipilih"
                        },
                        distance: {
                            required: "Distance Harus Diisi"
                        },
                        gross: {
                            required: "Gross Harus Diisi"
                        },
                        tare: {
                            required: "Tare Harus Diisi"
                        },
                        netto: {
                            required: "Netto Harus Diisi"
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
                            error.insertAfter(element);
                        }
                    },
                    submitHandler : function(form) {
                        var total_production = $('#total_production').val();
                        var bulan_production = $('#bulan_production').val();
                        var tahun_production = $('#tahun_production').val();
                        $.ajax({
                            url : App.baseUrl+'coal_actual/create_production',
                            type : "POST",
                            dataType : "json",
                            data : {"total_production" : total_production, "bulan" : bulan_production, "tahun": tahun_production},
                            success : function(data) {
                                toastr.success("Data Berhasil Disimpan!");
                            },
                            error : function(data) {
                                toastr.error("Data Gagal Disimpan!");
                            }
                        });
                        App.clearProduction();
                        $("#modal-production").modal('hide');
                    }
                });
            }
        },
        filterData : function(){
            $('#filter-tanggal').on('dp.change', function (e) {
                if (e.date != false) {
                    var tanggal = e.date.format('YYYY-MM-DD');
                    App.table.column(0).search(tanggal,true,true);
                    App.table.draw();
                }

            });
            $('#reset').on('click', function () {
                var tanggal = $("#filter-tanggal").datetimepicker('clear');
                App.table.column(0).search('',true,true);
                App.table.draw();
            });
        },
        initConfirm :function(){
            $('#table tbody').on( 'click', '.delete', function () {
                var url = $(this).attr("url");
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
        },
	}
});
