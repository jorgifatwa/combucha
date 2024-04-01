define([
    "jQuery",
    "bootstrap",
    "bootstrapDatepicker",
    "highchart",
    "select2",
    ], function (
    $,
    bootstrap,
    bootstrapDatepicker,
    highchart,
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
                var type  = $("#filter_grafik").val();
                var lokasi = $("#location_search").val();
                
                App.initData(tahun, bulan, lokasi, type);
            });
            $('#filter_grafik').on('change', function () {
                var tahun = $("#tahun_search").val();
                var bulan = $("#bulan_search").val();
                var type  = $(this).val();
                var lokasi = $("#location_search").val();
                
                App.initData(tahun, bulan, lokasi, type);
            })
        },
        resetSearch:function(){
            $('#reset').on( 'click', function () {
                const d = new Date();
                let month = d.getMonth() + 1;
                let year = d.getFullYear();
                $("#bulan_search").val(month).trigger("change");
                $("#tahun_search").val(year).trigger("change");
                $("#filter_grafik").val("day").trigger("change");
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
        initData: function (tahun = null, bulan = null, lokasi = null, type = "day"){
            $.ajax({
                url: App.baseUrl + 'report/grafikHmByUnit',
                type: 'POST',
                data: {
                    tahun: tahun,
                    bulan: bulan,
                    lokasi: lokasi,
                    type: type
                },
                dataType: 'json',
                beforeSend: function() {
                    $(".loadingpage").show();
                },
            })
            .done(function(response) {
                var data = response.data;
                if(data.length){
                    $("#grafik_unit_durasi").html("");

                    $("#text-header").html(response.text_header);
                    App.initGrafik(response.kategori, response.data);
                }else{
                    $("#grafik_unit_durasi").html("<h5 align='center'>Data Tidak Tersedia</h5>");
                }

                $(".loadingpage").hide();
            })
            .fail(function(response) {
                $(".loadingpage").hide();
                console.log("error");
            });
        },
        initGrafik: function(kategori = null, data = null){
            Highcharts.chart('grafik_unit_durasi', {
                chart: {
                    type: 'column',
                    zoomType: 'xy',
                    marginTop: 20,
                },
                title: {
                    text: ''
                },
            
                subtitle: {
                    text: ''
                },
            
                yAxis: {
                    title: {
                        text: 'Total'
                    }
                },
            
                xAxis: {
                    categories: kategori,
                },
                credits: {
                    enabled: false
                },
            
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        dataLabels: {
                            enabled: true,
                            crop: false,
                            overflow: 'none'
                        }
                    }
                },
            
                series: data,
            
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            
            });
        }
	}
});
