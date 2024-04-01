<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Pesanan</h1>
        <p class="m-0">Transaksi</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>dashboard"><i class="fa fa-dashboard"></i> Home</a></li>
          <li class="breadcrumb-item active">Pesanan</li>
        </ol>
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div><!-- /.container-fluid -->
</section>

<section class="content">
  <div class="container-fluid">
    <div class="card mb-3">
      <div class="card-header">
          <h3>Keranjang</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="container mt-4 cart-container">
              <table class="table cart-table">
                  <thead>
                      <tr>
                          <th>Produk</th>
                          <th>Harga</th>
                          <th>Jumlah</th>
                          <th>Aksi</th>
                      </tr>
                  </thead>
                  <tbody id="cart-items">
                      <!-- Cart items will be displayed here -->
                  </tbody>
                  <tfoot>
                    <tr>
                        <td colspan="3" class="text-right">Subtotal:</td>
                        <td><span id="subtotal">Rp. 0.00</span></td>
                    </tr>
                    <tr>
                        <td colspan="3" class="text-right">Total:</td>
                        <td><span id="total">Rp. 0.00</span></td>
                    </tr>
                </tfoot>
              </table>
              <div class="text-right mt-3">
                  <button id="checkout" class="btn btn-success">Checkout</button>
                  <button id="clear-cart" class="btn btn-danger">Clear Cart</button>
              </div>
          </div>
        </div>
      </div>    
    </div>
    <div class="card mb-3">
        <div class="card-header">
            <div class="row">
              <h3>Daftar Menu</h3>
            </div>
        </div>
        <div class="card-body">
          <div class="row mt-3 mb-3">
            <div class="col-md-12">
              <form id="search-form" action="<?php echo site_url('pesanan/search'); ?>" method="post">
                <div class="form-group row">
                  <div class="input-group col-md-12">
                    <input type="text" name="keyword" class="form-control" placeholder="Cari produk">
                    <div class="input-group-append">
                      <button type="submit" class="btn btn-primary">Cari</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="row" id="data-produk">
            <?php foreach ($data_produks as $key => $produk) { ?>
            <div class="col-md-4">
              <div class="card" style="width: 18rem; height: 28rem;">
                <img src="<?php echo base_url('uploads/produk/'.$produk->gambar) ?>" class="card-img-top" alt="<?php echo $produk->nama ?>">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-12">
                      <h5 class="card-title"><?php echo $produk->nama ?></h5>
                      <p class="card-text text-secondary"><?php echo $produk->keterangan ?></p>
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="row">
                    <div class="col-md-4">
                      <p><?php echo "Rp.".number_format($produk->harga) ?></p>
                    </div>
                    <div class="col-md-8 text-right">
                      <a href="#" class="btn btn-primary add-to-cart" data-id="<?php echo $produk->id ?>" data-name="<?php echo $produk->nama ?>" data-price="<?php echo $produk->harga ?>" data-image="<?php echo $produk->gambar ?>">Tambah</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <?php } ?>
          </div>
        </div>
      </div>
      <div class="pagination-links text-right mb-2">
          <nav aria-label="Page navigation">
                  <?php echo $links; ?>
          </nav>
      </div>
</section>
<script data-main="<?php echo base_url() ?>assets/js/main/main-pesanan" src="<?php echo base_url() ?>assets/js/require.js"></script>