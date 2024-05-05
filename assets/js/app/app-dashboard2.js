define([
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
        init: function () { 
        	App.initFunc(); 
            App.initEvent(); 
            App.initData();
            App.initTable();
            console.log("LOADED");
            $(".loadingpage").hide();
         
            
		}, 
        initEvent : function(){   
            

        },
        initData : function(){

            //grafik pendapatan
            $.ajax({
                url : App.baseUrl+"dashboard/grafikPendapatan",
                type : "GET",
                success : function(data) {
                    var data = JSON.parse(data);
                    App.grafikPendapatan(data.grafik, data.tahun);
                },
                error : function(data) {
                    // do something
                }
            });

            $.ajax({
                url : App.baseUrl+"dashboard/grafikPendapatanPerTahun",
                type : "GET",
                success : function(data) {
                    var data = JSON.parse(data);
                    App.grafikPendapatanPerTahun(data.grafik);
                },
                error : function(data) {
                    // do something
                }
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
                    "url": App.baseUrl+"dashboard/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "nomor" },
                    { "data": "barang_name" },
                    { "data": "total" },
                ]
            });

        },
        
        grafikPendapatan : function(data, tahun) {
            var grafikArray = Object.values(data);


            // Accessing total_pendapatan array for each month
            var totalPendapatanArray = grafikArray.map(function (item) {
                return parseInt(item.total_pendapatan);
            });

            Highcharts.chart('container-grafik-pendapatan-bersih-per-bulan', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Pendapatan Bersih Perbulan'
                },
                subtitle: {
                    text: 'Combucha'
                },

                xAxis: {
                    categories: [
                        'Januari',
                        'Februari',
                        'Maret',
                        'April',
                        'Mei',
                        'Juni',
                        'Juli',
                        'Agustus',
                        'September',
                        'Oktober',
                        'November',
                        'Desember'
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Jumlah Pendapatan Bersih (jt IDR)' // Update the yAxis title
                    },
                    labels: {
                        formatter: function () {
                            return 'Rp ' + (this.value / 1000000).toLocaleString() + ' jt'; // Use toLocaleString for formatting
                        }
                    }
                },
                plotOptions: {
                    series: {
                        allowPointSelect: true
                    }
                },
            
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br />',
                    pointFormat: 'Pendapatan = Rp. {point.y}'
                },
    
                series: [{
                    name: 'Total Pendapatan Bersih',
                    data: totalPendapatanArray,
                    pointStart: 0,
                }]
            });
        },

        grafikPendapatanPerTahun: function(data) {
            // Assuming data.grafik is an object with years as keys
            var years = Object.keys(data);
        
            // Convert data into an array
            var grafikArray = Object.values(data);
        
            // Accessing total_pendapatan array for each year
            var totalPendapatanArray = grafikArray.map(function(item) {
                return parseInt(item.total_pendapatan);
            });
        
            Highcharts.chart('container-grafik-pendapatan-pertahun', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Pendapatan Bersih Pertahun'
                },
                subtitle: {
                    text: 'Combucha'
                },
        
                xAxis: {
                    categories: years, // Use years as categories
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Jumlah Pendapatan Bersih (IDR)' // Update the yAxis title
                    },
                    labels: {
                        formatter: function () {
                            return 'Rp ' + (this.value / 1000000).toLocaleString() + ' jt'; // Use toLocaleString for formatting
                        }
                    }
                },
                plotOptions: {
                    series: {
                        allowPointSelect: true
                    }
                },
        
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br />',
                    pointFormat: 'Pendapatan = Rp. {point.y}'
                },
        
                series: [
                    {
                        name: 'Total Pendapatan Bersih', // You can customize the series name
                        data: totalPendapatanArray,
                        pointStart: 0,
                        color: 'green'
                    }
                ]
            });
        },
        
        
	}
});