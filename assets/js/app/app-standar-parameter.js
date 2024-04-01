define([
    "jQuery",
    "bootstrap",
    "datatables",
    "bootstrapDatepicker",
    "datatablesBootstrap",
    "jqvalidate",
    "select2",
    "Handsontable",
    "toastr",
    ], function (
    $,
    bootstrap,
    datatables,
    bootstrapDatepicker,
    datatablesBootstrap,
    jqvalidate,
    select2,
    Handsontable,
    toastr,
    ) {
    return {
        table:null,
        container: null,
        hot: null,
        init: function () {
            App.initFunc();
            App.initEvent();
            App.initConfirm();
            App.onChangeFilter();
            App.initValidation();
            App.export();
            $(".loadingpage").hide();
        },
        onChangeFilter : function(){
            $('#tahun, #bulan').on('change', function (){
                var tahun = $("#tahun").val();
                var bulan = $("#bulan").val();
                var parameter_form = $('#status-form').val();

                $.ajax({
                    url : App.baseUrl+"standar_parameter/getTanggalAkhir",
                    type : "POST",
                    data : {
                        "tahun" : tahun, 
                        "bulan" : bulan, 
                        "parameter_form" : parameter_form
                    },
                    success : function(data) {
                        var data = JSON.parse(data); 
                        var data_form = data.datas;
                       
                        $('#form-parameter').html("");
                        container = document.getElementById('form-parameter');
                        App.hot = new Handsontable(container, {
                            data : data_form,
                            startRows: 5,
                            startCols: 5,
                            height: 'auto',
                            width: 'auto',
                            colHeaders: false,
                            minSpareRows: 0,
                            cells(row, col) {
                                const cellProperties = {};
                                const data = this.instance.getData();
                            
                                if (row === 0) {
                                cellProperties.readOnly = true; // make cell read-only if it is first row or the text reads 'readOnly'
                                }

                                if (col === 0) {
                                    cellProperties.readOnly = true; // make cell read-only if it is first row or the text reads 'readOnly'
                                }

                                if(row > 0 && col > 0){
                                    cellProperties.type = 'numeric'; // make cell read-only if it is first row or the text reads 'readOnly'
                                }
                            
                                return cellProperties;
                            },
                            licenseKey: 'non-commercial-and-evaluation'
                        });
                        
            
                    },
                    error : function(data) {
                        // do something
                    }
                });       
            });
            if($('month_selected') != undefined){
                $("#bulan").trigger('change');
            }
        },
        initValidation: function(){
            if($("#form-create").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form-create").validate({
                    rules: {
                        tahun: {
                            required: true
                        },
                        bulan: {
                            required: true
                        }
                    },
                    messages: {
                        bulan: {
                            required: "Bulan Harus Dipilih"
                        },
                        tahun: {
                            required: "Tahun Harus Dipilih"
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
                        $(".alert-ok").removeClass("btn-danger");
                        $(".alert-ok").addClass("btn-primary");
                        App.confirm("Apakah Anda Yakin Menginput Data Ini?",function(){
                            var data  = App.hot.getData();
                            var tahun = $("#tahun").val();
                            var bulan = $("#bulan").val();
                            $.ajax({
                                url : App.baseUrl + 'standar_parameter/create',
                                type : "POST",
                                dataType : "json",
                                data : {
                                    "tahun" : tahun, 
                                    "bulan" : bulan, 
                                    "data": data
                                },
                                success : function(data) {
                                    if(data.status){
                                        toastr.success("Standar Parameter Telah DiUbah", 'Berhasil', { timeOut: 3000 })
                                    }else{
                                        toastr.error("Standar Parameter Gagal DiUbah", 'Gagal', { timeOut: 3000 })
                                    }
                                    $("#tahun").trigger('change');
                                },
                                error : function(data) {
                                    // do something
                                }
                            });
                        })
                    }
                });
            }

            if($("#form-edit").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form-edit").validate({
                    rules: {
                        tahun: {
                            required: true
                        },
                        bulan: {
                            required: true
                        }
                    },
                    messages: {
                        bulan: {
                            required: "Bulan Harus Dipilih"
                        },
                        tahun: {
                            required: "Tahun Harus Dipilih"
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
                        $(".alert-ok").removeClass("btn-danger");
                        $(".alert-ok").addClass("btn-primary");
                        App.confirm("Apakah Anda Yakin Menginput Data Ini?",function(){
                            var data  = App.hot.getData();
                            var tahun = $("#tahun").val();
                            var bulan = $("#bulan").val();
                            $.ajax({
                                url : App.baseUrl + 'standar_parameter/edit',
                                type : "POST",
                                dataType : "json",
                                data : {
                                    "tahun" : tahun, 
                                    "bulan" : bulan, 
                                    "data": data
                                },
                                success : function(data) {
                                    if(data.status){
                                        toastr.success("Standar Parameter Telah DiUbah", 'Berhasil', { timeOut: 3000 })
                                    }else{
                                        toastr.error("Standar Parameter Gagal DiUbah", 'Gagal', { timeOut: 3000 })
                                    }
                                    $("#tahun").trigger('change');
                                },
                                error : function(data) {
                                    // do something
                                }
                            });
                        })
                    }
                });
            }
        },
        export : function(){
            $('#btn-export').on('click', function (){
                bulan = $('#bulan').val();
                window.location = App.baseUrl+'standar_parameter/export?bulan='+bulan;
            })
        },
        initEvent : function(){
            $('.bulan').select2({
                width: "100%",
                placeholder: "Pilih Bulan",
            });

            $(".tahun").datepicker({
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
                "searching": false,
                "ajax":{
                    "url": App.baseUrl+"standar_parameter/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tahun" },
                    { "data": "bulan" },
                    { "data": "action" },
                ]
            });


            
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
                        App.table.ajax.reload(null,true);
                    });
                })
            });
        }
	}
});
