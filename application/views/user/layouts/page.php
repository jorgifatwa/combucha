<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html>
<html lang="en">
	<?php $this->load->view("user/layouts/header");?>  
	<body class="bg-light"> 
		<?php $this->load->view("user/layouts/menu");?> 
		<section class="section-pad">
			<?php $this->load->view($content);?> 
		</section>
	 	<?php $this->load->view("user/layouts/footer");?>
		
		<input type="hidden" id="base_url" value="<?php echo base_url();?>">
	</body>
</html>
