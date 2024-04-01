<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Ubah Produk</h1>
        <p class="m-0">Produk</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>produk"></i>Produk</a></li>
          <li class="breadcrumb-item active">Ubah Produk</li>
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
                      <label class="form-label col-sm-3" for="">Nama Produk</label>
                      <div class="col-sm-4">
                          <input class="form-control" type="hidden" id="id" name="id" autocomplete="off" placeholder="Nama Produk" value="<?php echo $id ?>">
                          <input class="form-control" type="text" id="name" name="name" autocomplete="off" placeholder="Nama Produk" value="<?php echo $nama ?>">
                      </div>
                  </div>
                  <div class="form-group row">
                      <label class="form-label col-sm-3" for="">Pilih Kategori Produk</label>
                      <div class="col-sm-4">
                          <select name="kategori_id" id="kategori_id" class="form-control">
                            <?php foreach ($kategori_produks as $key => $kategori_produk) { ?>
                              <option value="<?php echo $kategori_produk->id ?>" <?php if($id == $kategori_produk->id){ echo "selected"; } ?>><?php echo $kategori_produk->nama ?></option>
                            <?php } ?>
                          </select>
                      </div>
                  </div>
                  <div class="form-group row">
                      <label class="form-label col-sm-3" for="">Harga</label>
                      <div class="col-sm-4">
                          <input class="form-control" type="text" id="harga" name="harga" autocomplete="off" placeholder="Harga" value="<?php echo $harga ?>">
                      </div>
                  </div>
                  <div class="form-group row">
                    <label class="form-label col-sm-3" for="">Preview Gambar</label>
                    <div class="col-sm-4">
                      <center>
                        <a href="<?php echo base_url('uploads/produk/'.$gambar) ?>" target="_blank">
                          <img width="100" src="<?php echo base_url('uploads/produk/'.$gambar) ?>" alt="">
                        </a>
                      </center>
                    </div>
                  </div>
                  <div class="form-group row">
                      <label class="form-label col-sm-3" for="">Gambar</label>
                      <div class="col-sm-4">
                          <input class="form-control" type="file" id="gambar" name="gambar" autocomplete="off" placeholder="Gambar" value="<?php echo $gambar ?>">
                      </div>
                  </div>
                  <div class="form-group row">
                      <label class="form-label col-sm-3" for="">Status</label>
                      <div class="col-sm-4">
                          <select name="status" id="status" class="form-control">
                            <option value="0" <?php if($status == 0){ echo "selected"; } ?>>Aktif</option>
                            <option value="1" <?php if($status == 1){ echo "selected"; } ?>>Tidak Aktif</option>
                          </select>
                      </div>
                  </div>
                  <div class="form-group row">
                      <label class="form-label col-sm-3" for="">Keterangan</label>
                      <div class="col-sm-4">
                          <textarea name="keterangan" id="keterangan" class="form-control" placeholder="Keterangan" cols="30" rows="10"><?php echo $keterangan ?></textarea>
                      </div>
                  </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-sm-12 text-right">
                            <a href="<?php echo base_url() ?>produk" class="btn btn-danger">Batal</a>
                            <button type="submit" class="btn btn-primary">Simpan</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</section>


<script data-main="<?php echo base_url() ?>assets/js/main/main-produk" src="<?php echo base_url() ?>assets/js/require.js"></script>


</section>
