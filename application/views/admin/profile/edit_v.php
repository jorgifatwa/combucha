<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Profil Pengguna</h1>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>profile"></i>Profile</a></li>
          <li class="breadcrumb-item active">Profile Pengguna</li>
        </ol>
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div><!-- /.container-fluid -->
</section>
<section class="content">
    <div class="container-fluid">
        <div class="card">
            <form id="form" method="post" enctype="multipart/form-data">
                <div class="card-body">
                  <div class="form-group row">
                      <label class="form-label col-sm-3" for="">Nama Lengkap</label>
                      <div class="col-sm-9">
                          <input type="text" class="form-control" id="nama_lengkap" readonly placeholder="Nama Lengkap" name="nama_lengkap" value="<?php echo $name;?>">
                      </div>
                  </div>
                  <div class="form-group row">
                      <label class="form-label col-sm-3" for="">Email</label>
                      <div class="col-sm-9">
                          <input type="text" class="form-control" id="nama_lengkap" readonly placeholder="Email" name="email" value="<?php echo $email;?>">
                      </div>
                  </div>
                  <div class="form-group row">
                      <label class="form-label col-sm-3" for="">No. Handphone</label>
                      <div class="col-sm-9">
                          <input type="text" class="form-control" id="nama_lengkap" readonly placeholder="Nomor Handphone" name="phone" value="<?php echo $phone;?>">
                      </div>
                  </div>
                  <div class="form-group row">
                      <label class="form-label col-sm-3" for="">Alamat</label>
                      <div class="col-sm-9">
                          <textarea name="alamat" readonly id="alamat" class="form-control" placeholder="Alamat" cols="30" rows="10"><?php echo $address ?></textarea>
                      </div>
                  </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-sm-12 text-right">
                            <a href="<?php echo base_url() ?>dashboard" class="btn btn-secondary">Kembali</a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</section>


 <script data-main="<?php echo base_url()?>assets/js/main/main-profile" src="<?php echo base_url()?>assets/js/require.js"></script>
