<!DOCTYPE html>
<html lang="en">
    <head>
		<title>BAPPEDA JABAR </title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="icon" type="image/png" href="assets/img/favicon.png" />

  <link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/css/style.css">
		<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/plugins/slick/slick-theme.css">
	  	<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/plugins/slick/slick.css">
	  	<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/plugins/bootstrap4/css/bootstrap.css"> 
	  	<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/fonts/font-awesome/css/font-awesome.css">
	  	<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/fonts/productsans.css">  
		
		<style type="text/css">
			html,body{
				height: 100%;
				min-height: 100%;
			}
		</style>
	</head>

	<body class="bg-gradient">
		
		<input type="hidden" id="base_url" value="<?php echo base_url();?>">
		<section class="home">
			<div class="home-header">
				<img src="<?php echo base_url();?>assets/img/logo-home.png">
			</div>
			<div class="home-content">
				<div class="d-block">
					<div class="button-flex dropright">
						<a href="#" class="button-round dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<img src="<?php echo base_url();?>assets/img/icon-tap.png">
						</a>
						<div class="dropdown-menu drop-to-right single-drop animate slideIn" aria-labelledby="navbarDropdown">
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>target">Target & capaian air minum</a>
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>detail">Jaringan perpipaan</a>
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>detail">Bukan jaringan perpipaan</a>
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>detail">Aman</a>
				        </div>
						<span>Air Minum</span>
					</div>
				</div>
				<div class="d-block">
					<div class="button-flex dropright">
						<a href="#" class="button-round dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<img src="<?php echo base_url();?>assets/img/icon-toilet.png">
						</a>
						<div class="dropdown-menu drop-to-right single-drop animate slideIn" aria-labelledby="navbarDropdown">
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>target">Target & capaian sanitasi</a>
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>detail">Sanitasi layak</a>
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>detail">Sanitasi belum layak</a>
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>detail">Sanitasi aman</a>
				        </div>
						<span>Air Limbah Domestik</span>
					</div>
				</div>
				<div class="d-block">
					<div class="button-flex dropright">
						<a href="#" class="button-round dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<img src="<?php echo base_url();?>assets/img/icon-trash.png">
						</a>
						<div class="dropdown-menu drop-to-right single-drop animate slideIn" aria-labelledby="navbarDropdown">
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>target">Target & capaian persampahan</a>
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>detail">Penanganan</a>
				            <a class="dropdown-item uppercase" href="<?php echo base_url();?>detail">Pengurangan</a>
				        </div>
						<span>Persampahan</span>
					</div>
				</div>
			</div>
		</section>
		
<script 
  data-main="<?php echo base_url()?>assets/js/main/main-home" 
  src="<?php echo base_url()?>assets/js/require.js">  
</script>
	</body> 
</html>