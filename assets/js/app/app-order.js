define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "bootstrapDatetimepicker",
    "jqvalidate",
    "select2",
    "toastr"
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
        selected_paket: $("#selected_paket").val(),
        init: function () {
            App.initFunc();
            App.onChangePelayanan();
            App.onChangeRank();
            App.onChangePaket();
            App.onChangePoint();
            App.onChangeBintang();
            App.onChangeSampaiBintang();
            App.onChangeSampaiPoint();
            App.onChangeSampaiRank();
            App.onChangeMythicPoint();
            App.initTable();
            App.initValidation();
            App.initConfirm();
            App.initEvent();
            App.resetSearch();
            App.searchTable();
            $(".loadingpage").hide();
        },
        searchTable: function(){
            $('#btn-filter').on('click', function () {
                var status = $("#status").val();
                var tanggal = $("#tanggal").val();

                App.table.column(1).search(tanggal,true,true);
                App.table.column(11).search(status,true,true);

                App.table.draw();

                App.status = $('#status').val();
                App.tanggal = $('#tanggal').val();
            });
        },
        resetSearch:function(){
            $("#reset").on('click', function () {
                $("#tanggal").val("");
                $("#status").val("").trigger("change");
                App.table.search( '' ).columns().search( '' ).draw();
            });
        },
        initEvent : function(){
            $('#id_pelayanan').select2({
                width: "100%",
                placeholder: "Pilih Pelayanan",
            });
            $('#id_paket').select2({
                width: "100%",
                placeholder: "Pilih Paket",
            });
            $('#rank').select2({
                width: "100%",
                placeholder: "Pilih Rank",
            });
            $('#sampai_rank').select2({
                width: "100%",
                placeholder: "Pilih Rank",
            });
            $('#status').select2({
                width: "100%",
                placeholder: "Pilih Status",
            });
            $('#tanggal').datetimepicker({
                format: 'DD-MM-YYYY'
            });
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
                    "url": App.baseUrl+"order/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "no_faktur" },
                    { "data": "tanggal" },
                    { "data": "paket_name" },
                    { "data": "nomor_whatsapp"},
                    { "data": "joki_name"},
                    { "data": "status_orderan"},
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        id_pelayanan: {
                            required: true
                        },
                        id_paket: {
                            required: true
                        },
                        id_pelayanan: {
                            required: true
                        },
                        tanggal: {
                            required: true
                        },
                        email: {
                            required: true
                        },
                        password: {
                            required: true
                        },
                        request_hero: {
                            required: true
                        },
                        nickname: {
                            required: true
                        },
                        login_via: {
                            required: true
                        },
                        nomor_whatsapp: {
                            required: true
                        },
                    },
                    messages: {
                        id_pelayanan: {
                            required: "Pelayanan Harus Dipilih"
                        },
                        id_paket: {
                            required: "Paket Harus Dipilih"
                        },
                        id_pelayanan: {
                            required: "Pelayanan Harus Dipilih"
                        },
                        tanggal: {
                            required: "Tanggal Harus Di isi"
                        },
                        email: {
                            required: "Email Harus Di isi"
                        },
                        password: {
                            required: "Password Harus Di isi"
                        },
                        request_hero: {
                            required: "Request Hero Harus Di isi"
                        },
                        nickname: {
                            required: "Nickname Harus Di isi"
                        },
                        login_via: {
                            required: "Login Via Harus Di isi"
                        },
                        nomor_whatsapp: {
                            required: "Nomor Whatsapp Harus Di isi"
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
        },
        numberWithCommas : function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        onChangeTotalHarga: function(){
            var dari_rank = $('#rank').val();
            var dari_bintang = $('#bintang').val();
            var dari_point = $('#point').val();
            var sampai_rank = $('#sampai_rank').val();
            var sampai_bintang = $('#sampai_bintang').val();
            var sampai_point = $('#sampai_point').val();
            var mythic_point = $('#mythic_point').val();

            if(dari_rank == 11){
                if(dari_point != "" && mythic_point != ""){
                    $.ajax({
                        url: App.baseUrl+'order/getHargaMythicGlory',
                        type: 'POST',
                        data: {dari_rank: dari_rank, dari_point:dari_point, mythic_point: mythic_point},
                    })
                    .done(function( response ) {
                        var data = JSON.parse(response);
                        var harga = App.numberWithCommas(data.data)
                        $('#total_harga').val('Rp.'+harga);
                    })
                    .fail(function() {
                        console.log("error");
                    });
                }
            }else{
                if(dari_rank <= 5 && sampai_rank <=5){
                    if(dari_bintang != "" && sampai_bintang != ""){
                        $.ajax({
                            url: App.baseUrl+'order/getHargaBintang',
                            type: 'POST',
                            data: {dari_rank: dari_rank, sampai_rank: sampai_rank, dari_bintang: dari_bintang, sampai_bintang: sampai_bintang},
                        })
                        .done(function( response ) {
                            var data = JSON.parse(response);
                            var harga = App.numberWithCommas(data.data)
                            $('#total_harga').val('Rp.'+harga);
                        })
                        .fail(function() {
                            console.log("error");
                        });
                    }
                }else if(dari_rank > 5 && sampai_rank > 5){
                    if(dari_point != "" && sampai_point != ""){
                        $.ajax({
                            url: App.baseUrl+'order/getHargaPoint',
                            type: 'POST',
                            data: {dari_rank: dari_rank, sampai_rank: sampai_rank, dari_point: dari_point, sampai_point: sampai_point},
                        })
                        .done(function( response ) {
                            var data = JSON.parse(response);
                            var harga = App.numberWithCommas(data.data)
                            $('#total_harga').val('Rp.'+harga);
                        })
                        .fail(function() {
                            console.log("error");
                        });
                    }
                }else if(dari_rank <= 5 && sampai_rank > 5){
                    if(dari_bintang != "" && sampai_point != ""){
                        $.ajax({
                            url: App.baseUrl+'order/getHargaBintangPoint',
                            type: 'POST',
                            data: {dari_rank: dari_rank, sampai_rank: sampai_rank, dari_bintang: dari_bintang, sampai_point: sampai_point},
                        })
                        .done(function( response ) {
                            var data = JSON.parse(response);
                            var harga = App.numberWithCommas(data.data)
                            $('#total_harga').val('Rp.'+harga);
                        })
                        .fail(function() {
                            console.log("error");
                        });
                    }
                }
            }
        },
        onChangePaket: function(){
            $('#id_paket').on('change', function() {
                var id = $(this).val();
                $.ajax({
                    url: App.baseUrl+'order/getHargaPaket',
                    type: 'POST',
                    data: {id: id},
                })
                .done(function( response ) {
                    var data = JSON.parse(response);
                    var harga = App.numberWithCommas(data.data[0].harga)
                    $('#total_harga').val('Rp.'+harga);
                })
                .fail(function() {
                    console.log("error");
                });
            });
        },
        onChangePoint: function(){
            $('#point').on('change', function() {
                $('#mythic_point').val('');
                $('#sampai_point').val('');

                App.onChangeTotalHarga();
            })
        },
        onChangeBintang: function(){
            $('#bintang').on('change', function (){
                App.onChangeTotalHarga();
            });
        },
        onChangeSampaiPoint: function(){
            $('#sampai_point').on('change', function (){
                App.onChangeTotalHarga();
            });
        },
        onChangeSampaiBintang: function(){
            $('#sampai_bintang').on('change', function (){
                App.onChangeTotalHarga();
            });
        },
        onChangeMythicPoint: function(){
            $('#mythic_point').on('change', function (){
                App.onChangeTotalHarga();
            });
        },
        onChangeRank: function(){
            $('#rank').on('change', function() {
                var rank = $(this).val();

                $('#mythic_point').val('');
                $('#sampai_point').val('');
                $('#sampai_bintang').val('');

                if(rank == 11){
                    $('.sampai-rank').hide();
                    $('.mythic-point').show();
                }else{
                    $('.mythic-point').hide();
                    var option = "<option value=''>Pilih Rank</option>";
                    $('#sampai_rank').html(option);
                    $.ajax({
                        url: App.baseUrl+'order/getRank',
                        type: 'POST',
                        data: {id: rank},
                    })
                    .done(function( response ) {
                        var data = JSON.parse(response);
                        var option = "<option value=''>Pilih Rank</option>";
                        $('.sampai-rank').show();
                        $('#sampai_rank').html(option);
                        if(data.status == true){
                            for (var i = 0; i < data.data.length; i++) {
                                if(App.selected_paket == data.data[i].id){
                                    option += "<option value="+data.data[i].id+" selected> "+data.data[i].name+"</option>";
                                }else{
                                    // console.log(data);
                                    option += "<option value="+data.data[i].id+"> "+data.data[i].name+"</option>";
                                }
                            }
                        }
                        $('#sampai_rank').html(option);
                    })
                    .fail(function() {
                        console.log("error");
                    });
                    $('.sampai-rank').show();
                }
                
                if(rank > 5){
                    $('.point').removeClass('d-none');
                    $('.point').addClass('d-flex');

                    $('.bintang').removeClass('d-flex');
                    $('.bintang').addClass('d-none');
                    
                    $('#bintang').val('');
                }else{
                    $('.bintang').removeClass('d-none');
                    $('.bintang').addClass('d-flex');

                    $('.point').removeClass('d-flex');
                    $('.point').addClass('d-none');

                    $('#point').val('');
                }

                App.onChangeTotalHarga();

            })
        },
        onChangeSampaiRank : function(){
            $('#sampai_rank').on('change', function() {
                var rank = $(this).val();

                if(rank > 5){
                    $('.sampai-point').removeClass('d-none');
                    $('.sampai-point').addClass('d-flex');

                    $('.sampai-bintang').removeClass('d-flex');
                    $('.sampai-bintang').addClass('d-none');
                    
                    $('#sampai_bintang').val('');
                }else{
                    $('.sampai-bintang').removeClass('d-none');
                    $('.sampai-bintang').addClass('d-flex');

                    $('.sampai-point').removeClass('d-flex');
                    $('.sampai-point').addClass('d-none');

                    $('#sampai_point').val('');
                }

                App.onChangeTotalHarga();
            });
        },
        onChangePelayanan : function(){
            $('#id_pelayanan').on('change', function (){
                $('#total_harga').val('');
                var id = $(this).val();
                if(id == 5){
                    $('#id_paket').val('');
                    $('.paket').hide();
                    
                    $('#rank').val("").change() 
                    $('#bintang').val('');
                    $('#point').val('');
                    $('.rank').show();
                }else{
                    $('.rank').hide();
                    $('.sampai-rank').hide();
                    $.ajax({
                        url: App.baseUrl+'order/getPaket',
                        type: 'POST',
                        data: {id: id},
                    })
                    .done(function( response ) {
                        var data = JSON.parse(response);
                        var option = "<option value=''>Pilih Paket</option>";
                        $('.paket').show();
                        $('#id_paket').html(option);
                        if(data.status == true){
                            for (var i = 0; i < data.data.length; i++) {
                                if(App.selected_paket == data.data[i].id){
                                    option += "<option value="+data.data[i].id+" selected> "+data.data[i].name+"</option>";
                                }else{
                                    // console.log(data);
                                    option += "<option value="+data.data[i].id+"> "+data.data[i].name+"</option>";
                                }
                            }
                        }
                        $('#id_paket').html(option);
                    })
                    .fail(function() {
                        console.log("error");
                    });
                }
            })   
            
            var id_pelayanan = $("#id_pelayanan").val();
            if(id_pelayanan != undefined && id_pelayanan != "" && id_pelayanan != null){
                $("#id_pelayanan").trigger("change");
            }
        },
	}
});
