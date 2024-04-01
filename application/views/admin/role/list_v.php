<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Jabatan</h1>
        <p class="m-0">Kelola Akun</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>dashboard"><i class="fa fa-dashboard"></i> Home</a></li>
          <li class="breadcrumb-item active">Jabatan</li>
        </ol>
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div><!-- /.container-fluid -->
</section>

<section class="content">
  <div class="container-fluid">
    <div class="card mb-3">
      <div class="card-header">
        <div class="row">
          <div class="col-sm-12 text-right">
            <?php if ($is_can_create) {?>
              <a href="<?php echo base_url() ?>role/create" class="btn btn-primary"><i class="fa fa-plus"></i> Jabatan</a>
            <?php }?>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-bordered" id="table" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>Jabatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>
 <script data-main="<?php echo base_url() ?>assets/js/main/main-role" src="<?php echo base_url() ?>assets/js/require.js"></script>