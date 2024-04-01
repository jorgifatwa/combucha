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
        total_fix: [],
        init: function () {
            App.initFunc();
            App.initTable();
            App.initValidation();
            App.initConfirm();
            App.initEvent();
            App.scanBarang();
            App.changeGudang();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            $('#id_barang').select2({
                width: "100%",
                placeholder: "Pilih Barang",
            });
            if($('#role').val() == 3){
                $('#id_marketplace').select2({
                    width: "100%",
                    placeholder: "Pilih Barang",
                });
            }
            var role = $('#role').val();
            if(role == 1){
                $('#id_gudang').select2({
                    width: "100%",
                    placeholder: "Pilih Gudang",
                });
                $('#id_gudang_lihat').select2({
                    width: "100%",
                    placeholder: "Pilih Gudang",
                });
            }
        },
        changeGudang : function(){
            $('#id_gudang_lihat').on('change', function () {
                var id_gudang = $(this).val();

                console.log('id_gudang', id_gudang)
                $('.gudang-a').hide();
                $('.gudang-b').hide();

                if(App.table){
                    App.table.destroy();
                }

                if(App.table_stok){
                    App.table_stok.destroy();
                }

                // if ( $.fn.dataTable.isDataTable( '#table' ) ) {
                //     App.table.destroy();
                // }
    
                // if ( $.fn.dataTable.isDataTable( '#table-stok' ) ) {
                //     App.table_stok.destroy();
                // }
                
                App.table_stok =
                $('#table-stok').DataTable({
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
                        "url": App.baseUrl+"barang_masuk/dataListStok",
                        "dataType": "json",
                        "type": "POST",
                        "data": {id_gudang:id_gudang},
                    },
                    "columns":  [
                        { "data": "barang_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "total_barang" },
                    ]
                });
                if(id_gudang == 1){
                    var data_column = [
                        { "data": "barang_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "gudang_name" },
                        { "data": "jumlah" },
                        { "data": "tanggal" },
                        { "data": "action" ,"orderable": false}
                    ];
                    $('.gudang-a').show();

                    App.table = 
                    $('#table-gudang-a').DataTable({
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
                            "url": App.baseUrl+"barang_keluar/dataList",
                            "dataType": "json",
                            "type": "POST",
                            "data": {id_gudang:id_gudang},
                        },
                        "columns": data_column
                    });
                }else if(id_gudang == 2){
                    var data_column = [
                        { "data": "barang_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "marketplace_name" },
                        { "data": "jumlah" },
                        { "data": "tanggal" },
                        { "data": "action" ,"orderable": false}
                    ];
                    $('.gudang-b').show();
                    
                    App.table = 
                    $('#table-gudang-b').DataTable({
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
                            "url": App.baseUrl+"barang_keluar/dataList",
                            "dataType": "json",
                            "type": "POST",
                            "data": {id_gudang:id_gudang},
                        },
                        "columns": data_column
                    });
                }
                $('.data-stok-barang').removeClass('d-none');
                $('.data-barang-keluar').removeClass('d-none');
            });
        },
        scanBarang : function(){
            var i = -1;
            $('#kode_barang').on('change', function () {
                var kode_barang = $(this).val();
                $.ajax({
                    url: App.baseUrl+'barang_keluar/getBarang',
                    type: 'POST',
                    data: {kode_barang: kode_barang},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);
                    if(data.status == true){
                        i++;
                        var data_barang = data.data.barang;
                        var data_warna = data.data.warna;
                        var harga = new Intl.NumberFormat('de-DE').format(data_barang[0].harga_jual_biasa);
                        var html = `<div class="row control-group col-md-12">
                        <div class="col-md-2">
                            <div class="form-group">
                                <label for="">Nama Barang</label>
                                <input type="text" name="nama_barang[]" placeholder="Nama Barang" class="form-control" readonly value="`+data_barang[0].nama+`">
                                <input type="hidden" name="id_barang[]" id="id_barang_${i}" placeholder="Nama Barang" class="form-control" readonly value="`+data_barang[0].id+`">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-group">
                                <label for="">Harga Barang</label>
                                <input type="text" name="nama_barang[]" placeholder="Nama Barang" id="harga_${i}"class="form-control" readonly value="Rp. `+harga+`">
                            </div>
                        </div>
                        <div class="col-md-2" id="warna_${i}">
                            <div class="form-group">
                                <label for="">Warna</label>
                                <select name="id_warna[]" id="id_warna_${i}" index="${i}" class="form-control select_warna">`;
                                var option = "";
                                for (var index = 0; index < data_warna.length; index++) {
                                        option += "<option value="+data_warna[index].id_warna+"> "+data_warna[index].warna_name+"</option>";
                                }
                                html += option;
                                html += `</select>
                            </div>
                        </div>
                        <div class="col-md-2 ukuran_${i}">
                            <div class="form-group">
                                <label for="">Ukuran</label>
                                <select name="ukuran[]" id="ukuran_${i}" class="form-control select_ukuran">
                                    <option value="">Pilih Ukuran</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="">Jumlah</label>
                                <div class="row">
                                    <input type="number" class="form-control col-md-9" name="jumlah[]" id="jumlah_`+i+`" index="${i}" placeholder="Jumlah">
                                    <button type="button" class="btn btn-danger col-md-2 ml-2 remove" index="${i}"><span class="fa fa-trash"></span></button>
                                </div>
                            </div>
                        </div>
                        </div>`;
                        $(".data-barang").append(html);
                        $('#id_warna_'+i).on('change', function () {
                            var id_warna = $(this).val();
                            var id_barang = $('#id_barang_'+i).val();
                            console.log('asdfasldfhasjk')
                            $.ajax({
                                method: "POST",
                                url: App.baseUrl+'barang_keluar/getUkuran',
                                data : {id_barang : id_barang, id_warna: id_warna}
                            }).done(function( data ) {
                                var data = JSON.parse(data);
                                var data_ukuran = data.data.ukuran;
                                console.log('data_ukura', data_ukuran);

                                var html = `<div class="form-group">
                                    <label for="">Ukuran</label>
                                    <select name="ukuran[]" id="ukuran_${i}" class="form-control select_ukuran">
                                `;
                                var option = "";
                                for (var index = 0; index < data_ukuran.length; index++) {
                                        option += "<option value="+data_ukuran[index].ukuran+"> "+data_ukuran[index].ukuran+"</option>";
                                }
                                html += option;
                                html += `</select>
                                    </div>
                                `;
                                $('.ukuran_'+i).html(html)
                                $('#ukuran_'+i).select2({
                                    width: "100%",
                                    placeholder: "Pilih Ukuran",
                                });
                            })
                            
                        })
                        $('#id_warna_'+i).trigger('change');
                        $('#ukuran_'+i).select2({
                            width: "100%",
                            placeholder: "Pilih Ukuran",
                        });
                        $('#id_warna_'+i).select2({
                            width: "100%",
                            placeholder: "Pilih Ukuran",
                        });
                        $('#jumlah_'+i).on('change', function () {
                            var jumlah = $(this).val();
                            var id = data_barang[0].id;
                            var indexx = $(this).attr('index');
                            var ukuran = $('#ukuran_'+indexx).val();
                            var id_warna = $('#id_warna_'+indexx).val();
                           
                            $.ajax({
                                url: App.baseUrl+'barang_keluar/cekStock',
                                type: 'POST',
                                data: {jumlah: jumlah, id:id, ukuran: ukuran, id_warna: id_warna},
                            })
                            .done(function( response ) {
                                var data = JSON.parse(response);
                                
                                if(data.status == true){
                                    var total = $('#total').val();
                                    total = parseInt(total);

                                    App.total_fix[indexx] = jumlah * data_barang[0].harga_jual_biasa;

                                    var sum = 0;
        
                                    for (var index = 0; index < App.total_fix.length; index++) {
                                        sum += App.total_fix[index];
                                    }

                                    $('.total').html('Rp.'+App.numberWithCommas(sum));
                                    $('#total').val(sum);
                                }else{
                                    toastr.error(data.message);
                                }
                            });
                        })
                    }else{
                        toastr.error(data.message);
                    }
                })
                .fail(function(msg) {
                    console.log('error');
                });
            })
      
            // saat tombol remove dklik control group akan dihapus 
            $(".content").on("click",".remove",function(){ 
                var index = $(this).attr('index');
                var sum = 0;
                App.total_fix[index] = 0;
                console.log('hapus', App.total_fix)

                for (var index_total = 0; index_total < App.total_fix.length; index_total++) {
                    // if(index_total == index){
                    //     App.total_fix[index_total] = 0;
                    // }else{
                        sum += App.total_fix[index_total];
                    // }
                }

                $('.total').html('Rp.'+App.numberWithCommas(sum));
                $('#total').val(sum);
                $(this).parents(".control-group").remove();
            });
        },

        numberWithCommas : function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        initTable : function(){
            if($('#role').val() != 1){
                if($('#role').val() == 2){
                    var data_column =  [
                        { "data": "barang_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "gudang_name" },
                        { "data": "jumlah" },
                        { "data": "tanggal" },
                    ]
                }else if($('#role').val() == 3){
                    var data_column =  [
                        { "data": "barang_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "marketplace_name" },
                        { "data": "jumlah" },
                        { "data": "tanggal" },
                    ]
                }else{
                    var data_column =  [
                        { "data": "barang_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "jumlah" },
                        { "data": "tanggal" },
                        { "data": "action" ,"orderable": false}
                    ]
                }
                App.table = $('#table-stok').DataTable({
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
                        "url": App.baseUrl+"barang_masuk/dataListStok",
                        "dataType": "json",
                        "type": "POST",
                    },
                    "columns":  [
                        { "data": "barang_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "total_barang" },
                    ]
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
                        "url": App.baseUrl+"barang_keluar/dataList",
                        "dataType": "json",
                        "type": "POST",
                    },
                    "columns": data_column
                });
            }
            
        },
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        nama: {
                            required: true
                        },
                        stock: {
                            required: true
                        },
                        harga_modal: {
                            required: true
                        },
                        harga_jual_biasa: {
                            required: true
                        },
                        harga_jual_grosir: {
                            required: true
                        },
                    },
                    messages: {
                        nama: {
                            required: "Nama Harus Di isi"
                        },
                        stock: {
                            required: "Stock Harus Di isi"
                        },
                        harga_modal: {
                            required: "Harga Modal Harus Di isi"
                        },
                        harga_jual_biasa: {
                            required: "Harga Jual Biasa Harus Di isi"
                        },
                        harga_jual_grosir: {
                            required: "Harga Jual Grosir Harus Di isi"
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
            $('#table-gudang-a tbody').on( 'click', '.delete', function () {
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
                            App.table_stok.ajax.reload(null, true);
                            App.table.ajax.reload(null, true);
                        }
                    });
                })
            });
            $('#table-gudang-b tbody').on( 'click', '.delete', function () {
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
                            App.table_stok.ajax.reload(null, true);
                            App.table.ajax.reload(null, true);
                        }
                    });
                })
            });
        }
	}
});
