define([
    "jQuery",
    // "jQuerySlim",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr",
    "bsDropzone"
    ], function (
    $,
    // jQuerySlim,
    bootstrap,
    datatables,
    datatablesBootstrap,
    jqvalidate,
    toastr,
    bsDropzone
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
                    "url": App.baseUrl+"history_pekerjaan/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "no_faktur" },
                    { "data": "joki_name" },
                    { "data": "tanggal" },
                    { "data": "paket_name" },
                ]
            });
        },
        initConfirm :function(){
        }
	}
});
