<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Ubah Pengguna</h1>
        <p class="m-0">Pengguna</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>user"></i>Pengguna</a></li>
          <li class="breadcrumb-item active">Ubah Pengguna</li>
        </ol>
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div><!-- /.container-fluid -->
</section>

<section class="content">
    <div class="container-fluid">
        <div class="card">
            <form class="form-horizontal" id="form" method="POST" action="" enctype="multipart/form-data">
                <input type="hidden" name="kd_kec_state" id="kd_kec_state" value="">
                <div class="card-body">
                    <input type="hidden" name="id" id="user_id" value="<?php echo $id; ?>">
                    <input type="hidden" id="role_id_selected" value="<?php echo $role_id; ?>">
                    <?php if (!empty($foto)) {?>
                    <div class="form-group row">
                        <label for="inputEmail3" class="col-sm-3 form-label"></label>
                        <div class="col-sm-4">
                            <img width="100px" src="<?php echo base_url() . "assets/images/foto/" . $foto; ?>">
                        </div>
                    </div>
                    <?php }?>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group row">
                                <label class="form-label col-sm-4">Nama Lengkap</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" id="name" placeholder="Nama Lengkap" name="name" value="<?php echo $first_name; ?>">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="form-label col-sm-4">Email</label>
                                <div class="col-sm-8">
                                    <input type="email" class="form-control" id="email" placeholder="Email" name="email" value="<?php echo $email; ?>">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label  class="form-label col-sm-4">No. Handphone</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control number" maxlength="13" id="phone" placeholder="No.Handphone" name="phone" value="<?php echo $phone; ?>">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label  class="form-label col-sm-4">Nama Bank</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" id="nama_bank" placeholder="Nama Bank" name="nama_bank" value="<?php echo $nama_bank; ?>">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label  class="form-label col-sm-4">No. Rekening</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control number" id="no_rekening" placeholder="No. Rekening" name="no_rekening" value="<?php echo $no_rekening; ?>">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="form-label col-sm-4">Alamat</label>
                                <div class="col-sm-8">
                                    <textarea class="form-control" name="address" placeholder="Alamat"><?php echo $address; ?></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group row">
                                <label class="form-label col-sm-4">Jabatan</label>
                                <div class="col-sm-8">
                                    <select id="role_id" name="role_id" class="form-control">
                                        <option value="">Pilih Jabatan</option>
                                        <?php
foreach ($roles as $key => $role) {?>
                                    <option value="<?php echo $role->id; ?>" <?php echo $role->id == $role_id ? 'selected' : '' ?>><?php echo $role->name; ?></option>
                                    <?php }
?>
                                    </select>
                                </div>
                            </div>
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