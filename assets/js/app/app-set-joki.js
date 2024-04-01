define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr",
    "fatZoom",
    'select2'
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    jqvalidate,
    toastr,
    select2,
    fatZoom
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
            $('#id_joki').select2({
                width: "100%",
                placeholder: "Pilih Joki",
            });
            $('#btn-batal').on('click', function () {
                $('#id_joki').val('').change();
                $('#urk').val('');
                $('#id').val('');
                $('#modal-set-joki').modal('hide'); 
            })
            $('#btn-simpan').on('click', function () {
                var id_joki = $('#id_joki').val();
                var url = $('#url').val();
                var id = $('#id').val();
                $.ajax({
                    method: "POST",
                    url: url,
                    data: { 'id_joki': id_joki, 'id' : id }
                  }).done(function( msg ) {
                      var data = JSON.parse(msg);
                      if (data.status == false) {
                          toastr.error(data.msg);
                        } else {
                            toastr.success(data.msg);
                            App.table.ajax.reload(null, true);
                            $('#modal-set-joki').modal('hide'); 
                      }
                  });
            })
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
                    "url": App.baseUrl+"set_joki/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "no_faktur" },
                    { "data": "paket_name" },
                    { "data": "nickname" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initConfirm :function(){
            $('#table tbody').on( 'click', '.joki', function () {
                $('#modal-set-joki').modal('show'); 
                var url = $(this).attr("url");
                var id = $(this).attr("data-id");

                $('#id').val(id);
                $('#url').val(url);

            });
            $('#table tbody').on( 'click', '.decline', function () {
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
