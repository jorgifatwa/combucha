<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Transaksi Belum Lunas</h1>
        <p class="m-0">Data Transaksi</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>dashboard"><i class="fa fa-dashboard"></i> Home</a></li>
          <li class="breadcrumb-item active">Transaksi</li>
        </ol>
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div><!-- /.container-fluid -->
</section>

<section class="content">
  <div class="container-fluid">
    <div class="card mb-3">
        <div class="card-header">
            <h3>Filter</h3>
              <div class="row">
                <div class="col-sm-6">
                  <label for="">Bulan</label>
                  <select name="bulan" id="bulan" class="form-control">
                  <option value=""></option>
                    <?php foreach ($bulan as $key => $bulan) { ?>
                      <option value="<?= $key ?>"><?= $bulan ?></option>
                    <?php } ?>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label for="">Travel</label>
                  <select name="travel_id" id="travel_id">
                      <option value=""></option>
                    <?php foreach ($travels as $key => $travel) { ?>
                      <option value="<?= $travel->id ?>"><?= $travel->nama ?></option>
                    <?php } ?>
                  </select>
                </div>
              </div>
              <div class="row col-md-12 mt-3 mr-0">
                <div class="col-md-12">
                  <button id="btn-cari" style="margin-right: -23px !important" class="btn float-right col-md-1 btn-lg btn-primary">Cari</button>
                  <button id="btn-reset" class="btn mr-2 float-right col-md-1 btn-lg btn-danger">Reset</button>
                </div>
              </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-striped table-bordered" id="table-belum-lunas" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Tanggal Keberangkatan</th>
                            <th>No. Flight</th>
                            <th>Nama Travel</th>
                            <th>Harga</th>
                            <th>Jumlah Pax</th>
                            <th>Status</th>
                            <th>Keterangan</th>
                            <th>Nama Karyawan</th>
                            <th width="20%">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
<script data-main="<?php echo base_url() ?>assets/js/main/main-transaksi" src="<?php echo base_url() ?>assets/js/require.js"></script>