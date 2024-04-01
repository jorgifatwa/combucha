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
            $('#bukti_pekerjaan').bs_dropzone({
                allowed: ['jpg','jpeg','png','bmp','webp','jfif','svg','ico','gif'],
                accepted: ['jpg','jpeg','png'],
                boxClass:'alert text-center',
                imageClass:'img-fluid',
                noneColorClass:'alert-info',
                dragColorClass:'alert-warning',
                doneColorClass:'alert-success',
                failColorClass:'alert-danger',
                dropzoneTemplate:'<div class="bs-dropzone"><div class="bs-dropzone-area"></div><div class="bs-dropzone-message"></div><div class="bs-dropzone-preview"></div></div>',
                parentTemplate:'<div class="row"></div>',
                childTemplate:'<div class="col"></div>',
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
                    "url": App.baseUrl+"pekerjaan/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "no_faktur" },
                    { "data": "nomor_whatsapp" },
                    { "data": "paket_name" },
                    { "data": "status" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initConfirm :function(){
        }
	}
});
