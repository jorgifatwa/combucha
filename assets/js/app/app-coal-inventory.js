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

            $('#pit_id').select2({
                width: "100%",
                placeholder: "Pilih PIT",
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
                "order": [[ 0, "asc" ]], 
                "processing": true,
                "serverSide": true,
                "ajax":{
                    "url": App.baseUrl+"coal_inventory/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "location_name" },
                    { "data": "pit_name" },
                    { "data": "tanggal" },
                    { "data": "tonase" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        location_id: {
                            required: true
                        },
                        pit_id: {
                            required: true
                        },
                        tonase: {
                            required: true
                        },
                        tanggal: {
                            required: true
                        },
                    },
                    messages: {
                        location_id: {
                            required: "Site Harus Dipilih"
                        },
                        pit_id: {
                            required: "PIT Harus Dipilih"
                        },
                        tonase: {
                            required: "Tonase Harus Diisi"
                        },
                        tanggal: {
                            required: "Tanggal Harus Diisi"
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
                    url: App.baseUrl+'coal_inventory/getPit',
                    type: 'POST',
                    data: {id: id},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);
                    var option_pit = "<option value=''>Pilih PIT</option>";
                    $('#pit_id').html(option_pit);

                    if(data.status == true){
                        //data pit
                        for (var i = 0; i < data.data.length; i++) {
                            if(App.selected_pit == data.data[i].id){
                                option_pit += "<option value="+data.data[i].id+" selected> "+data.data[i].name+"</option>";
                            }else{
                                option_pit += "<option value="+data.data[i].id+"> "+data.data[i].name+"</option>";
                            }
                        }
                    }
                    $('#pit_id').html(option_pit);
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
