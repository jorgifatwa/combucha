define([
    "jQuery",
    "bootstrap",
    "datatables",
    "bootstrapDatetimepicker",
    "datatablesBootstrap",
    "jqvalidate",
    "select2",
    "toastr"
    ], function (
    $,
    bootstrap,
    datatables,
    bootstrapDatetimepicker,
    datatablesBootstrap,
    jqvalidate,
    select2,
    toastr
    ) {
    return {
        table:null,
        count_unit: 0,
        unit: units,
        equipment_event: equipment_event,
        init: function () {
            App.initFunc();
            App.initEvent();
            App.initConfirm();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            if($(".unit").length > 0){
                App.count_unit = $(".unit").length;
            }else{
                App.tambahEvent();
            }

            $(".start").datetimepicker({
                format: "DD-MM-YYYY HH:mm",
                widgetPositioning: {
                    horizontal: 'right',
                    vertical: 'bottom'
                }
            });
            $(".end").datetimepicker({
                format: "DD-MM-YYYY HH:mm",
                widgetPositioning: {
                    horizontal: 'right',
                    vertical: 'bottom'
                }
            });

            $('#shift').select2({
                width: "100%",
                placeholder: "Pilih Shift",
            });

            $('.unit').select2({
                width: "100%",
                placeholder: "Pilih Unit",
            });

            $('#operator_id').select2({
                width: "100%",
                placeholder: "Pilih Operator",
            });

            $('.event').select2({
                width: "100%",
                placeholder: "Pilih Equipment Event",
            });

            App.table = $('#table').DataTable({
                "language": {
                    "search": "Cari",
                    "lengthMenu": "Tampilkan _MENU_ baris per halaman",
                    "zeroRecords": "Data tidak ditemukan",
                    "info": "Menampilkan _PAGE_ dari _PAGES_",
                    "infoEmpty": "Tidak ada data yang ditampilkan ",
                    "infoFiltered": "(pencarian dari _MAX_ total records)",
                    "paginate": {
                        "first":      "Pertama",
                        "last":       "Terakhir",
                        "next":       "Selanjutnya",
                        "previous":   "Sebelum"
                    },
                },
                "processing": true,
                "serverSide": true,
                "ajax":{
                    "url": App.baseUrl+"dewatering_pump/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "location_name" },
                    { "data": "shift" },
                    { "data": "operator" ,"orderable": false},
                    { "data": "action" ,"orderable": false}
                ]
            });


            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        shift: {
                            required: true
                        },
                        "operator_id[]": {
                            required: true
                        },
                        start: {
                            required: true
                        },
                        end: {
                            required: true
                        },
                    },
                    messages: {
                        shift: {
                            required: "Shift Harus Dipilih"
                        },
                        "operator_id[]": {
                            required: "Operator Harus Dipilih"
                        },
                        start: {
                            required: "Mulai Jam Kerja Harus Diisi"
                        },
                        end: {
                            required: "Selesai Jam Kerja Harus Diisi"
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
                        var valid = true; 
                        var unit_alert = false;
                        var event_alert = false;
                        
                        if($(".unit").length == 0 && $(".event").length == 0){
                            toastr.error("Equipment Event Tidak Boleh Kosong");
                            valid = false;
                        }else{
                            $(".unit").each(function(i, obj) {
                                if($(this).val() == ""){
                                    valid = false;
                                    unit_alert= true;
                                }
                            });
                            
                            $(".event").each(function(i, obj) {
                                if($(this).val() == ""){
                                    valid = false;
                                    event_alert= true;
                                }
                            });
                        }

                        //kasih alert
                        if(unit_alert){
                            toastr.error("Ada Unit Yang Belum Dipilih");
                        }

                        if(event_alert){
                            toastr.error("Ada Event Yang Belum Dipilih");
                        }

                        if(valid){
                            form.submit();
                        }
                    }
                });
            }
        },
        tambahEvent : function(){
            var html = "";
            html += '<tr>';
            
            //Jam Mulai 
            html += '<td>';
            html += '<input type="text" name="start[]" id="start_'+App.count_unit+'" placeholder="Jam Mulai" class="form-control">';
            html += '</td>';

            //Jam akhir 
            html += '<td>';
            html += '<input type="text" name="end[]" id="end_'+App.count_unit+'" placeholder="Jam Berakhir" class="form-control">';
            html += '</td>';

            //pilih Unit 
            html += '<td>';
            html += '<select name="unit[]" id="unit_'+App.count_unit+'" class="form-control unit">';
            html += '<option value="">Pilih Unit</option>';
            for (let i = 0; i < App.unit.length; i++) {
               html += '<option value="'+App.unit[i].id+'">'+App.unit[i].kode+'</option>';
            }
            html += '</select>';
            html += '</td>';

            //pilih equipment Event
            html += '<td>';
            html += '<select name="event[]" id="event_'+App.count_unit+'" class="form-control event">';
            html += '<option value="">Pilih Equipment Event</option>';
            for (let i = 0; i < App.equipment_event.length; i++) {
               html += '<option value="'+App.equipment_event[i].id+'">'+App.equipment_event[i].name+'</option>';
            }
            html += '</select>';
            html += '</td>';
    
            html += '<td width="50px" align="center"><button type="button" class="btn btn-danger btn-sm" onClick="App.hapusRow(this);"><i class="fas fa-times"></i></button></td>';
            html += '</tr>';
    
            $("#container-event").append(html)
            $("#unit_"+App.count_unit).select2({
                placeholder: "Pilih Unit",
                width: "100%"
            });

            $("#event_"+App.count_unit).select2({
                placeholder: "Pilih Equipment Event",
                width: "100%"
            });

            $("#start_"+App.count_unit).datetimepicker({
                format: "DD-MM-YYYY HH:mm",
                widgetPositioning: {
                    horizontal: 'right',
                    vertical: 'bottom'
                }
            });
            $("#end_"+App.count_unit).datetimepicker({
                format: "DD-MM-YYYY HH:mm",
                widgetPositioning: {
                    horizontal: 'right',
                    vertical: 'bottom'
                }
            });
    
            App.count_unit++;
        },
        hapusRow : function(e){
            $(e).closest('tr').remove()
        },
        initConfirm :function(){
            $('#table tbody').on( 'click', '.remove', function () {
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
