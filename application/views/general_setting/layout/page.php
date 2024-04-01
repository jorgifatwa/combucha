<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Belengkong Mineral Resource - Setting</title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="icon" type="image/png" href="assets/img/favicon.png" />
		<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/css/custom.css">
		<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/plugins/bootstrap/css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/plugins/datatables.net-bs/css/dataTables.bootstrap.min.css">
	
		<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/fonts/font-awesome/css/font-awesome.css">
		<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/fonts/ProximaNova.css"> 
		<link rel="stylesheet" href="<?php echo base_url();?>assets/plugins/select2/select2.min.css">
		<!-- <script src="<?php echo base_url()?>assets/plugins/pace/pace.js"></script> -->
  		<link href="<?php echo base_url()?>assets/plugins/pace/pace-theme-loading-bar.css" rel="stylesheet" />

		<!-- <script src="<?php echo $node_url;?>:<?php echo $node_port;?>/socket.io/socket.io.js"></script> -->
	</head> 
	<body>
		<nav class="navbar navbar-default">
		  <div class="container">
		    <!-- Brand and toggle get grouped for better mobile display -->
		    <div class="navbar-header">
		      <a class="navbar-brand" href="#"><img src="<?php echo base_url();?>assets/img/logo.png"> <span>Settings</span></a>
		    </div>
	      	<div class="nav navbar-nav navbar-right">
		      	<ul class="nav navbar-nav">
		        <li><a href="#"><i class="fa fa-arrow-left"></i> Back</a></li>
		    	</ul>
	      	</div>
		  	</div><!-- /.container-fluid -->
		</nav>
		<div class="header">
			
		</div>
		<div class="tab-content full-width optimized-height">
            <?php $this->load->view($content);?>
        </div> 

        <div class="modal" id="alert_modal">
		  <div class="modal-dialog">
		    <div class="modal-content"> 
		      <div class="modal-header alert-msg"> 
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-sm btn-default alert-cancel" data-dismiss="modal">Batal</button>
		        <button type="button" class="btn btn-sm btn-danger alert-ok">Ok</button>
		      </div>
		    </div> 
		  </div> 
		</div>

		<div class="modal" id="alert_confirm">
		  <div class="modal-dialog">
		    <div class="modal-content"> 
		      <div class="modal-header alert-msg"> 
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-sm btn-default alert-cancel" data-dismiss="modal">Batal</button>
		        <button type="button" class="btn btn-sm btn-danger alert-ok" id="btn-alert-approve">Ok</button>
		      </div>
		    </div> 
		  </div> 
		</div>

        <!-- <input type="hidden" id="node_url" value="<?php echo $node_url;?>">
        <input type="hidden" id="node_port" value="<?php echo $node_port;?>">
		<input type="hidden" id="base_url" value="<?php echo base_url();?>">
		<input type="hidden" id="cloud_url" value="<?php echo $cloud_url;?>">
		<input type="hidden" id="menu_privilleges" value='<?php echo $this->data['menu_privilleges']?>'>
		<input type="hidden" id="is_kitchen_display" value="1"> -->
	  
	</body>
	<input type="hidden" id="base_url" value="<?php echo base_url(); ?>">
	<input type="hidden" id="cloud_url" value="<?php echo $this->config->item('cloud_url'); ?>">
</html>