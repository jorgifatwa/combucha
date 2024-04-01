define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "bootstrapDatepicker",
    "jqvalidate",
    "select2",
    "toastr",
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    bootstrapDatepicker,
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
            App.onChangeBrand();
            App.onChangeCategori();
            $(".loadingpage").hide();
        },
        
        onChangeBrand : function(){
            $('#brand_id').on('change', function (){
                var brand_id = $(this).val();
                $.ajax({
                    url : App.baseUrl+"unit_model/get_category",
                    type : "POST",
                    data : {"brand_id" : brand_id},
                    success : function(data) {
                        var data = JSON.parse(data);
                        var option_category = "<option selected hidden disabled>Pilih Kategori</option>";
                        $('#unit_category_id').html(option_category);
                        var category_selected = $('#category_id_selected').val();
                        if(data.status == true){
                            for (var i = 0; i < data.data.length; i++) {
                                if(category_selected == data.data[i].unit_category_id){
                                    option_category += "<option value="+data.data[i].unit_category_id+" selected> "+data.data[i].category_name+"</option>";
                                }else{
                                    option_category += "<option value="+data.data[i].unit_category_id+"> "+data.data[i].category_name+"</option>";
                                }
                            }
                        }
                        $('#unit_category_id').html(option_category);
                        $('#unit_category_id').trigger("change");
                    },
                    error : function(data) {
                        // do something
                    }
                }); 
            });

            var brand = $("#brand_id").val();
            if(brand != undefined && brand != "" && brand != null){
                $("#brand_id").trigger("change");
            }
        },
        onChangeCategori : function(){
            $('#unit_category_id').on('change', function (){
                var category_id = $(this).val();
                var brand_id = $('#brand_id').val();
                $.ajax({
                    url : App.baseUrl+"unit_model/get_model",
                    type : "POST",
                    data : {
                        "brand_id" : brand_id,
                        "unit_category_id" : category_id
                    },
                    success : function(data) {
                        var data = JSON.parse(data);
                        var option_model = "<option selected hidden disabled>Pilih Model</option>";
                        $('#unit_model_id').html(option_model);
                        var model_selected = $('#model_id_selected').val();
                        if(data.status == true){
                            for (var i = 0; i < data.data.length; i++) {
                                if(model_selected == data.data[i].id){
                                    option_model += "<option value="+data.data[i].id+" selected> "+data.data[i].name+"</option>";
                                }else{
                                    option_model += "<option value="+data.data[i].id+"> "+data.data[i].name+"</option>";
                                }
                            }
                        }
                        $('#unit_model_id').html(option_model);
                    },
                    error : function(data) {
                        // do something
                    }
                }); 
            });
        },
        initEvent : function(){
            $('#unit_category_id').select2({
                width: "100%",
                placeholder: "Pilih Kategori",
            });
            $('#brand_id').select2({
                width: "100%",
                placeholder: "Pilih Brand",
            });
            $('#unit_model_id').select2({
                width: "100%",
                placeholder: "Pilih Model",
            });
            $('#operasi_sebagai').select2({
                width: "100%",
                placeholder: "Pilih Operasi Sebagai",
            });
            $("#tahun_perakitan").datepicker({
                format: "yyyy",
                viewMode: "years", 
                minViewMode: "years",
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
                    "url": App.baseUrl+"unit/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "kode" },
                    { "data": "category_name" },
                    { "data": "brand_name" },
                    { "data": "unit_model_name" },
                    { "data": "kepemilikan" },
                    { "data": "operasi_sebagai" },
                    { "data": "action" ,"orderable": false}
                ]
            });

            jQuery.extend(jQuery.validator.messages, {
                required: "Harus Diisi",
                accept: "Tipe dokumen tidak diizinkan",
                number: "Harap input dengan nomer",
                email: "Harap input dengan email yang valid",
            });

            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        kode: {
                            required: true
                        },
                        brand_id: {
                            required: true
                        },
                        unit_model_id: {
                            required: true
                        },
                        unit_category_id: {
                            required: true
                        },
                        operasi_sebagai: {
                            required: true
                        },
                        kepemilikan: {
                            required: true
                        },
                    },
                    messages: {
                        kode: {
                            required: "Kode Harus Diisi"
                        },
                        brand_id: {
                            required: "Brand Unit Harus Dipilih"
                        },
                        unit_model_id: {
                            required: "Model Unit Harus Dipilih"
                        },
                        unit_category_id: {
                            required: "Kategori Unit Harus Dipilih"
                        },
                        operasi_sebagai: {
                            required: "Operasi Sebagai Harus Dipilih"
                        },
                        kepemilikan: {
                            required: "Kepemilikan Unit Harus Dipilih"
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
