define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr",
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
            App.initEvent();
            App.initConfirm();
            App.initPrivileges();
            $(".loadingpage").hide();
        },
        initEvent : function(){
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
                    "url": App.baseUrl+"role/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "name" },
                    { "data": "action" ,"orderable": false}
                ]
            });

            //append button to datatables
            // add_btn = '<a href="'+App.baseUrl+'role/create" class="btn btn-sm btn-primary ml-2 mt-1"><i class="fa fa-plus"></i> Jabatan</a>';
            // $('#table_filter').append(add_btn);

            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        name: {
                            required: true
                        },
                    },
                    messages: {
                        name: {
                            required: "Nama Jabatan Harus Diisi"
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


            var group_id_selected = $("#group_id_selected").val();
            $( "#area_id" ).change(function() {
                var area_id = $(this).val();
                $.ajax({
                  method: "GET",
                  url: App.baseUrl+"group/getGroupsByArea",
                  data: { area_id: area_id}
                })
                .done(function( msg ) {
                    var response = JSON.parse(msg);
                    var groups = response.data;
                    if(response.status){
                        var html = '<option  >Pilih Departemen</option>';
                        for (var i = 0; i < groups.length; i++) {
                            if(group_id_selected == groups[i].id){
                                html += "<option value='"+groups[i].id+"' selected>"+groups[i].name+"</option>";
                            }else{
                                html += "<option value='"+groups[i].id+"'>"+groups[i].name+"</option>";
                            }
                        }

                        $("#group_id").html(html);
                    }

                });
            });

            $( "#area_id" ).trigger('change');
        },
        initConfirm :function(){
            $('#table tbody').on( 'click', '.delete', function () {
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
                            App.table.ajax.reload(null, true);
                        }
                    });
                })
            });
        },

        initPrivileges :function(){
            App.formInitPrivileges();
            $("#checkAll").change(function () {
                $("input:checkbox.cb-element").prop('checked', $(this).prop("checked"));
                $("input:checkbox.cb-element-child").prop('checked', $(this).prop("checked"));
            });
            $(".cb-element").change(function () {

                App.checkAllCheckbox();
                $parent = $(this).closest( "tr" ).find(".cb-element-child");
                $parent.prop('checked', $(this).prop("checked"));
            });

            $(".cb-element-child").change(function () {
                $parent = $(this).closest( "tr" ).find(".cb-element");
                $child = $(this).closest( "tr" ).find(".cb-element-child");
                $childChecked = $(this).closest( "tr" ).find(".cb-element-child:checked");

                _tot = $child.length
                _tot_checked = $childChecked.length;
                if(_tot != _tot_checked){
                    $parent.prop('checked',false);
                }else{
                   $parent.prop('checked',true);
                }
                App.checkAllCheckbox();
            });

            $('.cb-element-child').on('click', function(){
                parent = $(this).closest('.function-parent');
                var checked = $(this).is(':checked') ? true : false;

                if ($(this).val() == 1){
                    parent.find('.function-2').prop('checked', checked);
                    parent.find('.function-5').prop('checked', checked);
                }else if($(this).val() == 3){
                    parent.find('.function-2').prop('checked', checked);
                    parent.find('.function-5').prop('checked', checked);
                }else if($(this).val() == 4){
                    parent.find('.function-2').prop('checked', checked);
                    parent.find('.function-5').prop('checked', checked);
                }else if($(this).val() == 5){
                    parent.find('.function-2').prop('checked', checked);
                    parent.find('.function-5').prop('checked', checked);
                }else if($(this).val() == 6){
                    parent.find('.function-2').prop('checked', checked);
                    parent.find('.function-5').prop('checked', checked);
                }else if($(this).val() == 7){
                    parent.find('.function-2').prop('checked', checked);
                    parent.find('.function-5').prop('checked', checked);
                }else if($(this).val() == 8){
                    parent.find('.function-2').prop('checked', checked);
                    parent.find('.function-5').prop('checked', checked);
                }
            });
        },

        checkAllCheckbox:function(){
            _tot = $(".cb-element").length
            _tot_checked = $(".cb-element:checked").length;
            if(_tot != _tot_checked){
                $("#checkAll").prop('checked',false);
            }else{
                $("#checkAll").prop('checked',true);
            }
        },

        formInitPrivileges:function(){
            if($("#form_privileges").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form_privileges").validate({
                    rules: {
                        role_id: {
                            required: true
                        },
                    },
                    messages: {
                        role_id: {
                            required: "Nama Jabatan Harus Diisi"
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
	}
});
