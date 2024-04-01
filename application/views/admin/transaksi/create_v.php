<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Transaksi Baru</h1>
        <p class="m-0">Transaksi</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>transaksi"></i>Transaksi</a></li>
          <li class="breadcrumb-item active">Transaksi Baru</li>
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
                        <label class="form-label col-sm-3" for="">Tanggal Keberangkatan</label>
                        <div class="col-sm-4">
                            <input class="form-control" type="date" id="tanggal_keberangkatan" name="tanggal_keberangkatan" autocomplete="off" placeholder="Tanggal Keberangkatan">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">No. Flight</label>
                        <div class="col-sm-4">
                            <input class="form-control" type="text" id="no_flight" name="no_flight" autocomplete="off" placeholder="No. Flight">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Nama Travel</label>
                        <div class="col-sm-4">
                            <select name="travel_id" id="travel_id" class="formn-control">
                                <option value="">Pilih Travel</option>
                                <?php foreach ($travels as $key => $travel) { ?>
                                    <option value="<?php echo $travel->id ?>"><?php echo $travel->nama ?></option>
                                <?php } ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Harga</label>
                        <div class="col-sm-4">
                            <input class="form-control" type="text" id="harga" name="harga" autocomplete="off" placeholder="Harga">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Jumlah Pax</label>
                        <div class="col-sm-4">
                            <input class="form-control" type="text" id="jumlah_pax" name="jumlah_pax" autocomplete="off" placeholder="Jumlah Pax">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Total Keseluruhan</label>
                        <div class="col-sm-4">
                            <input class="form-control" type="text" id="total_keseluruhan" name="total_keseluruhan" autocomplete="off" placeholder="Total Keseluruhan" readonly>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Status</label>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" name="status_text" id="status_text" value="Belum Lunas" readonly>
                            <input type="hidden" class="form-control" name="status" value="1">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Flight</label>
                        <div class="col-sm-4">
                            <input class="form-control" type="text" id="flight" name="flight" autocomplete="off" placeholder="Flight">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Fee TL</label>
                        <div class="col-sm-4">
                            <input class="form-control" type="text" id="fee_tl" name="fee_tl" autocomplete="off" placeholder="Fee TL">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Keterangan</label>
                        <div class="col-sm-4">
                            <textarea name="keterangan_tambahan" class="form-control" id="keterangan_tambahan" cols="30" rows="10" placeholder="Keterangan"></textarea>
                        </div>
                    </div>

                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-sm-12 text-right">
                            <a href="<?php echo base_url() ?>transaksi" class="btn btn-danger">Batal</a>
                            <button type="submit" class="btn btn-primary">Simpan</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</section>


<script data-main="<?php echo base_url() ?>assets/js/main/main-transaksi" src="<?php echo base_url() ?>assets/js/require.js"></script>