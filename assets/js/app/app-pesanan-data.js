define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr",
    "select2"
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    jqvalidate,
    toastr,
    select2
    ) {
    return {
        table:null,
        init: function () {
            App.initFunc();
            App.initTable();
            App.initValidation();
            App.initConfirm();
            App.initEvent();
            $(".loadingpage").hide();
        },
        initEvent : function(){
            $('#table tbody').on( 'click', '.btn-detail', function (e) {
                e.preventDefault()
                var id = $(this).attr('data-id');
                $.ajax({
                    type: 'POST',
                    url: App.baseUrl+'pesanan_data/getDetailData',
                    data: {id:id},
                    success: function(data) {
                        var data = JSON.parse(data);
                        data = data.data_detail;
                        var total = 0;
                        console.log(data);
                        var html = `<div class="row justify-content-center">
                        <div class="text-center col-md-12">
                          <img width="200" class="mt-3 mx-auto" src="`+ App.baseUrl +`assets/images/logo-no-bg-cropped.png" alt="">
                          <p>`+updateTime()+`</p>
                          <hr class="border-bottom border-3 bg-black">
                          <div class="row col-md-12 justify-content-center">
                            <table class="col-md-12">
                              <tr class="border-bottom border-3">
                                <td><b>QTY</b></td>
                                <td><b>ITEM</b></td>
                                <td><b>AMT</b></td>
                              </tr>`;
                        for (let index = 0; index < data.length; index++) {
                            var subTotal = data[index].sub_total;
                            var formattedSubTotal = subTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
                            formattedSubTotal = formattedSubTotal.replace(",00", "");
                            total += subTotal;
                            html += `<tr>
                            <td>`+data[index].jumlah+`</td>
                            <td class="text-left">`+data[index].nama_produk+`</td>
                            <td>`+formattedSubTotal+`</td>
                          </tr>`
                        }

                        var formattedTotal = total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
                            formattedTotal = formattedTotal.replace(",00", "");
                        html += `<tr class="border-top border-3">
                                    <td colspan="2" class="text-left"><h4>Total</h4></td>
                                    <td>`+formattedTotal+`</td>
                                </tr>
                                </table>
                            </div>
                            </div>
                        </div>`
                        $('.modal-body').html(html);
                        $('.btn-modal').click();
                    }
                });
            })

            function updateTime() {
                var currentTime = new Date();
                var day = currentTime.toLocaleString('en-US', { weekday: 'long' });
                var date = currentTime.getDate();
                var month = currentTime.toLocaleString('en-US', { month: 'long' });
                var year = currentTime.getFullYear();
                var hours = currentTime.getHours();
                var minutes = currentTime.getMinutes();
                var seconds = currentTime.getSeconds();
        
                // Formatting waktu agar memiliki dua digit
                minutes = (minutes < 10 ? "0" : "") + minutes;
                seconds = (seconds < 10 ? "0" : "") + seconds;
        
                // Menampilkan waktu dalam format yang diinginkan
                var timeString = day + ", " + date + " " + month + " " + year + " " + hours + ":" + minutes + ":" + seconds;
                
                // Menampilkan waktu dalam elemen dengan id 'time'
                $('#time').html(timeString);

                return timeString;
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
                "order": [[ 0, "asc" ]], //agar kolom id default di order secara desc
                "processing": true,
                "serverSide": true,
                "ajax":{
                    "url": App.baseUrl+"pesanan_data/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "tanggal" },
                    { "data": "nama_pelanggan" },
                    { "data": "status" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initValidation : function(){
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
                            required: "Nama Harus Diisi"
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
