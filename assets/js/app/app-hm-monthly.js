define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "bootstrapDatepicker",
    "jqvalidate",
    "select2",
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    bootstrapDatepicker,
    jqvalidate,
    select2
    ) {
    return {
        table:null,
        tableRain: null,
        tableSlippery: null,
        init: function () {
            App.initFunc();
            App.initData();
            App.searchTable();
            App.resetSearch();
            App.initEvent();
            $(".loadingpage").hide();
        },
        searchTable: function(){
            $('#btn-filter').on('click', function () {
                var tahun = $("#tahun_search").val();
                var bulan = $("#bulan_search").val();
                var lokasi = $("#location_search").val();

                App.initData(tahun, bulan, lokasi);
            });
        },
        resetSearch:function(){
            $('#reset').on( 'click', function () {
                const d = new Date();
                let month = d.getMonth() + 1;
                let year = d.getFullYear();
                $("#bulan_search").val(month).trigger("change");
                $("#tahun_search").val(year).trigger("change");
                $("#location_search").val("").trigger("change");
                
                App.initData();
            });
        },
        initEvent : function(){
            $(".yearpicker").datepicker( {
                format: "yyyy",
                startView: "years", 
                minViewMode: "years",
                autoclose: true
            });

            $("#location_search").select2({
                width: "100%",
                placeholder: "Pilih Lokasi"
            });

            $("#bulan_search").select2({
                width: "100%",
                placeholder: "Pilih Bulan"
            });
        },
        initData: function (tahun = null, bulan = null, lokasi = null){
            $.ajax({
                url: App.baseUrl + 'report/dataListHmMonthly',
                type: 'POST',
                data: {
                    tahun: tahun,
                    bulan: bulan,
                    lokasi: lokasi
                },
                dataType: 'json',
                beforeSend: function() {
                    $(".loadingpage").show();
                },
            })
            .done(function(response) {
                var data = response.data;
                $("#text-header").html(response.text_header);
                
                var html = "";
                if(data.length > 0){
                    for (let i = 0; i < data.length; i++) {
                        html += '<tr>';
                        html += '<td>'+data[i].tanggal+'</td>';
                        html += '<td>'+data[i].shift_name+'</td>';
                        html += '<td>'+data[i].unit_kode+'</td>';
                        html += '<td>'+data[i].unit_model_name+'</td>';
                        html += '<td>'+data[i].operator_name+'</td>';
                        html += '<td>'+data[i].hm_start+'</td>';
                        html += '<td>'+data[i].hm_end+'</td>';
                        html += '<td>'+data[i].duration+'</td>';
                        html += '<td>'+data[i].time_down+'</td>';
                        html += '<td>'+data[i].standy+'</td>';
                        html += '<td>'+data[i].remarks+'</td>';
                        html += '<td>'+data[i].location_name+'</td>';
                        html += '<td>'+data[i].week+'</td>';
                        html += '</tr>';
                    }
                }else{
                    html = '<tr><td colspan="13" align="center">Data Tidak Tersedia</td></tr>';
                }

                $("#hm_monthly").html(html);
                $(".loadingpage").hide();
            })
            .fail(function(response) {
                $(".loadingpage").hide();
                console.log("error");
            });
        }
	}
});
