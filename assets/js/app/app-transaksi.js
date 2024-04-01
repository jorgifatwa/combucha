define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr",
    "select2"
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
        table_biaya:null,
        table_transaksi:null,
        init: function () {
            App.initFunc();
            App.initTable();
            App.initValidation();
            App.initConfirm();
            App.initEvent();
            App.changeTotal();
            App.changeNoFlight();
            App.kirimBiaya();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            $('#travel_id').select2({
                width: "100%",
                placeholder: "Pilih Travel",
            });  
            $('#status').select2({
                width: "100%",
                placeholder: "Pilih Status",
            });  

            $('#bulan').select2({
                width: "100%",
                placeholder: "Pilih Bulan",
            });  

            var harga = $('#harga').val();
            var jumlah_pax = $('#jumlah_pax').val();
            var fee_tl = $('#fee_tl').val();

            if(harga){
                var value_harga = formatRupiah($('#harga').val());
                $('#harga').val(value_harga);
            }

            if(fee_tl){
                var value_harga = formatRupiah($('#fee_tl').val());
                $('#fee_tl').val(value_harga);
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

            $('.btn-tambah-biaya').on('click', function () {
                $('#action').val('tambah');
                $('#list_data').addClass('d-none');
                $('.btn-kembali').removeClass('d-none');
                $('#form_biaya').removeClass('d-none');
            })
        },
        changeNoFlight : function () {
            $('#no_flight').on('input', function() {
                // Get the current value of the input
                let currentInputValue = $(this).val();
                
                // Convert the input value to uppercase
                let uppercaseValue = currentInputValue.toUpperCase();
                
                // Set the input value to the uppercase version
                $(this).val(uppercaseValue);
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

            $('#fee_tl').keyup(function (event) {
                var value = formatRupiah($(this).val());
                $(this).val(value);
            });

            $('#fee').keyup(function (event) {
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
        kirimBiaya : function(){
                $("#save-btn").removeAttr("disabled");
                $("#form_biaya_tambahan").validate({
                    rules: {
                        tanggal: {
                            required: true
                        },
                        flight: {
                            required: true
                        },
                        harga: {
                            required: true
                        },
                        fee: {
                            required: true
                        },
                        jumlah: {
                            required: true
                        },
                        fee: {
                            required: true
                        },
                        keterangan: {
                            required: true
                        },
                        status: {
                            required: true
                        },
                    },
                    messages: {
                        tanggal: {
                            required: "Tanggal Harus Diisi"
                        },
                        flight: {
                            required: "Flight Harus Diisi"
                        },
                        harga: {
                            required: "Harga Harus Diisi"
                        },
                        fee: {
                            required: "Fee Harus Diisi"
                        },
                        jumlah: {
                            required: "Jumlah Harus Diisi"
                        },
                        keterangan: {
                            required: "Keterangan Harus Diisi"
                        },
                        status: {
                            required: "Status Harus Dipilih"
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

                $('.btn-export').on('click', function () {
                    htmlContent = $('.file-pdf').html(); 
                    $.ajax({
                        url: App.baseUrl+'transaksi/generate_pdf',
                        method: 'POST',
                        data: { htmlContent: htmlContent },
                        success: function() {
                            window.location.href = 'index.php/pdfcontroller/output.pdf';
                        }
                    });
                })

                $(".btn-kirim").on("click", function() {
                    if ($("#form_biaya_tambahan").valid()) {

                        $("#form_biaya").addClass('d-none');
                        $(".loading-spinner").show();
                        var url = "";
                        var action = $('#action').val();
                        if(action == 'tambah'){
                            url = "biaya_tambahan/create"
                        }else{
                            url = "biaya_tambahan/edit"
                        }
                        $.ajax({
                            type: "POST",
                            url: App.baseUrl + url, // Replace with your server-side endpoint
                            data: $("#form_biaya_tambahan").serialize(), // Serialize the form data
                            success: function (response) {
                                var data = JSON.parse(response);
                                if(data.status_data == true){
                                    toastr.success(data.msg);
                                    App.table_biaya.ajax.reload(null, true);
                                    $('.btn-kembali').addClass('d-none');
                                    $('#list_data').removeClass('d-none');
                                    $("#status").val('').trigger("change"); 
                                    $("#form_biaya_tambahan :input").not("#id_transaksi").val('');
                                }else{
                                    $("#form_biaya").removeClass('d-none');
                                    toastr.error(data.msg);
                                }
                                
                                $(".loading-spinner").hide();
                            },
                            error: function (error) {
                                // Handle error response

                                // Introduce a delay of 2000 milliseconds (2 seconds) before hiding the spinner
                                setTimeout(function () {
                                    $(".loading-spinner").hide();
                                }, 2000);
                            }
                        });
                    }
                });

                $('.btn-kembali').on('click', function () {
                    $("#status").val('').trigger("change"); 
                    $("#form_biaya_tambahan :input").not("#id_transaksi").val('');
                    $("#form_biaya").addClass('d-none');
                    $(".btn-kembali").addClass('d-none');
                    $('#list_data').removeClass('d-none');
                })

                $('.btn-tutup').on('click', function () {
                    location.reload();
                })
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
                    "url": App.baseUrl+"transaksi/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal_keberangkatan" },
                    { "data": "no_flight" },
                    { "data": "nama_travel" },
                    { "data": "harga" },
                    { "data": "jumlah_pax" },
                    { "data": "status" },
                    { "data": "keterangan" },
                { "data": "nama_karyawan" },
                    { "data": "action" ,"orderable": false}
                ]
            });

            App.table_transaksi = $('#table-belum-lunas').DataTable({
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
                    "url": App.baseUrl+"transaksi/belum_lunas_list",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal_keberangkatan" },
                    { "data": "no_flight" },
                    { "data": "nama_travel" },
                    { "data": "harga" },
                    { "data": "jumlah_pax" },
                    { "data": "status" },
                    { "data": "keterangan" },
                { "data": "nama_karyawan" },
                    { "data": "action" ,"orderable": false}
                ]
            });

            var id_transaksi = $('#id_transaksi').val();
            App.table_biaya = $('#table-biaya').DataTable({
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
                    "url": App.baseUrl+"biaya_tambahan/dataList/"+id_transaksi,
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "flight" },
                    { "data": "harga" },
                    { "data": "jumlah" },
                    { "data": "fee" },
                    { "data": "keterangan"},
                    { "data": "status"},
                    { "data": "action" ,"orderable": false}
                ]
            });

            $('#btn-cari').on('click', function () {
                var bulan = $("#bulan").val();
                var travel_id = $("#travel_id").val();

                App.table_transaksi.column(0).search(bulan,true,true);
                App.table_transaksi.column(2).search(travel_id,true,true);

                App.table_transaksi.draw();

                App.bulan = $('#bulan').val();
                App.travel_id = $('#travel_id').val();
            })
            $('#btn-reset').on('click', function () {
                $("#bulan").val('').trigger('change');  // Clear and trigger change for Select2
                $("#travel_id").val('').trigger('change');  // Clear and trigger change for Select2

                App.table_transaksi.search( '' ).columns().search( '' ).draw();
            })
        },
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        tanggal_keberangkatan: {
                            required: true
                        },
                        no_flight: {
                            required: true
                        },
                        travel_id: {
                            required: true
                        },
                        harga: {
                            required: true
                        },
                        jumlah_pax: {
                            required: true
                        },
                        flight: {
                            required: true
                        },
                        fee_tl: {
                            required: true
                        },
                        keterangan_tambahan: {
                            required: true
                        },
                        status: {
                            required: true
                        },
                    },
                    messages: {
                        tanggal_keberangkatan: {
                            required: "Tanggal Keberangkatan Harus Diisi"
                        },
                        no_flight: {
                            required: "No. Flight Keberangkatan Harus Diisi"
                        },
                        travel_id: {
                            required: "Travel Harus Dipilih"
                        },
                        harga: {
                            required: "Harga Harus Diisi"
                        },
                        jumlah_pax: {
                            required: "Jumlah Pax Harus Diisi"
                        },
                        fee_tl: {
                            required: "Fee TL Pax Harus Diisi"
                        },
                        flight: {
                            required: "Flight Pax Harus Diisi"
                        },
                        keterangan_tambahan: {
                            required: "Keterangan Tambahan Harus Diisi"
                        },
                        status: {
                            required: "Status Harus Dipilih"
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

            $('#table-biaya tbody').on( 'click', '.delete', function () {
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
                            App.table_biaya.ajax.reload(null, true);
                        }
                    });
                })
            });
            
            $('#table-biaya tbody').on( 'click', '.btn-ubah', function () {
                var url = $(this).attr("url");
                $('#action').val('ubah');
                var id_transaksi = $('#id_transaksi').val();
                $.ajax({
                    method: "GET",
                    url: url,
                    data: id_transaksi,
                }).done(function( response ) {
                    var data = JSON.parse(response);
                    $('#flight').val(data.flight);
                    $('#tanggal').val(data.tanggal);
                    $('#harga').val(formatRupiah(data.harga));
                    $('#jumlah_pax').val(formatRupiah(data.jumlah));
                    $('#fee').val(formatRupiah(data.fee));
                    $('#keterangan').val(data.keterangan);
                    $("#status").val(data.status).trigger("change"); 
                    $('#id').val(data.id);

                    var input_harga = $('#harga').val();
                    var input_jumlah = $('#jumlah_pax').val();
                    var input_fee = $('#fee').val();
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

                    $('#form_biaya').removeClass('d-none');
                    $('.btn-kembali').removeClass('d-none');
                    $('#list_data').addClass('d-none');

                    $()
                });
            });

            $('.btn-lunas').on( 'click', function () {
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
                            location.reload();                            
                        }
                    });
                })
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
        }
	}
});
