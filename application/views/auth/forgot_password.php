<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>Belengkong Mineral Resource - Forgot Password</title>

  <!-- Custom fonts for this template-->
  <link href="<?php echo base_url();?>assets/fonts/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
  <!-- Custom styles for this template-->
  <link href="<?php echo base_url();?>assets/css/sb-admin.css" rel="stylesheet">
  <link href="<?php echo base_url();?>assets/css/custom.css" rel="stylesheet">
  <link href="<?php echo base_url();?>assets/css/responsive.css" rel="stylesheet">
  <link rel="stylesheet" href="<?php echo base_url() ?>assets/plugins/toastr/toastr.min.css">

</head>

<body>

  <div class="container">
    <img class="logo-login mb-3" src="<?php echo base_url();?>assets/img/logo.png">
    <p class="brand-name">PT BELENGKONG<br>MINERAL RESOURCES GROUP</p>

    <div class="card card-login mx-auto mt-3">
      <div class="card-body">
        <form action="<?php echo base_url() ?>auth/forgot_password" method="post" id="form">
        <?php if(!empty($this->session->flashdata('message'))){?>
          <div class="alert alert-info alert-dismissible fade show" role="alert">
            <?php   
               print_r($this->session->flashdata('message'));
            ?>
          </div>
          <?php }?>
          <div class="form-group">
            <div class="form-label-group">
              <input type="email" id="inputEmail" class="form-control form-block" placeholder="Email address" required="required" autofocus="autofocus" name="email">
              <label for="inputEmail">Email address</label>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <input type="submit" class="btn btn-darkblue btn-block" value="Kirim">
            </div>
            <div class="col-6">
              <a class="btn btn-default btn-block btn-flat" href="<?php echo base_url()?>login">Cancel</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Bootstrap core JavaScript-->
  <script data-main="<?php echo base_url()?>assets/js/main/main-password" src="<?php echo base_url()?>assets/js/require.js"></script>
  <input type="hidden" id="base_url" value="<?php echo base_url();?>">
</body>
</html>
