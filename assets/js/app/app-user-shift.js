define([
    "jQuery",
    "bootstrap",
    "datatables",
    "select2",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr",
    ], function (
    $,
    bootstrap,
    datatables,
    select2,
    datatablesBootstrap,
    jqvalidate,
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
            $('#user_id').select2({
                width: "100%",
                placeholder: "Pilih Pengguna"
            });
            $('#shift_id').select2({
                width: "100%",
                placeholder: "Pilih Shift Kerja"
            });
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
                "order": [[ 0, "asc" ]], //agar kolom id default di order secara desc
                "processing": true,
                "serverSide": true,
                "ajax":{
                    "url": App.baseUrl+"user_shift/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "user_name" },
                    { "data": "shift_name" },
                    { "data": "action" ,"orderable": false}
                ]
            });


            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        shift_id: {
                            required: true
                        },
                        user_id: {
                            required: true
                        },
                    },
                    messages: {
                        shift_id: {
                            required: "Shift Kerja Harus Dipilih"
                        },
                        user_id: {
                            required: "Nama Pengguna Harus Dipilih"
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
            $('#table tbody').on( 'click', '.remove', function () {
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
