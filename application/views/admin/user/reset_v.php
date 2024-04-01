<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Reset Password</h1>
        <p class="m-0">Pengguna</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>user"></i>Pengguna</a></li>
          <li class="breadcrumb-item active">Reset Password</li>
        </ol>
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div><!-- /.container-fluid -->
</section>
<section class="content">
    <div class="container-fluid">
        <div class="card">
            <form id="form" method="post">
                <div class="card-body">
                    <div class="form-group row">
                        <label for="inputEmail3" class="col-sm-3 form-label">Password Baru</label>
                        <div class="col-sm-4">
                            <input type="hidden" class="form-control" id="email"  name="email" value="<?php echo $email ?>">
                            <input type="password" class="form-control" id="password"  name="new_password" placeholder="Password Baru">
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="inputEmail3" class="col-sm-3 form-label">Ulangi Password</label>
                        <div class="col-sm-4">
                            <input type="password" class="form-control" id="password_confirm" name="password_confirm" placeholder="Ulangi Password">
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-sm-12 text-right">
                            <a href="<?php echo base_url(); ?>user" class="btn btn-danger">Batal</a>
                            <button type="submit" class="btn btn-primary" id="save-btn">Simpan</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</section>

<script data-main="<?php echo base_url() ?>assets/js/main/main-user" src="<?php echo base_url() ?>assets/js/require.js"></script>