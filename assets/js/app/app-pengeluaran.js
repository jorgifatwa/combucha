define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr"
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    jqvalidate,
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
            App.changeTotal();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            var harga = $('#harga').val();
            var jumlah_pax = $('#jumlah_pax').val();

            if(harga){
                var value_harga = formatRupiah($('#harga').val());
                $('#harga').val(value_harga);
            }
            
            if(jumlah_pax){
                var value_jumlah_pax = formatRupiah($('#jumlah_pax').val());
                $('#jumlah_pax').val(value_jumlah_pax);
            }

            if(harga && jumlah_pax){
                var input_harga = $('#harga').val();
                var input_jumlah = $('#jumlah_pax').val();
                var jumlah_pax = getNumericValue(input_jumlah);
                var harga = getNumericValue(input_harga);
                
                if(!jumlah_pax){
                    jumlah_pax = 0;
                }else if(!harga){
                    harga = 0;
                }
                
                var total = parseInt(harga) * parseInt(jumlah_pax)
                
                total = formatRupiah(total.toString())

                $('#total_keseluruhan').val(total);
            }

            function getNumericValue(inputText) {
                let result = inputText.replace(/[^\d]/g, ''); // Remove everything except digits
                let integerValue = parseFloat(result); // Convert the result to an integer
                return integerValue;
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
                    "url": App.baseUrl+"pengeluaran/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "harga" },
                    { "data": "jumlah" },
                    { "data": "total" },
                    { "data": "keterangan" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        changeTotal : function(){
            $('#harga').keyup(function (event) {
                var input_harga = $('#harga').val();
                var input_jumlah = $('#jumlah_pax').val();
                var jumlah_pax = getNumericValue(input_jumlah);
                var harga = getNumericValue(input_harga);
                
                if(!jumlah_pax){
                    jumlah_pax = 0;
                }
                
                var total = parseInt(harga) * parseInt(jumlah_pax)
                
                total = formatRupiah(total.toString())

                $('#total_keseluruhan').val(total);

                var value = formatRupiah($(this).val());
                $(this).val(value);
            });

            $('#jumlah_pax').keyup(function (event) {
                var input_jumlah = $(this).val();
                var input_harga = $('#harga').val();
                var jumlah_pax = getNumericValue(input_jumlah);
                var harga = getNumericValue(input_harga);

                if(!harga){
                    harga = 0;
                }
                
                var total = parseInt(harga) * parseInt(jumlah_pax)
                
                total = formatRupiah(total.toString())

                $('#total_keseluruhan').val(total);
                
                var value = formatRupiah($(this).val());
                $(this).val(value);
            });

            function getNumericValue(inputText) {
                let result = inputText.replace(/[^\d]/g, ''); // Remove everything except digits
                let integerValue = parseFloat(result); // Convert the result to an integer
                return integerValue;
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
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        tanggal: {
                            required: true
                        },
                        harga: {
                            required: true
                        },
                        jumlah: {
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
                        harga: {
                            required: "Harga Harus Diisi"
                        },
                        jumlah: {
                            required: "Jumlah Harus Diisi"
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
