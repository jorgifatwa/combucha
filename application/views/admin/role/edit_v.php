<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Ubah Jabatan</h1>
        <p class="m-0">Jabatan</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>role"></i>Jabatan</a></li>
          <li class="breadcrumb-item active">Ubah Jabatan</li>
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
          <div class="row">
            <div class="col-md-12">
            <div class="form-group row">
              <label class="form-label col-sm-3" for="">Nama Jabatan</label>
                <div class="col-sm-4">
                  <input class="form-control" value="<?php echo $name; ?>" type="text" id="name" name="name" autocomplete="off" placeholder="Nama Jabatan" required>
                </div>
              </div>
              <!-- <div class="form-group row">
                <label class="form-label col-sm-3" for="">Deskripsi</label>
                <div class="col-sm-4">
                  <textarea class="form-control" id="description" name="description" autocomplete="off"><?php echo $description; ?></textarea>
                </div>
              </div> -->
            </div>
          </div>
        </div>
         <div class="card-footer">
          <div class="row">
            <div class="col-sm-12 text-right">
              <a href="<?php echo base_url(); ?>role" class="btn btn-danger">Batal</a>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</section>


<script data-main="<?php echo base_url() ?>assets/js/main/main-role" src="<?php echo base_url() ?>assets/js/require.js"></script>


</section>
