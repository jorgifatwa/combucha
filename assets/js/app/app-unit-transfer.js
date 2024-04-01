define([
    "jQuery",
    "bootstrap",
    "datatables",
    "select2",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr"
    ], function (
    $,
    bootstrap,
    select2,
    datatables,
    datatablesBootstrap,
    jqvalidate,
    toastr
    ) {
    return {
        table:null,
        init: function () {
            App.initFunc();
            App.initEvent();
            App.onChangeUnit();
            App.initConfirm();
            $(".loadingpage").hide();
        },
        onChangeUnit : function(){
            $('#unit_id').on('change', function (){
                var unit_id = $(this).val();
                $.ajax({
                    url : App.baseUrl+"unit_transfer/get_transfer",
                    type : "POST",
                    data : {"unit_id" : unit_id},
                    success : function(response) {
                       var data = JSON.parse(response);
                       if(data.status == true){
                           var option_from_location = "<option value="+data.data.to_location+" selected> "+data.data.last_location_name+"</option>";
                       }else{
                            var option_from_location = "<option value="+1+" selected>Pusat</option>";
                       }
                       $('#from_location').html(option_from_location);
                    },
                    error : function(data) {
                    }
                });
            });
        },
        initEvent : function(){
            $('#unit_id').select2({
                width: "100%",
                placeholder: "Pilih Unit",
            });
            $('#from_location').select2({
                width: "100%",
                placeholder: "Pilih Lokasi",
            });
            $('#to_location').select2({
                width: "100%",
                placeholder: "Pilih Lokasi",
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
                "order": [[ 0, "desc" ]], //agar kolom id default di order secara desc
                "processing": true,
                "serverSide": true,
                "ajax":{
                    "url": App.baseUrl+"unit_transfer/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "created_at" },
                    { "data": "unit_name" },
                    { "data": "from" },
                    { "data": "to" },
                    { "data": "is_deleted" },
                    { "data": "action" ,"orderable": false}
                ]
            });


            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        unit_id: {
                            required: true
                        },
                        from_location: {
                            required: true
                        },
                        to_location: {
                            required: true
                        }
                    },
                    messages: {
                        unit_id: {
                            required: "Unit Harus Dipilih"
                        },
                        from_location: {
                            required: "Transfer Dari Harus Dipilih"
                        },
                        to_location: {
                            required: "Transfer Ke Harus Dipilih"
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
                        form.submit();
                    }
                });
            }
        },
        initConfirm :function(){
            $('#table tbody').on( 'click', '.approval', function () {
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
