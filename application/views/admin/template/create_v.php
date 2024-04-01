<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Template Baru</h1>
        <p class="m-0">Template</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>template"></i>Template</a></li>
          <li class="breadcrumb-item active">Template Baru</li>
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
                        <label class="form-label col-sm-3" for="">Paket</label>
                        <div class="col-sm-4">
                            <select name="id_paket" id="id_paket" class="form-control">
                                <option value="">Pilih Paket</option>
                                <?php foreach ($pakets as $paket) {?>
                                <option value="<?php echo $paket->id ?>"><?php echo $paket->name ?></option>
                                <?php }?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="form-label col-sm-3" for="">Pesan</label>
                        <div class="col-sm-4">
                            <textarea name="pesan" id="pesan" class="form-control" cols="30" rows="5"></textarea>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-sm-12 text-right">
                            <a href="<?php echo base_url() ?>template" class="btn btn-danger">Batal</a>
                            <button type="submit" class="btn btn-primary">Simpan</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</section>


<script data-main="<?php echo base_url() ?>assets/js/main/main-template" src="<?php echo base_url() ?>assets/js/require.js"></script>