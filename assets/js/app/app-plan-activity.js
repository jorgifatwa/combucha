define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "bootstrapDatepicker",
    "jqvalidate",
    "select2",
    "toastr"
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    bootstrapDatepicker,
    jqvalidate,
    select2,
    toastr
    ) {
    return {
        table:null,
        pit: [],
        loading_unit: [],
        hauling_unit: [],
        count_fleet_ob: 0,
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
                placeholder: "Pilih Site"
            });
            $('#shift').select2({
                width: "100%",
                placeholder: "Pilih Shift",
            });
            $('.loading_unit_id').select2({
                width: "100%",
                placeholder: "Pilih Loading Unit",
            });
            $('.pit_id').select2({
                width: "100%",
                placeholder: "Pilih PIT",
            });
            $('.seam_id').select2({
                width: "100%",
                placeholder: "Pilih Seam",
            });
            $('.blok_id').select2({
                width: "100%",
                placeholder: "Pilih Blok",
            });
            $('.hauling_unit_id').select2({
                width: "100%",
                placeholder: "Pilih Hauling Unit",
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
                    "url": App.baseUrl+"/plan_activity/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "location_name" },
                    { "data": "shift" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    ignore: [],
                    rules: {
                        tanggal: {
                            required: true
                        },
                        location_id: {
                            required: true
                        },
                        shift: {
                            required: true
                        },
                        "pit_id[]": {
                            required: true
                        },
                        "hauling_unit_id[][]": {
                            required: true
                        },
                    },
                    messages: {
                        tanggal: {
                            required: "Tanggal Harus Diisi"
                        },
                        location_id: {
                            required: "Lokasi Harus Dipilih"
                        },
                        shift: {
                            required: "Shift Harus Dipilih"
                        },
                        "pit_id[]": {
                            required: "PIT Harus Dipilih"
                        },
                        "hauling_unit_id[][]": {
                            required: "Hauling Unit Harus Dipilih"
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
                //get PIT
                $.ajax({
                    url: App.baseUrl+'plan_activity/getDataByLokasi',
                    type: 'POST',
                    data: {id: id},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);

                    if(data.pit.length > 0){
                        App.pit = data.pit;
                    }

                    if(data.loading_unit.length > 0){
                        App.loading_unit = data.loading_unit;
                    }

                    if(data.hauling_unit.length > 0){
                        App.hauling_unit = data.hauling_unit;
                    }
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
        tambahFleetOb: function(){
            var html = "";

            html += "<tr>";

            //pit id
            html += '<td>';
            html += '<select name="pit_id['+App.count_fleet_ob+']" id="pit_id_'+App.count_fleet_ob+'" class="form-control pit_id" onchange="App.onChangePit(this)">';
            html += '<option value="">Pilih PIT</option>';
            for (let i = 0; i < App.pit.length; i++) {
                html += '<option value="'+App.pit[i].id+'">'+App.pit[i].name+'</option>';
            }
            html += '</select>';
            html += '</td>';

            // seam id
            html += '<td>';
            html += '<select name="seam_id['+App.count_fleet_ob+']" id="seam_id_'+App.count_fleet_ob+'" class="form-control seam_id" onchange="App.onChangeSeam(this)">';
            html += '<option value="">Pilih Seam</option>';
            html += '</select>';
            html += '</td>';

            // blok id
            html += '<td>';
            html += '<select name="blok_id['+App.count_fleet_ob+']" id="blok_id_'+App.count_fleet_ob+'" class="form-control blok_id">';
            html += '<option value="">Pilih Blok</option>';
            html += '</select>';
            html += '</td>';

            //loading unit
            html += '<td>';
            html += '<select name="loading_unit_id['+App.count_fleet_ob+']" id="loading_unit_id_'+App.count_fleet_ob+'" class="form-control loading_unit_id">';
            html += '<option value="">Pilih Loading Unit</option>';
            for (let i = 0; i < App.loading_unit.length; i++) {
                html += '<option value="'+App.loading_unit[i].id+'">'+App.loading_unit[i].kode+' - '+App.loading_unit[i].brand_name+' - '+App.loading_unit[i].unit_model_name+'</option>';
            }
            html += '</select>';
            html += '</td>';

            //Hauling unit
            html += '<td>';
            html += '<select name="hauling_unit_id['+App.count_fleet_ob+'][]" id="hauling_unit_id_'+App.count_fleet_ob+'" class="form-control hauling_unit_id" multiple>';
            html += '<option value="">Pilih hauling Unit</option>';
            for (let i = 0; i < App.hauling_unit.length; i++) {
                html += '<option value="'+App.hauling_unit[i].id+'">'+App.hauling_unit[i].kode+' - '+App.hauling_unit[i].brand_name+' - '+App.hauling_unit[i].unit_model_name+'</option>';
            }
            html += '</select>';
            html += '</td>';

            html += '<td>';
            html += '<button type="button" class="btn btn-danger" onClick="App.hapusRow(this);"><i class="fa fa-times"></i></button>';
            html += '</td>';

            html += "</tr>";
            $("#container-fleet-ob").append(html);

            //init select2
            $("#loading_unit_id_" + App.count_fleet_ob).select2({
                width: "100%",
                placeholder: "Pilih Loading Unit",
            });
            $("#pit_id_" + App.count_fleet_ob).select2({
                width: "100%",
                placeholder: "Pilih PIT",
            });
            $("#seam_id_" + App.count_fleet_ob).select2({
                width: "100%",
                placeholder: "Pilih Seam",
            });
            $("#blok_id_" + App.count_fleet_ob).select2({
                width: "100%",
                placeholder: "Pilih Blok",
            });
            $("#hauling_unit_id_" + App.count_fleet_ob).select2({
                width: "100%",
                placeholder: "Pilih Hauling Unit",
            });
                
            App.initValidation();
            App.count_fleet_ob++;
        },
        hapusRow: function(e){
            $(e).closest('tr').remove();
        },
        onChangePit : function(e){
            var id = $(e).val();
            var selected_item = $(e).closest("tr").find('.seam_selected').val();
            $.ajax({
                url: App.baseUrl+'plan_activity/getSeam',
                type: 'POST',
                data: {id: id},
            })
            .done(function( response ) {
                var data = JSON.parse(response);
                var option = "<option value=''>Pilih Seam</option>";
                if(data.status == true){
                    for (var i = 0; i < data.data.length; i++) {
                        if(selected_item == data.data[i].id){
                            option += "<option value="+data.data[i].id+" selected> "+data.data[i].name+"</option>";
                        }else{
                        }
                        option += "<option value="+data.data[i].id+"> "+data.data[i].name+"</option>";
                    }
                }
                $(e).closest("tr").find('.seam_id').html(option);
                $(e).closest("tr").find('.seam_id').trigger("change");
            })
            .fail(function() {
                console.log("error");
            });
        },
        onChangeSeam : function(e){
            var id = $(e).val();
            var selected_item = $(e).closest("tr").find('.blok_selected').val();
            $.ajax({
                url: App.baseUrl+'plan_activity/getBlok',
                type: 'POST',
                data: {id: id},
            })
            .done(function( response ) {
                var data = JSON.parse(response);
                var option = "<option value=''>Pilih Blok</option>";
                if(data.status == true){
                    for (var i = 0; i < data.data.length; i++) {
                        if(selected_item == data.data[i].id){
                            option += "<option value="+data.data[i].id+" selected> "+data.data[i].name+"</option>";
                        }else{
                        }
                        option += "<option value="+data.data[i].id+"> "+data.data[i].name+"</option>";
                    }
                }
                $(e).closest("tr").find('.blok_id').html(option);
                $(e).closest("tr").find('.blok_id').trigger("change");
            })
            .fail(function() {
                console.log("error");
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
        }
	}
});
