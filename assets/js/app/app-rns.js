define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    jqvalidate
    ) {
    return {
        table:null,
        tableRain: null,
        tableSlippery: null,
        init: function () {
            App.initFunc();
            App.initEvent();
            App.searchTable();
            App.resetSearch();
            $(".loadingpage").hide();
        },
        searchTable: function(){
            $('#btn-filter').on('click', function () {
                var tanggal_mulai = $("#tanggal_mulai").val();
                var tanggal_akhir = $("#tanggal_akhir").val();
                var lokasi = $("#lokasi").val();

                App.table.column(1).search(tanggal_mulai,true,true);
                App.table.column(2).search(tanggal_akhir,true,true);
                App.table.column(3).search(lokasi,true,true);

                App.table.draw();

                App.tanggal_mulai = $('#tanggal_mulai').val();
                App.tanggal_akhir = $('#tanggal_akhir').val();
                App.lokasi = $('#lokasi').val();
            });
        },
        resetSearch:function(){
            $('#reset').on( 'click', function () {
                $("#tanggal_mulai").val("").trigger("change");
                $("#tanggal_akhir").val("").trigger("change");
                $("#lokasi").val("").trigger("change");

                App.table.search( '' ).columns().search( '' ).draw();
            });
        },
        initEvent : function(){
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
                "searching": false,
                "ajax":{
                    "url": App.baseUrl+"rns/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "lokasi" },
                    { "data": "total_hours_rain" },
                    { "data": "total_hours_slipper" },
                    { "data": "frekuensi_rain" },
                    { "data": "rainfall_mm" },
                    { "data": "total_rns" },
                    { "data": "action" ,"orderable": false}
                ]
            });

            var tanggal = $('#tanggal').val();
            var lokasi = $('#lokasi').val();
            App.tableRain = $('#table-rain').DataTable({
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
                "searching": false,
                "ajax":{
                    "url": App.baseUrl+"rns/detailList/0/"+tanggal+"/"+lokasi,
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "iterasi" },
                    { "data": "start" },
                    { "data": "stop" },
                ]
            });

            App.tableSlippery = $('#table-slippery').DataTable({
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
                "searching": false,
                "ajax":{
                    "url": App.baseUrl+"rns/detailList/1/"+tanggal+"/"+lokasi,
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "iterasi" },
                    { "data": "start" },
                    { "data": "stop" },
                ]
            });
        },
	}
});
