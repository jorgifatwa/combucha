adefine([
    "jQuery",
	"bootstrap", 
    "highcharts3d",
    "datatables",
    "datatablesBootstrap",
    "bootstrapDatepicker",
    "select2",
    "toastr",
	], function (
    $,
	bootstrap, 
    highcharts3d,
    datatables,
    datatablesBootstrap,
    bootstrapDatepicker,
    select2,
    toastr,
	) {
    return {  
        table:null,
        akhir_bulan: 0,
        tahun_selected: $("#tahun_selected").val(),
        bulan_selected: $("#bulan_selected").val(),
        tanggal_mulai_selected: 1,
        tanggal_akhir_selected: $("#tanggal_akhir_selected").val(),
        init: function () { 
        	App.initFunc(); 
            App.initEvent(); 
            App.onClickFilter(); 
            App.onChangeTahunBulan(); 
            App.onChangeTanggalMulai(); 
            console.log("LOADED");
            $(".loadingpage").hide();
            
            // $('#example1 tfoot th').each( function () {
            //     var title = $(this).text();
            //     $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
            // } );

            // var table1 = $('#example1').DataTable();
            //  // Apply the search
            // table1.columns().every( function () {
            //     var that = this;
         
            //     $( 'input', this.footer() ).on( 'keyup change', function () {
            //         if ( that.search() !== this.value ) {
            //             that
            //                 .search( this.value )
            //                 .draw();
            //         }
            //     } );
            // } );

            // $('#example2 tfoot th').each( function () {
            //     var title = $(this).text();
            //     $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
            // } );
            // var table2 = $('#example2').DataTable();
            //  // Apply the search
            // table2.columns().every( function () {
            //     var that = this;
         
            //     $( 'input', this.footer() ).on( 'keyup change', function () {
            //         if ( that.search() !== this.value ) {
            //             that
            //                 .search( this.value )
            //                 .draw();
            //         }
            //     } );
            // } );

            // var table3 = $('#example3').DataTable();
            // $('#example3 tfoot th').each( function () {
            //     var title = $(this).text();
            //     $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
            // } );
            //  // Apply the search
            // table3.columns().every( function () {
            //     var that = this;
         
            //     $( 'input', this.footer() ).on( 'keyup change', function () {
            //         if ( that.search() !== this.value ) {
            //             that
            //                 .search( this.value )
            //                 .draw();
            //         }
            //     } );
            // } );
         
            
		}, 
        initEvent : function(){   
            $("#tahun").datepicker({
                format: "yyyy",
                viewMode: "years", 
                minViewMode: "years",
                autoclose: true
            }); 

            $('#location_id').select2({
                placeholder: "Lokasi",
                width:"100%"
            });

            $('#bulan').select2({
                width: "100%",
                placeholder: "Bulan",
            });

            $('#tanggal_mulai').select2({
                width: "100%",
                placeholder: "Tanggal Mulai",
            });

            $('#tanggal_akhir').select2({
                width: "100%",
                placeholder: "Tanggal Akhir",
            });

            // $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?a=e&filename=aapl-ohlc.json&callback=?', function (data) {
            //     // create the chart
            //     Highcharts.chart('usercount', {


            //         rangeSelector: {
            //             selected: 1
            //         },

            //         title: {
            //             text: 'User Count'
            //         },

            //         series: [{
            //             type: 'line',
            //             name: 'User Count',
            //             data: data,
                      
            //         }]
            //     });
            // });
            //             // Radialize the colors
            // Highcharts.setOptions({
            //     colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
            //         return {
            //             radialGradient: {
            //                 cx: 0.5,
            //                 cy: 0.3,
            //                 r: 0.7
            //             },
            //             stops: [
            //                 [0, color],
            //                 [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            //             ]
            //         };
            //     })
            // });


            // // Build the chart
            // Highcharts.chart('locationcount', {
            //     chart: {
            //         plotBackgroundColor: null,
            //         plotBorderWidth: null,
            //         plotShadow: false,
            //         type: 'pie'
            //     },
            //     title: {
            //         text: 'Location Count'
            //     },
            //     tooltip: {
            //         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            //     },
            //     plotOptions: {
            //         pie: {
            //             allowPointSelect: true,
            //             cursor: 'pointer',
            //             dataLabels: {
            //                 enabled: true,
            //                 format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            //                 style: {
            //                     color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            //                 },
            //                 connectorColor: 'silver'
            //             }
            //         }
            //     },
            //     series: [{
            //         name: 'Brands',
            //         data: [
            //             { name: 'Thailand', y: 56.33 },
            //             { name: 'Indonesia',y: 24.03 },
            //             { name: 'Amerika', y: 10.38 },
            //             { name: 'Vietnam', y: 4.77 },
            //             { name: 'China', y: 0.91 },
            //             { name: 'Malaysia', y: 0.2 }
            //         ]
            //     }]
            // });

        },
        onChangeTahunBulan : function () {
            $("#tahun, #bulan").on("change", function(){
                var tahun = $("#tahun").val();
                var bulan = $("#bulan").val();
                $("#tanggal_mulai").attr("disabled", true);
                $("#tanggal_akhir").attr("disabled", true);
                if(tahun != "" && bulan != ""){
                    $.ajax({
                        url : App.baseUrl+"dashboard/getTanggalAkhir",
                        type : "POST",
                        data : {
                            bulan : bulan, 
                            tahun: tahun
                        },
                        success : function(data) {
                            var data = JSON.parse(data);
                            App.akhir_bulan = data.data;

                            var option = '<option value="">Tanggal Mulai</option>';
                            for (let i = 1; i <= App.akhir_bulan; i++) {
                                if(App.tanggal_mulai_selected == i){
                                    option += '<option value="'+i+'" selected>'+i+'</option>';
                                }else{
                                    option += '<option value="'+i+'">'+i+'</option>';
                                }
                            }
                            $("#tanggal_mulai").html(option);
                            $("#tanggal_mulai").attr("disabled", false);   
                            $("#tanggal_mulai").trigger("change");
                        },
                        error : function(data) {
                            // do something
                        }
                    });
                }
            });

            var tahun = $("#tahun").val();
            var bulan = $("#bulan").val();

            if(tahun != "" && bulan != ""){
                $("#bulan").trigger("change");
            }

        },
        onClickFilter : function(){
            $("#btn-filter").on("click", function(){
                var location_id = $("#location_id").val();
                var tahun = $("#tahun").val();
                var bulan = $("#bulan").val();
                var start = $("#tanggal_mulai").val();
                var end = $("#tanggal_akhir").val();
                var valid = true;

                if(location_id == "" || location_id == undefined || location_id == null){
                    valid = false;
                    toastr.error("Lokasi Filter Harus Diisi", 'Gagal', { timeOut: 3000 })
                }

                if(tahun == "" || tahun == undefined || tahun == null){
                    valid = false;
                    toastr.error("Tahun Filter Harus Diisi", 'Gagal', { timeOut: 3000 })
                }

                if(bulan == "" || bulan == undefined || bulan == null){
                    valid = false;
                    toastr.error("Bulan Filter Harus Diisi", 'Gagal', { timeOut: 3000 })
                }

                if(start == "" || start == undefined || start == null){
                    valid = false;
                    toastr.error("Tanggal Mulai Filter Harus Diisi", 'Gagal', { timeOut: 3000 })
                }

                if(end == "" || end == undefined || end == null){
                    valid = false;
                    toastr.error("Tanggal Akhir Filter Harus Diisi", 'Gagal', { timeOut: 3000 })
                }

                if(valid){
                    App.initData(location_id, tahun, bulan, start, end);
                }
            });
        },
        initData : function(location_id, tahun, bulan, start, end){
            $(".loadingpage").show();

            $.ajax({
                url : App.baseUrl+"dashboard/getDataDashboard",
                type : "POST",
                data : {
                    location_id : location_id,
                    tahun : tahun,
                    bulan : bulan, 
                    start : start, 
                    end : end, 
                },
                success : function(data) {
                    var data = JSON.parse(data);
                    //ob removal
                    $("#ob_ds").html(data.data['ob_ds'] + ' <span class="italic">bcm</span>');
                    $("#ob_ns").html(data.data['ob_ns'] + ' <span class="italic">bcm</span>');
                    $("#ob_total_daily").html(data.data['ob_total_daily'] + ' <span class="italic">bcm</span>');
                    $("#ob_monthly_plan").html(data.data['ob_monthly_plan'] + ' <span class="italic">bcm</span>');
                    $("#mtd_ob_plan").html(data.data['mtd_ob_plan'] + ' <span class="italic">bcm</span>');
                    $("#mtd_ob_actual").html(data.data['mtd_ob_actual'] + ' <span class="italic">bcm</span>');
                    $("#ob_remaining_target").html(data.data['ob_remaining_target'] + ' <span class="italic">bcm</span>');
                    $("#ob_daily_target").html(data.data['ob_daily_target'] + ' <span class="italic">bcm</span>');
                    $("#ob_achv_daily").html(data.data['ob_achv_daily'] + '% Achv. Daily');
                    $("#ob_achv_monthly").html(data.data['ob_achv_monthly'] + '% Achv. Monthly');
                    $("#ob_achv_mtd").html(data.data['ob_achv_mtd'] + '% Achv. MTD');
                    $("#ob_sisa_hari").html(data.data['ob_sisa_hari'] + ' days');
                    
                    //coal getting
                    $("#coal_ds").html(data.data['coal_ds'] + ' <span class="italic">Mt</span>');
                    $("#coal_ns").html(data.data['coal_ns'] + ' <span class="italic">Mt</span>');
                    $("#coal_total_daily").html(data.data['coal_total_daily'] + ' <span class="italic">Mt</span>');
                    $("#coal_monthly_plan").html(data.data['coal_monthly_plan'] + ' <span class="italic">Mt</span>');
                    $("#mtd_coal_plan").html(data.data['mtd_coal_plan'] + ' <span class="italic">Mt</span>');
                    $("#mtd_coal_actual").html(data.data['mtd_coal_actual'] + ' <span class="italic">Mt</span>');
                    $("#coal_remaining_target").html(data.data['coal_remaining_target'] + ' <span class="italic">Mt</span>');
                    $("#coal_daily_target").html(data.data['coal_daily_target'] + ' <span class="italic">Mt</span>');
                    $("#coal_achv_daily").html(data.data['coal_achv_daily'] + '% Achv. Daily');
                    $("#coal_achv_monthly").html(data.data['coal_achv_monthly'] + '% Achv. Monthly');
                    $("#coal_achv_mtd").html(data.data['coal_achv_mtd'] + '% Achv. MTD');
                    $("#coal_sisa_hari").html(data.data['coal_sisa_hari'] + ' days');

                    //sr dtd dan mtd
                    $("#sr_dtd").html(data.data['sr_dtd'] + ' <span class="italic">bcm/Mt</span>');
                    $("#sr_mtd").html(data.data['sr_mtd'] + ' <span class="italic">bcm/Mt</span>');

                    //coal inventory
                    $("#container-coal-inventory").html("");
                    var coal_inventory = "";
                    if(data.data["coal_inventory"]){
                        for (let i = 0; i < data.data["coal_inventory"].length; i++) {
                            coal_inventory += '<tr>';
                            if(i ==0){
                                coal_inventory += '<th class="text-left" style="width:60%">COAL INVENTORY</th>';
                                coal_inventory += '<th>=</th>';
                            }else{
                                coal_inventory += '<th class="text-left" style="width:60%"></th>';
                                coal_inventory += '<th></th>';
                            }

                            coal_inventory += '<th style="width:15%" class="text-right">'+data.data["coal_inventory"][i].total_tonase +' <span class="italic">Mt</span></th>';
                            coal_inventory += '<th style="width:30%"><span class="italic">('+data.data["coal_inventory"][i].pit_name +')</span></th>';
                            coal_inventory += '</tr>';
                        }
                    }else{
                        coal_inventory += '<tr>';
                        coal_inventory += '<th class="text-left" style="width:60%">COAL INVENTORY</th>';
                        coal_inventory += '<th>=</th>';
                        coal_inventory += '<th style="width:15%" class="text-right">- <span class="italic">Mt</span></th>';
                        coal_inventory += '<th style="width:30%"><span class="italic">(PIT B3S)</span></th>';
                        coal_inventory += '</tr>';
                    }
                    $("#container-coal-inventory").html(coal_inventory);

                    //coal hauling 
                    $("#container-coal-hauling").html("");
                    var coal_hauling = "";
                    if(data.data["coal_hauling"]){
                        for (let i = 0; i < data.data["coal_hauling"].length; i++) {
                            coal_hauling += '<h5 class="text-bold" style="margin-bottom:0px">'+data.data["coal_hauling"][i].name +'</h5>';
                            coal_hauling += '<div class="table-responsive">';
                            coal_hauling += '<table class="table table-dashboard">';
                            coal_hauling += '<tr>';
                            coal_hauling += '<td style="width:60%">- DTD CH</td>';
                            coal_hauling += '<td>=</td>';
                            coal_hauling += '<td class="text-right">'+data.data["coal_hauling"][i].dtd +' <span class="italic">Mt</span></td>';
                            coal_hauling += '</tr>';
                            coal_hauling += '<tr>';
                            coal_hauling += '<td>- MTD CH</td>';
                            coal_hauling += '<td>=</td>';
                            coal_hauling += '<td class="text-right">'+data.data["coal_hauling"][i].mtd +' <span class="italic">Mt</span></td>';
                            coal_hauling += '</tr>';
                            coal_hauling += '</table>';
                            coal_hauling += '</div>';
                        }
                    }
                    $("#container-coal-hauling").html(coal_hauling);

                    //fuel
                    $("#fuel_consumtion_dtd").html(data.data['fuel_consumtion_dtd'] + ' <span class="italic">L</span>');
                    $("#fuel_consumtion_mtd").html(data.data['fuel_consumtion_mtd'] + ' <span class="italic">L</span>');
                    $("#fuel_stock").html(data.data['fuel_stock'] + ' <span class="italic">L</span>');

                    $("#fuel_ratio_dtd").html(data.data['fuel_ratio_dtd'] + ' <span class="italic">L/bcm</span>');
                    $("#fuel_ratio_mtd").html(data.data['fuel_ratio_mtd'] + ' <span class="italic">L/bcm</span>');

                    $(".loadingpage").hide();
                },
                error : function(data) {
                    $(".loadingpage").hide();
                }
            });

            //Data RNS
            $.ajax({
                url : App.baseUrl+"dashboard/getRNS",
                type : "POST",
                data : {
                    location_id : location_id, 
                    bulan : bulan, 
                    tahun: tahun,
                    end: end,
                },
                success : function(data) {
                    var data = JSON.parse(data);
                    var rns = "";
                    if(data.data.length > 0){
                        for (let i = 0; i < data.data.length; i++) {
                            var pit = data.data[i];
                            rns += '<div class="col-sm-6">';
                            rns += '<div class="rain-bg-other text-center">'+pit.name+'</div>';
                            
                            for (let j = 0; j < pit.shift.length; j++) {
                                var shift = pit.shift[j];
                                rns += '<div class="table-responsive">';
                                rns += '<table class="table table-dashboard">';
                                rns += '<thead>';
                                rns += '<tr>';
                                rns += '<th colspan="3" class="text-left">'+shift.name+'</th>';
                                rns += '</tr>';
                                rns += '</thead>';

                                rns += '<tbody>';
                                for (let k = 0; k < shift.nilai.length; k++) {
                                    var nilai = shift.nilai[k];
                                    rns += '<tr>';
                                    rns += '<td style="width:50%;">- '+nilai.type+'</td>';
                                    rns += '<td>=</td>';
                                    rns += '<td class="text-right">'+nilai.jam+' <span class="italic">hrs</span></td>';
                                    rns += '</tr>';
                                }
                                rns += '</tbody>';
                                rns += '<tfoot>';
                                rns += '<tr>';
                                    rns += '<th class="text-right">Total</th>';
                                    rns += '<th class="text-left">=</th>';
                                    rns += '<th class="text-right">'+shift.total+' <span class="italic">hrs</span></th>';
                                rns += '</tr>';
                                rns += '</tfoot>';
                                rns += '</table>';
                                rns += '</div>';
                            }
                            rns += '<div class="table-responsive">';
                            rns += '<table class="table table-dashboard">';
                            rns += '<tfoot>';
                            rns += '<tr>';
                            rns += '<th class="text-left">Total DS + NS</th>';
                            rns += '<th class="text-left">=</th>';
                            rns += '<th class="text-right">'+pit.total+' <span class="italic">hrs</span></th>';
                            rns += '</tr>';
                            rns += '</tfoot>';
                            rns += '</table>';
                            rns += '</div>';
                            rns += '</div>';
                        }
                    }
                    $("#container-rns").html(rns);
                },
                error : function(data) {
                    // do something
                }
            });

            //Data Situasi Air Di PIT
            $.ajax({
                url : App.baseUrl+"dashboard/getSituasiAirDiPit",
                type : "POST",
                data : {
                    location_id : location_id, 
                    bulan : bulan, 
                    tahun: tahun,
                    end: end,
                },
                success : function(data) {
                    var data = JSON.parse(data);

                    //est volume
                    var volume = "";
                    var ketinggian_air = "";
                    if(data.est_volume.length > 0){
                        for (let i = 0; i < data.est_volume.length; i++) {
                            volume += '<tr>';
                            volume += '<td style="width:40%">- '+data.est_volume[i].name+'</td>';
                            volume += '<td class="">=</td>';
                            volume += '<td class="text-right">'+data.est_volume[i].total+' <span class="italic">m<sup>3</sup></span></td>';
                            volume += '<td class="text-right">'+data.est_volume[i].air+' <span class="italic">m<sup>3</sup></span></td>';
                            volume += '<td class="text-right">'+data.est_volume[i].lumpur+' <span class="italic">m<sup>3</sup></span></td>';
                            volume += '</tr>';

                            ketinggian_air += '<tr>';
                            ketinggian_air += '<td style="width:40%">- '+data.est_volume[i].name+'</td>';
                            ketinggian_air += '<td>=</td>';
                            ketinggian_air += '<td class="text-right">'+data.est_volume[i].ketinggian_air+' <span class="italic">mdpl</span></td>';
                            ketinggian_air += '</tr>';
                        }
                    }
                    $("#container-est-volume").html(volume);
                    $("#container-ketinggian-air").html(ketinggian_air);


                    //status pompa
                    var air_pompa = "";
                    if(data.air_pompa.length > 0){
                        for (let i = 0; i < data.air_pompa.length; i++) {
                            air_pompa += '<tr>';
                            air_pompa += '<td>- '+data.air_pompa[i].kode+'</td>';
                            air_pompa += '<td>'+data.air_pompa[i].status_unit+'</td>';
                            air_pompa += '</tr>';
                        }
                    }
                    $("#container-status-pompa").html(air_pompa);
                },
                error : function(data) {
                    // do something
                }
            });

            //Data DWP 
            $.ajax({
                url : App.baseUrl+"dashboard/getDeWateringPump",
                type : "POST",
                data : {
                    location_id : location_id, 
                    bulan : bulan, 
                    tahun: tahun,
                    end: end
                },
                success : function(data) {
                    var data = JSON.parse(data);

                    var dwp = "";
                    if(data.data.length > 0){
                        for (let i = 0; i < data.data.length; i++) {
                            dwp += '<tr>';
                            dwp += '<td style="width:20%;">'+data.data[i].name+'</td>';
                            dwp += '<td>=</td>';
                            dwp += '<td class="text-right" style="width:20%;">'+data.data[i].jam+' <span class="italic">hrs</span></td>';
                            dwp += '<td class="italic"  style="width:60%;">'+data.data[i].event+'</td>';
                            dwp += '</tr>';
                        }
                    }

                    $("#container-jam-kerja-dewatering-pump").html(dwp);
                    // App.grafikObRemoval(data.data);
                },
                error : function(data) {
                    // do something
                }
            });

            //Data productivity ob removal 
            $.ajax({
                url : App.baseUrl+"dashboard/getProductivityObRemoval",
                type : "POST",
                data : {
                    location_id : location_id, 
                    bulan : bulan, 
                    tahun: tahun,
                    end: end
                },
                success : function(data) {
                    var data = JSON.parse(data);
                    var ob = "";
                    var ob_grafik = "";
                    if (data.status == true) {
                        if(data.data.length > 0){
                            for (let i = 0; i < data.data.length; i++) {
                                ob += '<tr>';
                                ob += '<td style="width:25%">- '+data.data[i].kode+'</td>';
                                ob += '<td>:</td>';
                                ob += '<td class="text-right" style="width:25%;">'+data.data[i].productivity+' ';
                                ob += '<span class="italic">bcm/hrs</span>';
                                ob += '</td>';
                                ob += '<td>';
                                ob += '<span class="italic">'+data.data[i].catatan+'</span>';
                                ob += '</td>';
                                ob += '</tr>';   
                            }
                            $(".productivity-ob").addClass("d-none");
                            App.grafikProducitvityOb(data.grafik);
                            $("#container-productivity-ob").html(ob);
                        }
                    } else {
                        $(".productivity-ob").removeClass("d-none");
                        $("#container-productivity-ob").html(ob);
                        $("#container-grafik-productivity-ob").html(ob_grafik);
                    }
                },
                error : function(data) {
                    // do something
                }
            });

            //Data productivity Coal Getting
            $.ajax({
                url : App.baseUrl+"dashboard/getProductivityCoalGetting",
                type : "POST",
                data : {
                    location_id : location_id, 
                    bulan : bulan, 
                    tahun: tahun,
                    end: end
                },
                success : function(data) {
                    var data = JSON.parse(data);
                    var coal_getting = "";
                    var coal_grafik = "";
                    if (data.status == true) {
                        if(data.data.length > 0){
                            for (let i = 0; i < data.data.length; i++) {
                                coal_getting += '<tr>';
                                coal_getting += '<td style="width:25%">- '+data.data[i].kode+'</td>';
                                coal_getting += '<td>:</td>';
                                coal_getting += '<td class="text-right" style="width:25%;">'+data.data[i].productivity+' ';
                                coal_getting += '<span class="italic">ton/hrs</span>';
                                coal_getting += '</td>';
                                coal_getting += '<td>';
                                coal_getting += '<span class="italic">'+data.data[i].catatan+'</span>';
                                coal_getting += '</td>';
                                coal_getting += '</tr>';   
                            }
                            $(".productivity-coal-getting").addClass("d-none");
                            App.grafikProducitvityCoalGetting(data.grafik);
                            $("#container-productivity-coal-getting").html(coal_getting);
                        }
                    } else {
                        $(".productivity-coal-getting").removeClass("d-none");
                        $("#container-productivity-coal-getting").html(coal_getting);
                        $("#container-grafik-productivity-coal-getting").html(coal_grafik);
                    }
                },
                error : function(data) {
                    // do something
                }
            });

            //grafik dashboard ob removal
            $.ajax({
                url : App.baseUrl+"dashboard/grafikObRemoval",
                type : "POST",
                data : {
                    location_id : location_id, 
                    bulan : bulan, 
                    tahun: tahun,
                    end:end
                },
                success : function(data) {
                    var data = JSON.parse(data);
                    App.grafikObRemoval(data.data);
                },
                error : function(data) {
                    // do something
                }
            });
            
            //grafik dashboard coal getting
            $.ajax({
                url : App.baseUrl+"dashboard/grafikCoalGetting",
                type : "POST",
                data : {
                    location_id : location_id, 
                    bulan : bulan, 
                    tahun: tahun,
                    end: end,
                },
                success : function(data) {
                    var data = JSON.parse(data);
                    App.grafikCoalGetting(data.data);
                },
                error : function(data) {
                    // do something
                }
            });

            // grafik dashboard coal Hauling
            $.ajax({
                url : App.baseUrl+"dashboard/grafikCoalHauling",
                type : "POST",
                data : {
                    location_id : location_id, 
                    bulan : bulan, 
                    tahun: tahun
                },
                success : function(data) {
                    var data = JSON.parse(data);
                    App.grafikCoalHauling(data.data);
                },
                error : function(data) {
                    // do something
                }
            });

            //grafik dashboard fuel
            $.ajax({
                url : App.baseUrl+"dashboard/grafikFuelConsumtion",
                type : "POST",
                data : {
                    location_id : location_id, 
                    bulan : bulan, 
                    tahun: tahun
                },
                success : function(data) {
                    var data = JSON.parse(data);
                    App.grafikFuel(data.data);
                },
                error : function(data) {
                    // do something
                }
            });

        },
        onChangeTanggalMulai : function () {
            $("#tanggal_mulai").on("change", function(){
                var value = $(this).val();
                var tahun = $("#tahun").val();
                var bulan = $("#bulan").val();
                var click_filter = false;
                var option = '<option value="">Tanggal Akhir</option>';
                if(value != ""){
                    for (let i = value; i <= App.akhir_bulan; i++) {
                        if(App.tanggal_akhir_selected == i && App.tahun_selected == tahun && App.bulan_selected == bulan){
                            option += '<option value="'+i+'" selected>'+i+'</option>';
                            click_filter = true;
                        }else{
                            option += '<option value="'+i+'">'+i+'</option>';
                        }
                    }
                    $("#tanggal_akhir").attr("disabled", false);
                }
                $("#tanggal_akhir").html(option);
                if(click_filter){
                    $("#btn-filter").trigger("click");
                }
            });
        },
        grafikObRemoval : function(data) {
            Highcharts.chart('container-ob-removal', {
                chart: {
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 5,
                        beta: 20,
                    }
                },
                title: {
                    text: 'OB Removal'
                },
                xAxis: {
                    categories: data["categories"],
                    labels: {
                        skew3d: true,
                    }
                },
                yAxis: {
                    title: {
                        text: 'Bcm'
                    },
                    labels: {
                        skew3d: true,
                    }
                },
                // labels: {
                //     items: [{
                //         html: '',
                //         style: {
                //             left: '50px',
                //             top: '18px',
                //             color: ( // theme
                //                 Highcharts.defaultOptions.title.style &&
                //                 Highcharts.defaultOptions.title.style.color
                //             ) || 'black'
                //         }
                //     }]
                // },
                plotOptions: {
                    column: {
                        pointPadding: 0,
                        borderWidth: 0,
                        depth: 40
                    },
                    line: {
                        lineWidth: 5,
                        depth: 40
                    }
                },
                series: [{
                    type: 'column',
                    color: '#F3F1F5',
                    name: 'Plan',
                    data: data["plan"]
                },{
                    type: 'column',
                    color: '#BFA2DB',
                    name: 'Actual',
                    data: data["actual"]
                },  {
                    type: 'line',
                    color: '#F38BA0',
                    name: 'Trend',
                    data: data["trend"],
                    marker: {
                        enabled: false
                    }
                }]
            });
        },
        grafikCoalGetting : function(data) {
            Highcharts.chart('container-coal-getting', {
                chart: {
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 5,
                        beta: 20,
                    }
                },
                title: {
                    text: 'Coal Getting'
                },
                xAxis: {
                    categories: data["categories"],
                    labels: {
                        skew3d: true,
                    }
                },
                yAxis: {
                    title: {
                        text: 'Mt'
                    },
                    labels: {
                        skew3d: true,
                    }
                },
                // labels: {
                //     items: [{
                //         html: '',
                //         style: {
                //             left: '50px',
                //             top: '18px',
                //             color: ( // theme
                //                 Highcharts.defaultOptions.title.style &&
                //                 Highcharts.defaultOptions.title.style.color
                //             ) || 'black'
                //         }
                //     }]
                // },
                plotOptions: {
                    column: {
                        pointPadding: 0,
                        borderWidth: 0,
                        depth: 40
                    },
                    line: {
                        lineWidth: 5,
                        depth: 40
                    }
                },
                series: [{
                    type: 'column',
                    color: '#DEFCFC',
                    name: 'Plan',
                    data: data["plan"]
                },{
                    type: 'column',
                    color: '#FFC1C8',
                    name: 'Actual',
                    data: data["actual"]
                },  {
                    type: 'line',
                    color: '#685454',
                    name: 'Trend',
                    data: data["trend"],
                    marker: {
                        enabled: false
                    }
                }]
            });
        },
        grafikCoalHauling : function(data) {
            Highcharts.chart('container-grafik-coal-hauling', {
                title: {
                    text: 'Coal Hauling'
                },
                xAxis: {
                    categories: data["categories"]
                },
                yAxis: {
                    title: {
                        text: 'Mt'
                    }
                },
                plotOptions: {
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                labels: {
                    items: [{
                        html: '',
                        style: {
                            left: '50px',
                            top: '18px',
                            color: ( // theme
                                Highcharts.defaultOptions.title.style &&
                                Highcharts.defaultOptions.title.style.color
                            ) || 'black'
                        }
                    }]
                },
                series: data["data"]
            });
        },
        grafikFuel : function(data) {
            Highcharts.chart('container-grafik-fuel', {
                title: {
                    text: 'Fuel Consumtion'
                },
                xAxis: {
                    categories: data["categories"]
                },
                yAxis: {
                    title: {
                        text: 'L'
                    }
                },
                labels: {
                    items: [{
                        html: '',
                        style: {
                            left: '50px',
                            top: '18px',
                            color: ( // theme
                                Highcharts.defaultOptions.title.style &&
                                Highcharts.defaultOptions.title.style.color
                            ) || 'black'
                        }
                    }]
                },
                series: [{
                    type: 'column',
                    name: 'Consumtion',
                    data: data["fuel_consumtion"]
                }]
            });
        },
        grafikProducitvityOb : function(data) {
            Highcharts.chart('container-grafik-productivity-ob', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: data["category"],
                    title: {
                        text: null
                    },
                    labels: {
                        pointFormat: '{point.y:,.0f} bcm/hrs',
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'bcm/hrs',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify',
                    }
                },
                tooltip: {
                    valueSuffix: ' bcm/hrs',
                    pointFormat: '{point.y:,0f} bcm/hrs'
                },
                plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:,.0f} bcm/hrs'
                        },
                        maxPointWidth: 25
                    },
                    line: {
                        dataLabels: {
                            enabled: true,
                            format: ''
                        },
                        lineWidth: 5
                    }
                },
                legend: {
                    enabled:false 
                },
                credits: {
                    enabled: false
                },
                series: [{
                    type: 'column',
                    color: '#ff863d',
                    name: 'Plan',
                    data: data["data"]
                }, {
                    type: 'line',
                    name: 'Target',
                    color: '#f32013',
                    data: data["target"],
                    marker: {
                        enabled: false
                    }
                }]
            });
        },
        grafikProducitvityCoalGetting : function(data) {
            Highcharts.chart('container-grafik-productivity-coal-getting', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: data["category"],
                    title: {
                        text: null
                    },
                    labels: {
                        pointFormat: '{point.y:,.2f} ton/hrs',
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'ton/hrs',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ' ton/hrs',
                    pointFormat: '{point.y:,.2f} ton/hrs'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:,.0f} ton/hrs'
                        },
                        maxPointWidth: 25
                    },
                },
                legend: {
                    enabled:false 
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Unit',
                    data: data["data"]
                }]
            });
        },
	}
});