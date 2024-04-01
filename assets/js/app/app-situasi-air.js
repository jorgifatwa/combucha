define([
    "jQuery",
    "bootstrap",
    "bootstrapDatetimepicker",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "select2",
], function (
    $,
    bootstrap,
    datatables,
    bootstrapDatetimepicker,
    datatablesBootstrap,
    jqvalidate,
    select2,
) {
return {
    table:null,
    seam: seam,
    unit: unit,
    count_seam: 0,
    count_unit: 0,
    init: function () {
        App.initFunc();
        App.initEvent();
        App.initConfirm();
        App.initValidation();

        App.initTable();

        $(".dataTables_filter").show();
        $(".loadingpage").hide();
    },
    initEvent : function(){
        $('#waktu').datetimepicker({
            format: 'DD-MM-YYYY HH:mm'
        });

        $(".seam_id").select2({
            placeholder: "Pilih Seam", 
            width: "100%"
        });

        $(".blok_start").select2({
            placeholder: "Dari Blok", 
            width: "100%"
        });

        $(".blok_end").select2({
            placeholder: "Ke Blok", 
            width: "100%"
        });

        $(".unit_id").select2({
            placeholder: "Pilih Unit"
        });

        App.count_seam = $('.seam_id').length;
        App.count_unit = $('.unit_id').length;
        $('.seam_id').trigger("change");

    },
    initValidation : function(){
        if($("#form-create").length > 0){
            $("#save-btn").removeAttr("disabled");
            $("#form-create").validate({
                rules: {
                    waktu: {
                        required: true
                    }
                },
                messages: {
                    waktu: {
                        required: "Waktu Harus Diisi"
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
                    form.submit();
                }
            });
        }

        if($("#form-edit").length > 0){
            $("#save-btn").removeAttr("disabled");
            $("#form-edit").validate({
                rules: {
                    waktu: {
                        required: true
                    }
                },
                messages: {
                    waktu: {
                        required: "Waktu Harus Diisi"
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
                    form.submit();
                }
            });
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
            "order": [[ 0, "desc" ]],
            "processing": true,
            "serverSide": true,
            "ajax":{
                "url": App.baseUrl+"situasi_air/dataList",
                "dataType": "json",
                "type": "POST",
            },
            "columns": [
                { "data": "waktu" },
                { "data": "location_name" },
                { "data": "action" ,"orderable": false}
            ]
        });
    },
    tambahVolume : function(){
        var html = "";
        html += '<tr>';
        
        //pilih seam 
        html += '<td>';
        html += '<select name="seam_id[]" id="seam_id_'+App.count_seam+'" class="form-control seam_id" onChange="App.onChangeSeam(this)">';
        html += '<option value="">Pilih Seam</option>';
        for (let i = 0; i < App.seam.length; i++) {
           html += '<option value="'+App.seam[i].id+'">'+App.seam[i].name+'</option>';
        }
        html += '</select>';
        html += '</td>';

        //pilih dari blok
        html += '<td>';
        html += '<select name="blok_start[]" id="blok_start_'+App.count_seam+'" class="form-control blok_start">';
        html += '<option value="">Dari Blok</option>';
        html += '</select>';
        html += '</td>';

        //pilih ke blok
        html += '<td>';
        html += '<select name="blok_end[]" id="blok_end_'+App.count_seam+'" class="form-control blok_end">';
        html += '<option value="">Ke Blok</option>';
        html += '</select>';
        html += '</td>';

        //pilih Ketinggian Air
        html += '<td>';
        html += '<input class="form-control number" type="text" id="ketinggian_air_'+App.count_seam+'" name="ketinggian_air[]" autocomplete="off" placeholder="Ketinggian Air (mdpl)">';
        html += '</td>';

        //pilih Estimasi Total Air
        html += '<td>';
        html += '<input class="form-control number" type="text" id="estimasi_total_air_'+App.count_seam+'" name="estimasi_total_air[]" autocomplete="off" placeholder="Estimasi Total Air">';
        html += '</td>';

        //pilih Estimasi Total Lumpur
        html += '<td>';
        html += '<input class="form-control number" type="text" id="estimasi_total_lumpur_'+App.count_seam+'" name="estimasi_total_lumpur[]" autocomplete="off" placeholder="Estimasi Total Lumpur">';
        html += '</td>';

        html += '<td width="50px" align="center"><button type="button" class="btn btn-danger btn-sm" onClick="App.hapusRow(this);"><i class="fas fa-times"></i></button></td>';
        html += '</tr>';

        $("#container-volume").append(html)
        $("#seam_id_"+App.count_seam).select2({
            placeholder: "Pilih Seam", 
            width: "100%"
        });

        $("#blok_start_"+App.count_seam).select2({
            placeholder: "Dari Blok", 
            width: "100%"
        });

        $("#blok_end_"+App.count_seam).select2({
            placeholder: "Ke Blok", 
            width: "100%"
        });

        App.initValidationForm();
        App.count_seam++;
    },
    tambahPompa : function(){
        var html = "";
        html += '<tr>';
        
        //pilih Unit 
        html += '<td>';
        html += '<select name="unit_id[]" id="unit_id_'+App.count_unit+'" class="form-control unit_id">';
        html += '<option value="">Pilih Unit</option>';
        for (let i = 0; i < App.unit.length; i++) {
           html += '<option value="'+App.unit[i].id+'">'+App.unit[i].kode+'</option>';
        }
        html += '</select>';
        html += '</td>';

        //status unit
        html += '<td>';
        html += '<input class="form-control" type="text" id="status_unit_'+App.count_unit+'" name="status_unit[]" autocomplete="off" placeholder="Status Unit">';
        html += '</td>';

        html += '<td width="50px" align="center"><button type="button" class="btn btn-danger btn-sm" onClick="App.hapusRow(this);"><i class="fas fa-times"></i></button></td>';
        html += '</tr>';

        $("#container-pompa").append(html)
        $("#unit_id_"+App.count_unit).select2({
            placeholder: "Pilih Unit"
        });

        App.initValidationForm();
        App.count_unit++;
    },
    hapusRow : function(e){
        $(e).closest('tr').remove()
    },
    onChangeSeam : function(e){
        var seam = $(e).val();
        var blok_start_selected = $(e).closest('tr').find(".blok_start_selected").val();
        var blok_end_selected = $(e).closest('tr').find(".blok_end_selected").val();
        $.ajax({
            url : App.baseUrl+"situasi_air/getBlok",
            type : "POST",
            data : {
                seam : seam
            },
            success : function(data) {
                var data = JSON.parse(data);

                var option_blok_start = '<option value="">Dari Blok</option>';
                var option_blok_end = '<option value="">Dari Blok</option>';
                if(data.data.length > 0){
                    for (let i = 0; i < data.data.length; i++) {
                        if(blok_start_selected == data.data[i].id){
                            option_blok_start += '<option value="'+data.data[i].id+'" selected>'+data.data[i].name+'<option>'
                        }else{
                            option_blok_start += '<option value="'+data.data[i].id+'">'+data.data[i].name+'<option>'
                        }
                        
                        if(blok_end_selected == data.data[i].id){
                            option_blok_end += '<option value="'+data.data[i].id+'" selected>'+data.data[i].name+'<option>'
                        }else{
                            option_blok_end += '<option value="'+data.data[i].id+'">'+data.data[i].name+'<option>'
                        }
                    }
                }

                $(e).closest('tr').find('.blok_start').html(option_blok_start);
                $(e).closest('tr').find('.blok_end').html(option_blok_end);
            },
            error : function(data) {
                // do something
            }
        });
    },
    initConfirm :function(){
        $('#table tbody').on( 'click', '.delete', function () {
            var url = $(this).attr("url");
            App.confirm("Apakah anda yakin untuk menghapus data ini?",function(){
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
