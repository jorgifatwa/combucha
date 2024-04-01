<nav class="main-header navbar navbar-expand navbar-white navbar-light">
	<!-- Left navbar links -->
	<ul class="navbar-nav">
		<li class="nav-item">
			<a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
		</li>
	</ul>

	<!-- Right navbar links -->
	<ul class="navbar-nav ml-auto">
		<!-- Messages Dropdown Menu -->
		<li class="nav-item dropdown">
			<a class="nav-link" data-toggle="dropdown" href="#">
				<!-- <img src="<?php echo base_url() ?>assets/img/avatar.jpg" class="user-image" alt="User Image"> -->
			  	<span class="hidden-xs"><?php echo $this->data['users']->first_name.$this->data['users']->last_name ?></span>
			</a>
			<div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
				<a href="<?php echo base_url() ?>profile" class="dropdown-item dropdown-footer">Profile</a>
				<div class="dropdown-divider"></div>
				<a href="#" data-toggle="modal" data-target="#logoutModal" class="dropdown-item dropdown-footer">Log Out</a>
			</div>
		</li>
		<li class="nav-item">
			<a class="nav-link" data-widget="fullscreen" href="#" role="button">
				<i class="fas fa-expand-arrows-alt"></i>
			</a>
	  	</li>
	</ul>
</nav>
