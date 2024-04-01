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
            App.initValidation();
            App.initConfirm();
            App.changeBarang();
            App.changeUkuran();
            App.initTable();
            App.changeGudang();
            App.initEvent();
            App.addBarang();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            $('#id_warna').select2({
                width: "100%",
                placeholder: "Pilih Warna",
            });
            $('#ukuran').select2({
                width: "100%",
                placeholder: "Pilih Ukuran",
            });
            $('#id_gudang_lihat').select2({
                width: "100%",
                placeholder: "Pilih Gudang",
            });
            $('#id_koli').select2({
                width: "100%",
                placeholder: "Pilih Koli",
            });
            var role = $('#role').val();
            if(role == 1){
                $('#id_gudang').select2({
                    width: "100%",
                    placeholder: "Pilih Gudang",
                });
            }
            $('#id_barang').trigger('change');
        },
        changeGudang : function(){
            $('#id_gudang_lihat').on('change', function () {
                var id_gudang = $(this).val();
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
                        { "data": "koli_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "jumlah_koli" },
                        { "data": "jumlah_barang" },
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
                            "url": App.baseUrl+"barang_masuk/dataList",
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
                        { "data": "jumlah_barang" },
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
                            "url": App.baseUrl+"barang_masuk/dataList",
                            "dataType": "json",
                            "type": "POST",
                            "data": {id_gudang:id_gudang},
                        },
                        "columns": data_column
                    });
                }
                $('.data-stok-barang').removeClass('d-none');
                $('.data-barang-masuk').removeClass('d-none');
            });
        },
        changeBarang : function(){
            $('#id_barang').on('change', function () {
                var id_barang = $(this).val();
                console.log('masuk');
                $.ajax({
                    method: "POST",
                    url: App.baseUrl+'barang_masuk/getDataWarnaUkuran',
                    data : {id_barang : id_barang}
                }).done(function( data ) {
                    var data = JSON.parse(data);
                    var data_ukuran = data.data.ukuran;
                    var data_warna = data.data.warna;
                    var html = `
                        <div class="form-group">
                            <label for="">Warna</label>
                            <select name="id_warna[]" id="id_warna" class="form-control select_warna">
                    `;
                    var option = "";
                    for (var index = 0; index < data_warna.length; index++) {
                            option += "<option value="+data_warna[index].id_warna+"> "+data_warna[index].warna_name+"</option>";
                    }
                    html += option;
                    html += `</select>
                        </div>
                    `;
                    
                    $('.warna').html(html);
                    $('#id_warna').select2({
                        width: "100%",
                        placeholder: "Pilih Warna",
                    });

                    var html = `
                    <div class="form-group">
                        <label for="">Ukuran</label>
                        <select name="ukuran[]" id="ukuran" class="form-control select_ukuran">
                    `;
                    var option = "";
                    for (var index = 0; index < data_ukuran.length; index++) {
                            option += "<option value="+data_ukuran[index].ukuran+"> "+data_ukuran[index].ukuran+"</option>";
                    }
                    html += option;
                    html += `</select>
                        </div>
                    `;
                    
                    $('.ukuran').html(html);
                    $('#ukuran').select2({
                        width: "100%",
                        placeholder: "Pilih Ukuran",
                    });

                    var html = `
                    <div class="form-group">
                        <label for="">Ukuran</label>
                        <select name="ukuran2[]" id="ukuran2" class="form-control select_ukuran">
                    `;
                    var option = "";
                    for (var index = 0; index < data_ukuran.length; index++) {
                            option += "<option value="+data_ukuran[index].ukuran+"> "+data_ukuran[index].ukuran+"</option>";
                    }
                    html += option;
                    html += `</select>
                        </div>
                    `;
                    
                    $('.ukuran-2').html(html);
                    $('#ukuran2').select2({
                        width: "100%",
                        placeholder: "Pilih Ukuran",
                    });
                });
            })
        },
        changeUkuran : function() {
          
        },
        addBarang : function(){
            var i = 1;
            $("#kode_barang").on('change', function(){
                var kode_barang = $(this).val();
                $.ajax({
                    method: "POST",
                    url: App.baseUrl+'barang_masuk/getData',
                    data: {kode_barang: kode_barang}
                }).done(function( msg ) {
                    i++;
                    var data = JSON.parse(msg);
                    if(data.status == true){
                        var data_barang = data.data.barang;
                        var data_gudang = data.data.gudang;
                        var data_koli = data.data.koli;
                        var role = $('#role').val();
    
                        var html = `<div class="row control-group col-12">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="">Nama Barang</label>
                                <input type="hidden" class="form-control" name="id_barang[]" id="id_barang_${i}" value="${data_barang[0].id_barang}">
                                <input type="text" class="form-control" name="nama_barang[]" value="${data_barang[0].barang_name}" readonly>
                            </div>
                        </div>
                        <div class="col-md-2 warna_${i}">
                            <div class="form-group">
                                <label for="">Warna</label>
                                <select name="id_warna[]" id="id_warna_${i}" class="form-control select_warna">
                                    <option value="">Pilih Warna</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-2 ukuran_${i}">
                            <div class="form-group">
                                <label for="">Ukuran</label>
                                <select name="ukuran[]" id="ukuran_${i}" class="form-control select_ukuran">
                                    <option value="">Pilih Ukuran</option>
                                </select>
                            </div>
                        </div>`;
                        if(role == 1){
                            html += `<div class="col-md-2">
                                <div class="form-group">
                                    <label for="">Gudang</label>
                                    <select name="id_gudang[]" id="id_gudang_`+i+`" class="form-control select_gudang">`;
                            var option = "";
                            for (var index = 0; index < data_gudang.length; index++) {
                                        option += "<option value="+data_gudang[index].id+"> "+data_gudang[index].nama+"</option>";
                            }
                            html += option;
                            html += `</select>
                                </div>
                            </div>`;
                        }
                        if(role == 1){
                            html += `<div class="col-md-2">`;
                        }else{
                            html += `<div class="col-md-2">`;
                        }
                            html += `<div class="form-group">
                                <label for="">Koli</label>
                                <select name="id_koli[]" id="id_koli_`+i+`" class="form-control select_koli">
                        `;
                        var option = "";
                        for (var index = 0; index < data_koli.length; index++) {
                                option += "<option value="+data_koli[index].id+"> "+data_koli[index].nama+"</option>";
                        }
                        html += option;
                        html += `</select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="">Jumlah Koli</label>
                                <div class="row">
                                    <input type="number" class="form-control col-md-12" name="jumlah[]" id="jumlah_${i}" placeholder="Jumlah Koli">
                                </div>
                            </div>
                        </div>
                        <div class="row col-12">
                            <div class="col-md-12">
                                <div class="form-group">
                                <label for="">&nbsp;</label>
                                    <button type="button" class="btn btn-danger col-md-12 remove"><span class="fa fa-trash"></span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                        $(".data-barang").append(html);
                        if(role == 1){
                            $('#id_gudang_'+i).select2({
                                width: "100%",
                                placeholder: "Pilih Gudang",
                            });
                        }
                        $('#id_koli_'+i).select2({
                            width: "100%",
                            placeholder: "Pilih Koli",
                        });
                        $('#id_barang_'+i).on('change', function () {
                            var id_barang = $(this).val();
                            $.ajax({
                                method: "POST",
                                url: App.baseUrl+'barang_masuk/getDataWarna',
                                data : {id_barang : id_barang}
                            }).done(function( data ) {
                            var data = JSON.parse(data);
                                var data_warna = data.data.warna;
                                var html = `
                                    <div class="form-group">
                                        <label for="">Warna</label>
                                        <select name="id_warna[]" id="id_warna_${i}" class="form-control select_warna">
                                `;
                                var option = "";
                                for (var index = 0; index < data_warna.length; index++) {
                                        option += "<option value="+data_warna[index].id_warna+"> "+data_warna[index].warna_name+"</option>";
                                }
                                html += option;
                                html += `</select>
                                    </div>
                                `;
                                
                                $('.warna_'+i).html(html);
                                $('#id_warna_'+i).select2({
                                    width: "100%",
                                    placeholder: "Pilih Warna",
                                });
            
                                $('#id_warna_'+i).on('change', function () {
                                    var id_warna = $(this).val();
                                    var id_barang = $('#id_barang_'+i).val();
                                    console.log('asdflkasdjf')
                                    $.ajax({
                                        method: "POST",
                                        url: App.baseUrl+'barang_masuk/getDataUkuran',
                                        data : {id_barang : id_barang, id_warna: id_warna}
                                    }).done(function( data ) {
                                        var data = JSON.parse(data);
                                        var data_ukuran = data.data.ukuran;
                                        console.log('data_ukura', data_ukuran);
    
                                        var html = `
                                        <div class="form-group">
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
                                        
                                        $('.ukuran_'+i).html(html);
                                        $('#ukuran_'+i).select2({
                                            width: "100%",
                                            placeholder: "Pilih Ukuran",
                                        });
    
                                        var html = `
                                        <div class="form-group">
                                            <label for="">Ukuran</label>
                                            <select name="ukuran2[]" id="ukuran2_${i}" class="form-control select_ukuran">
                                        `;
                                        var option = "";
                                        for (var index = 0; index < data_ukuran.length; index++) {
                                                option += "<option value="+data_ukuran[index].ukuran+"> "+data_ukuran[index].ukuran+"</option>";
                                        }
                                        html += option;
                                        html += `</select>
                                            </div>
                                        `;
                                        
                                        $('.ukuran-2_'+i).html(html);
                                        $('#ukuran2_'+i).select2({
                                            width: "100%",
                                            placeholder: "Pilih Ukuran",
                                        });
                                    })
                                    
                                })
    
                                $('#id_warna_'+i).trigger('change');
                            });
                        })
                        $('#id_barang_'+i).trigger('change');
                    }else{
                        toastr.error('Kode Barang Tidak Ditemukan!');
                    }
                });
            });
      
            // saat tombol remove dklik control group akan dihapus 
            $(".content").on("click",".remove",function(){ 
                $(this).parents(".control-group").remove();
            });
        },

        numberWithCommas : function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        initTable : function(){


            if($('#role').val() != 1){
                if($('#role').val() == 2){
                    var data_column = [
                        { "data": "barang_name" },
                        { "data": "koli_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "jumlah_koli" },
                        { "data": "jumlah_barang" },
                        { "data": "tanggal" },
                    ];
                }else if($('#role').val() == 3){
                    var data_column = [
                        { "data": "barang_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "jumlah_barang" },
                        { "data": "tanggal" },
                    ];
                }

                
                App.table = 
                $('#table').DataTable({
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
                        "url": App.baseUrl+"barang_masuk/dataList",
                        "dataType": "json",
                        "type": "POST",
                    },
                    "columns": data_column
                });
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
                    },
                    "columns":  [
                        { "data": "barang_name" },
                        { "data": "ukuran" },
                        { "data": "warna_name" },
                        { "data": "total_barang" },
                    ]
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
