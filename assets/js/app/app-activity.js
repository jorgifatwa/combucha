define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "bootstrapDatetimepicker",
    "jqvalidate",
    "select2",
    "toastr",
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
        table:null,
        init: function () {
            App.initFunc();
            App.initEvent();
            App.initConfirm();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            id = $('#id').val();
            $('#status').select2({
                width: "100%",
                placeholder: "Pilih Status",
            });
            $('#tanggal').datetimepicker({
                format: 'DD-MM-YYYY'
            });
            $('#start').datetimepicker({
                format: 'HH:mm'
            });
            $('#stop').datetimepicker({
                format: 'HH:mm'
            });
            $('#time_down').datetimepicker({
                format: 'HH:mm'
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
                    "url": App.baseUrl+"activity/dataList/"+id,
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "id" },
                    { "data": "tanggal" },
                    { "data": "start" },
                    { "data": "stop" },
                    { "data": "time_down" },
                    { "data": "hm" },
                    { "data": "trouble" },
                    { "data": "activity" },
                    { "data": "status" },
                    { "data": "component_freq" },
                    { "data": "component_dura" },
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
                        start: {
                            required: true
                        },
                        stop: {
                            required: true
                        },
                        time_down: {
                            required: true
                        },
                        hm: {
                            required: true
                        },
                        trouble_description: {
                            required: true
                        },
                        activity: {
                            required: true
                        },
                        status: {
                            required: true
                        },
                        component_freq: {
                            required: true
                        },
                        component_dura: {
                            required: true
                        },
                    },
                    messages: {
                        tanggal: {
                            required: "Tanggal Harus Diisi"
                        },
                        start: {
                            required: "Waktu Mulai Harus Diisi"
                        },
                        stop: {
                            required: "Waktu Berhenti Harus Diisi"
                        },
                        time_down: {
                            required: "Waktu Habis Harus Diisi"
                        },
                        hm: {
                            required: "HM Harus Diisi"
                        },
                        trouble_description: {
                            required: "Deskripsi Masalah Harus Diisi"
                        },
                        activity: {
                            required: "Aktivitas Harus Diisi"
                        },
                        status: {
                            required: "Status Harus Diisi"
                        },
                        component_freq: {
                            required: "Komponen Frekuensi Harus Diisi"
                        },
                        component_dura: {
                            required: "Komponen Durasi Harus Diisi"
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
