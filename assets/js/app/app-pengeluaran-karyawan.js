define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr",
    "select2",
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    jqvalidate,
    toastr,
    select2
    ) {
    return {
        table:null,
        init: function () {
            App.initFunc();
            App.initTable();
            App.initValidation();
            App.initConfirm();
            App.initEvent();
            App.changeTotal();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            var harga = $('#harga').val();

            $('#karyawan_id').select2({
                width: "100%",
                placeholder: "Pilih Karyawan",
            }); 

            if(harga){
                var value_harga = formatRupiah($('#harga').val());
                $('#harga').val(value_harga);
            }

            function formatRupiah(angka, prefix)
            {
                var number_string = angka.replace(/[^,\d]/g, '').toString(),
                    split    = number_string.split(','),
                    sisa     = split[0].length % 3,
                    rupiah     = split[0].substr(0, sisa),
                    ribuan     = split[0].substr(sisa).match(/\d{3}/gi);
                    
                if (ribuan) {
                    separator = sisa ? '.' : '';
                    rupiah += separator + ribuan.join('.');
                }
                
                rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
                return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
            }
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
                    "url": App.baseUrl+"pengeluaran_karyawan/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "nama_karyawan" },
                    { "data": "harga" },
                    { "data": "keterangan" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        changeTotal : function(){
            $('#harga').keyup(function (event) {
                var value = formatRupiah($(this).val());
                $(this).val(value);
            });

            function formatRupiah(angka, prefix)
            {
                var number_string = angka.replace(/[^,\d]/g, '').toString(),
                    split    = number_string.split(','),
                    sisa     = split[0].length % 3,
                    rupiah     = split[0].substr(0, sisa),
                    ribuan     = split[0].substr(sisa).match(/\d{3}/gi);
                    
                if (ribuan) {
                    separator = sisa ? '.' : '';
                    rupiah += separator + ribuan.join('.');
                }
                
                rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
                return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
            }
        },
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        tanggal: {
                            required: true
                        },
                        karyawan_id: {
                            required: true
                        },
                        harga: {
                            required: true
                        },
                        keterangan: {
                            required: true
                        },
                    },
                    messages: {
                        tanggal: {
                            required: "Tanggal Harus Diisi"
                        },
                        karyawan_id: {
                            required: "Karyawan Harus Diisi"
                        },
                        harga: {
                            required: "Harga Harus Diisi"
                        },
                        keterangan: {
                            required: "Keterangan Harus Diisi"
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
