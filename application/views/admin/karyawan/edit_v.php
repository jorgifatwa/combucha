<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Ubah Karyawan</h1>
        <p class="m-0">Karyawan</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>karyawan"></i>Karyawan</a></li>
          <li class="breadcrumb-item active">Ubah Karyawan</li>
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
                      <label class="form-label col-sm-3" for="">Nama Karyawan</label>
                      <div class="col-sm-4">
                        <input class="form-control" type="hidden" id="id" name="id" autocomplete="off" placeholder="Nama Travel" value="<?php echo $id ?>">
                        <input class="form-control" type="text" id="name" name="name" autocomplete="off" placeholder="Nama Karyawan" value="<?php echo $nama ?>">
                      </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Email</label>
                        <div class="col-sm-4">
                            <input class="form-control" type="email" id="email" name="email" autocomplete="off" placeholder="Email" value="<?php echo $email ?>">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">No. HP</label>
                        <div class="col-sm-4">
                            <input class="form-control" type="number" id="no_hp" name="no_hp" autocomplete="off" placeholder="No. HP" value="<?php echo $no_hp ?>">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Alamat</label>
                        <div class="col-sm-4">
                            <textarea name="alamat" class="form-control" id="alamat" cols="30" rows="10"><?php echo $alamat ?></textarea>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-sm-12 text-right">
                            <a href="<?php echo base_url() ?>karyawan" class="btn btn-danger">Batal</a>
                            <button type="submit" class="btn btn-primary">Simpan</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</section>


<script data-main="<?php echo base_url() ?>assets/js/main/main-karyawan" src="<?php echo base_url() ?>assets/js/require.js"></script>


</section>
