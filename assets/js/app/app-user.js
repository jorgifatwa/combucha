define([
    "jQuery",
    "bootstrap",
    "bootstrapDatepicker",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "select2",
    "toastr"
    ], function (
    $,
    bootstrap,
    datatables,
    bootstrapDatepicker,
    datatablesBootstrap,
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

            App.searchTable();
            App.resetSearch();

            $(".dataTables_filter").show();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            $('#role_id').select2({
                width: "100%",
                placeholder: "Pilih Jabatan",
            });
            $('#jenis_kelamin').select2({
                width: "100%",
                placeholder: "Pilih Jenis Kelamin",
            });
            $('#golongan').select2({
                width: "100%",
                placeholder: "Pilih Golongan",
            });
            $('#wilayah_id').select2({
                width: "100%",
                placeholder: "Pilih Wilayah Rekrut",
            });
            $("#doh").datepicker({
                format: "yyyy-mm-dd",
                autoclose: true
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
                    "url": App.baseUrl+"user/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "name" },
                    { "data": "role_name" },
                    { "data": "phone" },
                    { "data": "email" },
                    { "data": "nama_bank" },
                    { "data": "no_rekening" },
                    { "data": "action" ,"orderable": false}
                ]
            });

            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                     rules: {
                        nik: {
                            required: true,
                            minlength: 8,
                            maxlength: 32,
                            remote: {
                                url: App.baseUrl + "user/checkNIK",
                                type: "post",
                                data: {
                                    nik: function () {
                                        return $("#nik").val();
                                    },
                                    id: function () {
                                        return $("#user_id").val();
                                    },
                                }
                            }
                        },
                        name: {
                            required: true
                        },
                        email: {
                            required: true
                        },
                        phone: {
                            maxlength: 13
                        },
                        nama_bank: {
                            required: true
                        },
                        no_rekening: {
                            required: true
                        },
                        password: {
                            required: ($("#user_id").length <= 0),
                            minlength: 8
                        },
                        password_confirm: {
                            required: ($("#user_id").length <= 0),
                            minlength: 8,
                            equalTo: "#password"
                        },
                        role_id: {
                             required: ($("#user_id").length <= 0),
                        },
                    },
                    messages: {
                        name: {
                            required: "Nama Pengguna Harus Diisi"
                        },
                        email: {
                            required: "Email Harus Diisi"
                        },
                        phone: {
                            maxlength: "Maximal 13"
                        },
                        nama_bank: {
                            required: "Nama Bank Harus Diisi"
                        },
                        no_rekening: {
                            required: "No. Rekening Harus Diisi"
                        },
                        password: {
                            required: "Kata Sandi Harus Diisi",
                            minlength: "Kata Sandi Minimal 8 Karakter"
                        },
                        password_confirm: {
                            required: "Ulangi Kata Sandi Harus Diisi",
                            minlength: "Kata Sandi Minimal 8 Karakter",
                            equalTo: "Kata Sandi Tidak Sama"
                        },
                        role_id: {
                            required: "Nama Jabatan Harus Dipilih"
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

        searchTable:function(){
            $('#search').on('click', function () {
                console.log("SEARCH");
                var name = $("#name").val();
                var company_field = $("#company").val();
                var phone = $("#phone").val();
                var email = $("#email").val();

                App.table.column(3).search(name,true,true);
                App.table.column(4).search(phone,true,true);
                App.table.column(5).search(email,true,true);

                App.table.draw();

            });
        },
        resetSearch:function(){
            $('#reset').on( 'click', function () {
                $("#name").val("");
                $("#company").val("");
                $("#handphone").val("");
                $("#email").val("");

                App.table.search( '' ).columns().search( '' ).draw();
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
