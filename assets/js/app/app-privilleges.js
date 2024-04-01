define([
    "jQuery",
    "bootstrap",
    "jqvalidate",
    "datatables",
    "datatablesBootstrap",
    ], function (
    $,
    bootstrap,
    jqvalidate,
    datatables,
    datatablesBootstrap
    ) {
    return {
       table:null,
        init: function () {
            App.initFunc();
            App.initEvent();
            App.initConfirm();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            App.initDatatables();
            App.formValidation();

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

                if ($(this).val() == 1)
                {
                    parent.find('.function-2').prop('checked', checked);
                    parent.find('.function-5').prop('checked', checked);
                }else if($(this).val() == 2){

                    parent.find('.function-5').prop('checked', checked);
                }else if($(this).val() == 3){

                    parent.find('.function-2').prop('checked', checked);
                    parent.find('.function-5').prop('checked', checked);
                }else if($(this).val() == 4){
                    parent.find('.function-2').prop('checked', checked);
                    parent.find('.function-5').prop('checked', checked);
                }else if($(this).val() == 5){
                    parent.find('.function-2').prop('checked', checked);
                }
            });

        },
        initDatatables :function(){
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
                    "url": App.baseUrl+"privileges/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "id" },
                    { "data": "role_name" },
                    { "data": "action" ,"orderable": false}
                ]
            });

        },
        formValidation:function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
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
        checkAllCheckbox:function(){
            _tot = $(".cb-element").length
            _tot_checked = $(".cb-element:checked").length;
            if(_tot != _tot_checked){
                $("#checkAll").prop('checked',false);
            }else{
                $("#checkAll").prop('checked',true);
            }
        },
        initConfirm :function(){
            $('#table tbody').on( 'click', '.delete', function () {
                console.log("ke klik");
                var url = $(this).attr("url");
                console.log(url);
                App.confirm("Apakah Anda Yakin Untuk Mengubah Ini?",function(){
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
