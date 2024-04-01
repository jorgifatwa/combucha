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
                    // App.grafikPendapatan(data.grafik, data.tahun);
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
                    // App.grafikPendapatanPerTahun(data.grafik);
                },
                error : function(data) {
                    // do something
                }
            });

            $.ajax({
                url : App.baseUrl+"dashboard/grafikTravel",
                type : "GET",
                success : function(data) {
                    var data = JSON.parse(data);
                    // App.grafikTravel(data.grafik);
                },
                error : function(data) {
                    // do something
                }
            });

            $.ajax({
                url : App.baseUrl+"dashboard/grafikPengeluaranKaryawan",
                type : "GET",
                success : function(data) {
                    var data = JSON.parse(data);
                    // App.grafikPengeluaranKaryawan(data.grafik);
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
            var totalBersihArray = grafikArray.map(function (item) {
                return parseInt(item.total_bersih);
            });
            var totalPengeluaranArray = grafikArray.map(function (item) {
                return parseInt(item.total_pengeluaran);
            });

            var totalJumlahPaxnArray = grafikArray.map(function (item) {
                return parseInt(item.total_jumlah);
            });

            var totalPengeluaranKaryawanArray = grafikArray.map(function (item) {
                return parseInt(item.total_pengeluaran_karyawan);
            });

            Highcharts.chart('container-grafik-pendapatan', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Pendapatan Kotor Perbulan'
                },
                subtitle: {
                    text: 'SKIA'
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
                        text: 'Jumlah Pendapatan Kotor (jt IDR)' // Update the yAxis title
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
                    name: 'Total Pendapatan Kotor',
                    data: totalPendapatanArray,
                    pointStart: 0,
                }, 
                {
                    name: 'Total Pendapatan Bersih',
                    data: totalBersihArray,
                    pointStart: 0,
                    color: 'green'
                }]
            });

            Highcharts.chart('container-grafik-pengeluaran', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Pengeluaran Operasional / MOB Perbulan'
                },
                subtitle: {
                    text: 'SKIA'
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
                        text: 'Jumlah Pengeluaran Operasional / MOB (IDR)' // Update the yAxis title
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
                    pointFormat: 'Pengeluaran = Rp. {point.y}'
                },
            
                series: [{
                    name: 'Total Pengeluaran Operasional / MOB',
                    data: totalPengeluaranArray,
                    pointStart: 0,
                }]
            });

            Highcharts.chart('container-grafik-jumlah-pax', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Jumlah Pax'
                },
                subtitle: {
                    text: 'SKIA'
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
                        text: 'Jumlah Pax'
                    }
                },
                plotOptions: {
                    series: {
                        allowPointSelect: true
                    }
                },
            
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br />',
                    pointFormat: 'Jumlah = {point.y}'
                },
            
                series: [{
                    name: 'Total Jumlah Pax Keberangkatan',
                    data: totalJumlahPaxnArray,
                    pointStart: 0,
                }]
            });

            Highcharts.chart('container-grafik-pengeluaran-karyawan', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Pengeluaran Karyawan Perbulan'
                },
                subtitle: {
                    text: 'SKIA'
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
                        text: 'Jumlah Pengeluaran Karyawan (IDR)' // Update the yAxis title
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
                    pointFormat: 'Pengeluaran = Rp. {point.y}'
                },
            
                series: [{
                    name: 'Total Pengeluaran Karyawan',
                    data: totalPengeluaranKaryawanArray,
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

            var totalPendapatanBersihArray = grafikArray.map(function(item) {
                return parseInt(item.total_bersih);
            });
        
            Highcharts.chart('container-grafik-pendapatan-pertahun', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Pendapatan Kotor Pertahun'
                },
                subtitle: {
                    text: 'SKIA'
                },
        
                xAxis: {
                    categories: years, // Use years as categories
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Jumlah Pendapatan Kotor (IDR)' // Update the yAxis title
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
                        name: 'Total Pendapatan Kotor', // You can customize the series name
                        data: totalPendapatanArray,
                        pointStart: 0
                    },
                    {
                        name: 'Total Pendapatan Bersih', // You can customize the series name
                        data: totalPendapatanBersihArray,
                        pointStart: 0,
                        color: 'green'
                    }
                ]
            });
        },

        grafikTravel: function(data) {
            // Assuming data.grafik is an object with travel_id as keys
            var travelData = data;
        
            // Get unique travel_id values from the data
            var travelIds = Object.keys(travelData);
        
            // Create an array to store series data
            var seriesData = [];
        
            // Loop through each travel_id
            travelIds.forEach(function (travelId) {
                var travelInfo = travelData[travelId];
                travelInfo = Object.values(travelInfo);
        
                // Accessing total_pendapatan array for each travel_id
                var totalPendapatanArray = travelInfo.map(function (item) {
                    return parseInt(item.transaction_count);
                });
        
                // Create a series object for each travel_id
                var seriesObject = {
                    name: travelId,
                    data: totalPendapatanArray,
                    pointStart: 0,
                };
        
                // Push the series object to the array
                seriesData.push(seriesObject);
            });
        
            Highcharts.chart('container-grafik-travel', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Total Keberangkatan Pertravel'
                },
                subtitle: {
                    text: 'SKIA'
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
                        text: 'Jumlah Travel Keberangkatan'
                    }
                },
                plotOptions: {
                    series: {
                        allowPointSelect: true
                    }
                },
        
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br />',
                    pointFormat: 'Jumlah = {point.y}'
                },
        
                // Use the seriesData array to populate the series
                series: seriesData
            });
        },

        grafikPengeluaranKaryawan: function(data) {
            // Assuming data.grafik is an object with travel_id as keys
            var travelData = data;
        
            // Get unique travel_id values from the data
            var travelIds = Object.keys(travelData);
        
            // Create an array to store series data
            var seriesData = [];
        
            // Loop through each travel_id
            travelIds.forEach(function (travelId) {
                var travelInfo = travelData[travelId];
                travelInfo = Object.values(travelInfo);
        
                // Accessing total_pendapatan array for each travel_id
                var totalPendapatanArray = travelInfo.map(function (item) {
                    return parseInt(item.pengeluaran_count);
                });
        
                // Create a series object for each travel_id
                var seriesObject = {
                    name: travelId,
                    data: totalPendapatanArray,
                    pointStart: 0,
                };
        
                // Push the series object to the array
                seriesData.push(seriesObject);
            });
        
            Highcharts.chart('container-grafik-pengeluaran-perkaryawan', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Total Pengeluaran Perkaryawan Perbulan'
                },
                subtitle: {
                    text: 'SKIA'
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
                        text: 'Total Pengeluaran (IDR)' // Update the yAxis title
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
                    pointFormat: 'Total = Rp. {point.y}'
                },
        
                // Use the seriesData array to populate the series
                series: seriesData
            });
        },
        
        
	}
});