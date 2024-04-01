define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "select2",
    "toastr"
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    jqvalidate,
    select2,
    toastr
    ) {
    return {
        table:null,
        selected_pit: $("#selected_pit").val(),
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
            $('#pit_id').select2({
                width: "100%",
                placeholder: "Pilih PIT",
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
                    "url": App.baseUrl+"seam/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "location_name" },
                    { "data": "pit_name" },
                    { "data": "name" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        name: {
                            required: true
                        },
                        location_id: {
                            required: true
                        },
                        pit_id: {
                            required: true
                        },
                    },
                    messages: {
                        name: {
                            required: "Nama Seam Harus Diisi"
                        },
                        location_id: {
                            required: "Lokasi Harus Dipilih"
                        },
                        pit_id: {
                            required: "Pit Harus Dipilih"
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
                    url: App.baseUrl+'seam/getPit',
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
