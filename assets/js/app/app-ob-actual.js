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
            App.onChangeLocation();
            App.onChangePit();
            App.onChangeSeam();
            App.onClickJam();
            App.onClickEdit();
            App.onClickProdction();
            App.initConfirm();
            App.filterData();
            App.changeMaterial();
            App.changeTotalRitase();
            App.changeShift();
            App.resetProduction();
            $(".loadingpage").hide();
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
                        total_production: {
                            required: true
                        },
                        bulan_production: {
                            required: true
                        },
                        tahun_production: {
                            required: true
                        },
                    },
                    messages: {
                        total_production: {
                            required: "Total Harus Diisi"
                        },
                        bulan_production: {
                            required: "Bulan Harus Diisi"
                        },
                        tahun_production: {
                            required: "Tahun Harus Diisi"
                        }
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
                        var total_production = $('#total_production').val();
                        var bulan_production = $('#bulan_production').val();
                        var tahun_production = $('#tahun_production').val();
                        $.ajax({
                            url : App.baseUrl+'ob_actual/create_production',
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
        changeShift : function(){
            $("#shift").on("change", function(){
                var shift = $(this).val();
                if(shift == "DS"){
                    $("#tabs-container").removeClass("d-none");
                    $("#day").removeClass("d-none");
                    $("#night").addClass("d-none");
                    $(".active-days").removeClass("d-none");
                    $("#jam").val($("#day").children(0).attr('data-id'));
                }else if(shift == "NS"){
                    $("#tabs-container").removeClass("d-none");
                    $("#night").removeClass("d-none");
                    $("#jam").val($("#night").children(0).attr('data-id'));
                    $("#day").addClass("d-none");
                    $(".active-days").removeClass("d-none");
                } else {
                    $("#tabs-container").addClass("d-none");
                    $("#night").addClass("d-none");
                    $("#day").addClass("d-none");
                    $(".active-days").addClass("d-none");
                    $("#jam").val("00:00:00");
                }
            });
        },
        changeTotalRitase : function(){
            $("#total_ritase").on("change", function(){
                var total_ritase = $(this).val();
                var capacity = $("#capacity").val()
                var total_production = total_ritase * capacity;
                $("#total_production").val(total_production);
            });
            $("#capacity").on("change", function(){
                var capacity = $(this).val();
                var total_ritase = $("#total_ritase").val()
                var total_production = total_ritase * capacity;
                $("#total_production").val(total_production);
            });
        },
        changeMaterial : function(){
            $("#material_id").on("select2:select", function(){
                var id = $(this).val();
                $.ajax({
                    url : App.baseUrl+"ob_actual/get_kapasitas",
                    type : "POST",
                    data : {"id" : id},
                    success : function(data) {
                       var data = JSON.parse(data);
                       console.log(data);
                        if(data.status){
                            $("#capacity").val(data.data.capacity);
                            $("#capacity").trigger("change");
                        }
                    },
                    error : function(data) {
                    }
                });
            });
        },
        onClickJam : function(){
            $(".tab-jam").on("click", function(){
                $(".tab-jam .nav-link").removeClass("active");
                $(this).children().addClass("active");

                var jam = $(this).attr('data-id');
                $("#jam").val(jam);               
                if($("#tanggal").val() == ""){
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                }else{
                    var date = $("#tanggal").val();
                }

                App.table.column(1).search(date,true,true);
                App.table.column(2).search(jam,true,true);

                App.table.draw();

                // $.ajax({
                //     url : App.baseUrl+"actual/get_data",
                //     type : "POST",
                //     data : {"jam" : jam, "tanggal": date},
                //     success : function(data) {
                //         var data = JSON.parse(data);
                        // if(data.status){
                        //     console.log("masuk");
                        //     $("#tanggal").val(data.data[0].tanggal);
                        //     if(data.data[0].shift == "DS"){
                        //         $('#ds').prop('checked',true);
                        //     }else if(data.data[0].shift == "NS"){
                        //         $('#ns').prop('checked',true);
                        //     }
                        //     $('#loading_unit_'+data.data[0].loading_unit_id).prop('checked', true);
                        //     $("#loading_model_id").val(data.data[0].loading_model_id);
                        //     $("#loader_id").val(data.data[0].loader_id).change();
                        //     $("#hauling_unit_id").val(data.data[0].hauling_unit_id).change();
                        //     $("#loading_unit_id").val(data.data[0].loading_unit_id).change();
                        //     $("#id").val(data.data[0].id);
                        //     $("#hauler_id").val(data.data[0].hauler_id).change();
                        //     $("#material_id").val(data.data[0].material_id);
                        //     $("#material2_id").val(data.data[0].material2_id);
                        //     $("#disposal_id").val(data.data[0].disposal_id);
                        //     $("#supervisor_id").val(data.data[0].supervisor_id).change();
                        //     $("#distance").val(data.data[0].distance);
                        //     $("#seam_id").val(data.data[0].seam_id);
                        //     $("#production_js").val(data.data[0].production_js);
                        //     $("#blok_id").val(data.data[0].blok_id);
                        //     $("#location_id").val(data.data[0].location_id);
                        //     $("#total_ritase").val(data.data[0].total_ritase);
                        //     $("#capacity").val(data.data[0].capacity);
                        //     $("#total_production").val(data.data[0].total_production);
                        // }else{
                        //     // console.log("engga");
                        //     // App.clear();
                        //     $("#id").val("");
                        //     $('.js-example-basic').val('');
                        //     $("#loader_id").val("");
                        //     $("#loading_unit_id").val("").change();
                        //     $("#hauling_unit_id").val("").change();
                        //     $("#hauler_id").val("").change();
                        //     $("#loader_id").val("").change();
                        //     $("#material_id").val("").change();
                        //     $("#material2_id").val("").change();
                        //     $("#disposal_id").val("").change();
                        //     $("#supervisor_id").val("").change();
                        //     $("#distance").val("").change();
                        //     // $("#seam_id").val("");
                        //     // $("#location_id").val("");
                        //     $("#total_ritase").val("");
                        //     $("#capacity").val("");
                        //     $("#total_production").val("");
                        // }
                //     },
                //     error : function(data) {
                //     }
                // });
            });

        },
        clear : function(){
            $("#id").val("");
            $("#loading_model_id").val("");
            $("#loader_id").val("");
            $("#loading_unit_id").val("");
            $("#hauling_unit_id").val("");
            $("#loader_id").val("");
            $("#material_id").val("");
            $("#disposal_id").val("");
            $("#supervisor_id").val("");
            $("#distance").val("");
            $("#production_js").val("");
            $("#total_ritase").val("");
            $("#capacity").val("");
            $("#total_production").val("");
        },
        filterData : function(){
            $('#filter-tanggal').on('change', function () {
                var tanggal = $("#filter-tanggal").val();
                console.log(tanggal);
                App.table.column(0).search(tanggal,true,true);

                App.table.draw();

                App.tanggal = $('#filter-tanggal').val();

            });
            $('#reset').on( 'click', function () {
                $("#filter-tanggal").val("").trigger("change");
                App.table.search( '' ).columns().search( '' ).draw();
            });
        },
        initEvent : function(){
            $('#loading_unit_id').select2({
                width: "100%",
                placeholder: "Pilih Loading Unit",
            });
            $('#seam_id').select2({
                width: "100%",
                placeholder: "Pilih Seam",
            });

            $('#pit_id').select2({
                width: "100%",
                placeholder: "Pilih Seam",
            });
            $('#blok_id').select2({
                width: "100%",
                placeholder: "Pilih Blok",
            });
            $('#material_id').select2({
                width: "100%",
                placeholder: "Pilih Material",
            });
            $('#service_id').select2({
                width: "100%",
                placeholder: "Pilih Service",
            });
            $('#material2_id').select2({
                width: "100%",
                placeholder: "Pilih Material",
            });
            $('#disposal_id').select2({
                width: "100%",
                placeholder: "Pilih Disposal",
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
            $('#hauler_id').select2({
                width: "100%",
                placeholder: "Pilih Hauler",
            });
            $('#supervisor_id').select2({
                width: "100%",
                placeholder: "Pilih Supervisor",
            });
            $('#shift').select2({
                width: "100%",
                placeholder: "Pilih Shift",
            });
            $(".tanggal").datetimepicker({
                format: "DD-MM-YYYY",
            });

            var page = $('#page').val();
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
                    "url": App.baseUrl+"ob_actual/dataList",
                    "dataType": "json",
                    "type": "POST"
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "jam" },
                    { "data": "shift" },
                    { "data": "loading_unit_name" },
                    { "data": "hauling_unit_name" },
                    { "data": "loader_name" },
                    { "data": "supervisor_name" },
                    { "data": "total_ritase" },
                    { "data": "capacity" },
                    { "data": "total_production" },
                    { "data": "action" },
                ]
            });

            if($("#page").val() != "create"){
                App.table.column(10).visible(false);
            }else{
                App.table.clear().draw();
            }
            
            if($("#form-actual-create").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form-actual-create").validate({
                    rules: {
                        tanggal: {
                            required: true
                        },
                        jam: {
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
                        material2_id: {
                            required: false
                        },
                        disposal_id: {
                            required: true
                        },
                        supervisor_id: {
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
                        distance: {
                            required: true
                        },
                        location_id: {
                            required: true
                        },
                        production_js: {
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
                    },
                    messages: {
                        tanggal: {
                            required: "Tanggal Harus Diisi"
                        },
                        jam: {
                            required: "Jam Harus Diisi"
                        },
                        shift: {
                            required: "*Harus Dipilih"
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
                        material2_id: {
                            required: "Material Harus Dipilih"
                        },
                        disposal_id: {
                            required: "Disposal Harus Dipilih"
                        },
                        supervisor_id: {
                            required: "Supervisor Harus Dipilih"
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
                        distance: {
                            required: "Distance Harus Diisi"
                        },
                        location_id: {
                            required: "Location Harus Dipilih"
                        },
                        production_js: {
                            required: "Productino JS Harus Diisi"
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
                        var jam = $("#jam").val();
                        console.log(jam);
                        if(jam != undefined && jam != "" && jam != null){
                            $.ajax({
                                url : App.baseUrl+"ob_actual/create",
                                type : "POST",
                                data : {
                                    id : $("#id").val(),  
                                    tanggal : $("#tanggal").val(),  
                                    shift : $("#shift").val(),  
                                    jam : $("#jam").val(),  
                                    loading_unit_id : $("#loading_unit_id").val(),  
                                    loader_id : $("#loader_id").val(),  
                                    hauling_unit_id : $("#hauling_unit_id").val(),  
                                    hauler_id : $("#hauler_id").val(),  
                                    material_id : $("#material_id").val(),  
                                    material2_id : $("#material2_id").val(),  
                                    disposal_id : $("#disposal_id").val(),  
                                    supervisor_id : $("#supervisor_id").val(),  
                                    distance : $("#distance").val(),  
                                    pit_id : $("#pit_id").val(),  
                                    seam_id : $("#seam_id").val(),  
                                    blok_id : $("#blok_id").val(),  
                                    location_id : $("#location_id").val(),  
                                    total_ritase : $("#total_ritase").val(),
                                    capacity : $("#capacity").val(),
                                    total_production : $("#total_production").val()
                                },
                                success : function(data) {
                                    var data = JSON.parse(data);
                                    if(data.status){
                                        toastr.success("Data Berhasil Disimpan!");
                                        App.table.clear().draw();
                                    }else{
                                        toastr.error("Data Gagal Disimpan!");
                                    }
                                },
                                error : function(data) {
                                    toastr.error("Data Gagal Disimpan!");
                                }
                            });
                        }else{
                            toastr.error("Harap Pilih Jam");
                        }
                    }
                });
            }
        },
        onChangeLocation: function(){
            $("#location_id").on("change", function(){
                var id = $(this).val();
                $.ajax({
                    url: App.baseUrl+'ob_actual/getPit',
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
                    url: App.baseUrl+'ob_actual/getSeam',
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
                    url: App.baseUrl+'ob_actual/getBlok',
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
        initConfirm :function(){
            $('#table tbody').on( 'click', '.delete', function () {
                var url = $(this).attr("url");
                console.log(url);
                App.confirm("Apakah Anda Yakin Untuk Mengubah Ini?",function(){
                   $.ajax({
                      method: "GET",
                      url: url
                    }).done(function( msg ) {
                        App.table.ajax.reload(null,true);
                    });
                })
            });
        },
        onClickEdit : function(){
                $('#table tbody').on( 'click', '.btn-info', function () {
                var id_actual = $(this).attr('data-actual');
                $.ajax({
                    url : App.baseUrl+"ob_actual/get_data",
                    type : "POST",
                    data : {"id_actual" : id_actual},
                    success : function(data) {
                        var data = JSON.parse(data);
                        if(data.status){
                            $('#loading_unit_'+data.data[0].loading_unit_id).prop('checked', true);
                            $("#loader_id").val(data.data[0].loader_id).change();
                            $("#hauling_unit_id").val(data.data[0].hauling_unit_id).change();
                            $("#loading_unit_id").val(data.data[0].loading_unit_id).change();
                            $("#id").val(data.data[0].id);
                            $("#hauler_id").val(data.data[0].hauler_id).change();
                            $("#material_id").val(data.data[0].material_id).change();
                            $("#material2_id").val(data.data[0].material2_id).change();
                            $("#disposal_id").val(data.data[0].disposal_id).change();
                            $("#supervisor_id").val(data.data[0].supervisor_id).change();
                            $("#distance").val(data.data[0].distance);
                            $("#pit_id").val(data.data[0].pit_id).change();
                            $("#seam_id").val(data.data[0].seam_id).change();
                            $("#production_js").val(data.data[0].production_js);
                            $("#blok_id").val(data.data[0].blok_id).change();
                            $("#location_id").val(data.data[0].location_id).change();
                            $("#total_ritase").val(data.data[0].total_ritase);
                            $("#capacity").val(data.data[0].capacity);
                            $("#total_production").val(data.data[0].total_production);
                        }
                    },
                    error : function(data) {
                    }
                });
            })
        },
	}
});
