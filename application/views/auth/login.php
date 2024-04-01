<!DOCTYPE html>
<html lang="en" style="height: 100%;">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>Combucha - Login     </title>

  <!-- Custom fonts for this template-->
  <link rel="icon" type="image/x-icon" href="<?php echo base_url() ?>assets/images/icon.png">
  <link href="<?php echo base_url();?>assets/fonts/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <!-- Custom styles for this template-->
  <link href="<?php echo base_url();?>assets/css/sb-admin.css" rel="stylesheet">
  <link href="<?php echo base_url();?>assets/css/custom.css" rel="stylesheet">
  <link href="<?php echo base_url();?>assets/css/responsive.css" rel="stylesheet">

</head>

<body class="h-100">

  <div class="container-fluid h-100">
    <div class="row h-100">
      <div class="col-md-8 bg-login h-100">
        <div class="login-illustration h-100">
          <div class="login-flex mt-5">
            <img src="<?php echo base_url();?>assets/images/logo-no-bg.png" style="width: 600px;">
            <h5 class="greeting" style="margin-top: -200px">Selamat Datang di <br><span>Aplikasi Pengelolaan Cafe Combucha</span></h5>
            <!-- <div class="text-center"><button type="button" class="btn btn-darkblue" data-toggle="modal" data-target="#exampleModal">Help</button></div> -->
          </div>
        </div>
      </div>
      <div class="col-md-4 h-100 login-form bg-white">
        <div class="login-flex">
          <div class="login-greeting">
            <p>Halo!<br><span>Silahkan login ke akun anda</span></p>
          </div>
          <div class="mt-3">
            <div class="">
              <form action="<?php echo base_url();?>auth/login" method="post" id="form-login">
                 <?php if(!empty($this->session->flashdata('message_error'))){?>
                <div class="alert alert-danger">
                  <?php   
                     print_r($this->session->flashdata('message_error'));
                  ?>
                   
                  </div>
                <?php }?>
                <div class="form-group">
                  <div class="form-label-group">
                    <input type="email" id="inputEmail" class="form-control form-block" placeholder="Email address" required="required" autofocus="autofocus" name="username">
                    <label for="inputEmail">Email address</label>
                  </div>
                </div>
                <div class="form-group">
                  <div class="form-label-group">
                    <input type="password" id="inputPassword" class="form-control form-block" placeholder="Password" required="required" name="password">
                    <i class="far fa-eye" id="togglePassword" style="cursor: pointer;"></i>
                    <label for="inputPassword">Password</label>
                  </div>
                </div> 
                <button class="btn btn-darkblue btn-block" style="background: #000 !important;" id="btn-login">Login</button>
              </form>
              <div class="row">
                <!-- <div class="col-12">
                  <a class="float-right text-darkblue mt-3 small" href="<?php echo base_url()?>auth/forgot_password">Forgot Password?</a>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Help</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Jika butuh bantuan hubungi kontak Admin 0877 3000 0562
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

  <!-- Bootstrap core JavaScript-->
  <!-- <script src="vendor/jquery/jquery.min.js"></script> -->
  <!-- <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script> -->

  <!-- Core plugin JavaScript-->
  <!-- <script src="vendor/jquery-easing/jquery.easing.min.js"></script> -->

  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<script data-main="<?php echo base_url()?>assets/js/main/main-login" src="<?php echo base_url()?>assets/js/require.js"></script>
  <input type="hidden" id="base_url" value="<?php echo base_url();?>">
</body>
</html>
