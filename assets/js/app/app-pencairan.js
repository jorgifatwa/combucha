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
    toastr,
    ) {
    return {
        table:null,
        init: function () {
            App.initFunc();
            App.initTable();
            App.initConfirm();
            App.initEvent();
            $(".loadingpage").hide();
        },
        initEvent : function(){
                
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
                    "url": App.baseUrl+"pencairan/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "joki" },
                    { "data": "pendapatan" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initConfirm :function(){
            $('#table tbody').on( 'click', '.accept', function () {
                var url = $(this).attr("url");
                var total_pendapatan = $(this).attr('total_pendapatan');
                App.confirm("Apakah anda yakin untuk mengubah ini?",function(){
                   $.ajax({
                      method: "POST",
                      url: url,
                      data: { 'total_pendapatan': total_pendapatan }
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
