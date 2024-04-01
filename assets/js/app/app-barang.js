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
        init: function () {
            App.initFunc();
            App.initTable();
            App.initValidation();
            App.initConfirm();
            App.initEvent();
            App.onChangeHargaJual();
            $(".loadingpage").hide();
        },
        onChangeHargaJual : function(){
            $('#harga_jual_biasa').keyup(function () {
                var harga_jual_biasa = $(this).val();
                $.ajax({
                    method: "POST",
                    url: App.baseUrl+'barang/getPPN',
                }).done(function( data ) {
                    var data = JSON.parse(data);
                    for (let i = 0; i < data.data.length; i++) {
                        var harga_marketplace = (data.data[i].ppn / 100) * harga_jual_biasa;
                        var total = harga_jual_biasa - harga_marketplace;
                        $('#harga_'+data.data[i].id).val(total);
                    }
                });
            })
        },
        initEvent : function(){
        },
        numberWithCommas : function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                "order": [[ 0, "asc" ]], //agar kolom id default di order secara desc
                "processing": true,
                "serverSide": true,
                "ajax":{
                    "url": App.baseUrl+"barang/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "nama" },
                    { "data": "harga_modal" },
                    { "data": "harga_jual_biasa" },
                    { "data": "harga_jual_campaign" },
                    { "data": "harga_jual_flash_sale" },
                    { "data": "harga_jual_bottom" },
                    { "data": "description" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        nama: {
                            required: true
                        },
                        harga_modal: {
                            required: true
                        },
                        harga_jual_biasa: {
                            required: true
                        },
                        harga_jual_campaign: {
                            required: true
                        },
                        harga_jual_flash_sale: {
                            required: true
                        },
                        harga_jual_bottom: {
                            required: true
                        },
                    },
                    messages: {
                        nama: {
                            required: "Nama Harus Di isi"
                        },
                        harga_modal: {
                            required: "Harga Modal Harus Di isi"
                        },
                        harga_jual_biasa: {
                            required: "Harga Jual Biasa Harus Di isi"
                        },
                        harga_jual_campaign: {
                            required: "Harga Jual Campaign Harus Di isi"
                        },
                        harga_jual_flash_sale: {
                            required: "Harga Jual Flash Sale Harus Di isi"
                        },
                        harga_jual_bottom: {
                            required: "Harga Jual Bottom Harus Di isi"
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
