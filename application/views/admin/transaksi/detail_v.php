<style>
  .loading-spinner {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 10px;
  }
</style>
<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Detail Transaksi</h1>
        <p class="m-0">Transaksi</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>transaksi"></i>Transaksi</a></li>
          <li class="breadcrumb-item active">Detail Transaksi</li>
        </ol>
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div><!-- /.container-fluid -->
</section>

<section class="content">
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <?php if($this->uri->segment(4) == 'transaksi'){ ?>
          <a href="<?php echo base_url() ?>transaksi" class="btn btn-info mr-4">Kembali </a>
        <?php }else{ ?>
          <a href="<?php echo base_url() ?>transaksi/belum_lunas" class="btn btn-info mr-4">Kembali </a>
        <?php } ?>
      </div>
    </div>
    <div class="card mt-4" id="file-pdf">
      <div class="row">
        <div class="col-md-12 m-2">
          <img src="<?php echo base_url() ?>assets/images/logo_skia_hitam.png" width="300" alt="">
        </div>
      </div>
      <input type="hidden" id="nama_travel" name="nama_travel" value="<?php echo $nama_travel ?>">
      <input type="hidden" id="id_transaksi" name="id_transaksi" value="<?php echo $this->uri->segment(3);?>">
      <div class="row">
        <div class="col-md-12 m-4">
          <p class="m-0"><b>Area Perkantoran Terminal 20, No. DOD 068</b></p>
          <p class="m-0"><b>Bandara Soekarno Hatta, Tangerang</b></p>
          <p class="m-0"><b>Mobile : 0819-0616-0392</b></p>
          <p class="m-0"><u><b>E-Mail : khatulistiwasky@gmail.com</b></u></p>
          <p class="text-center m-0"><b><i>INVOICE</i></b></p>
          <hr class="m-0" width="96%" style="border: 2px solid;">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 ml-4">
          <p>Invoice No : SK-B/10-<?php echo date('Y') ?></p>
        </div>
        <style>
          .tight-spacing td,
            .tight-spacing th {
                padding: 0.10rem; /* Adjust the padding as needed */
            }
        </style>
        <div class="col-md-5">
          <table class="float-right tight-spacing">
          <?php
          $month_translation = array(
            'January' => 'Januari',
            'February' => 'Februari',
            'March' => 'Maret',
            'April' => 'April',
            'May' => 'Mei',
            'June' => 'Juni',
            'July' => 'Juli',
            'August' => 'Agustus',
            'September' => 'September',
            'October' => 'Oktober',
            'November' => 'November',
            'December' => 'Desember'
        );
        
        // Convert the date format with the Indonesian month name
        $tanggal_invoice = date("d F Y", strtotime(date('d-m-Y')));
        $tanggal_invoice = str_replace(array_keys($month_translation), array_values($month_translation), $tanggal_invoice);            
      ?>
            <tr>
              <td>Tanggal</td>
              <td>:</td>
              <td><?php echo $tanggal_invoice ?></td>
            </tr>
            <tr>
              <td>Customer</td>
              <td>:</td>
              <td><?php echo $nama_travel ?></td>
            </tr>
            <tr>
              <td>Payment</td>
              <td>:</td>
              <td>TRANSFER</td>
            </tr>
          </table>
        </div>
      </div>
      <?php
        $tanggal_format_baru = date("d F Y", strtotime($tanggal_keberangkatan));
        $tanggal_format_baru = str_replace(array_keys($month_translation), array_values($month_translation), $tanggal_format_baru);           
        $total = $jumlah_pax * $harga;
      ?>
      <div class="row text-center justify-content-center">
          <table border="1" class="col-11 m-4">
              <tr>
                <th rowspan="2">NO.</th>
                <th rowspan="2">DATE</th>
                <th rowspan="2">Flight</th>
                <th>DESCRIPTION</th>
                <th colspan="2">AMOUNT</th>
              </tr>
              <tr>
                <th>SERVICES</th>
                <th>PRICE</th>
                <th>TOTAL</th>
              </tr>
              <tr>
                <td>1.</td>
                <td><?php echo $tanggal_format_baru ?></td>
                <td><?php echo $keterangan ?></td>
                <td><?php echo number_format($jumlah_pax) ?></td>
                <td><?php echo "Rp. ".number_format($harga) ?></td>
                <td><?php echo "Rp. ".number_format($total) ?></td>
              </tr>
              <?php $no = 2;
              $sum = 0; // Initialize the sum variable
              if(!empty($biayas)){
               foreach ($biayas as $key => $biaya) { 
                $tanggal_biaya = date("d F Y", strtotime($biaya->tanggal));
                $tanggal_biaya = str_replace(array_keys($month_translation), array_values($month_translation), $tanggal_biaya);  
              ?>
              <tr>
                <td><?= $no."." ?></td>
                <td><?php echo $tanggal_biaya ?></td>
                <td><?php echo $biaya->flight ?></td>
                <td><?php echo number_format($biaya->jumlah) ?></td>
                <td><?php echo "Rp. ".number_format($biaya->harga) ?></td>
                <td><?php echo "Rp. ".number_format($biaya->harga * $biaya->jumlah) ?></td>
              </tr>
              <?php 
                  $total_biaya = $biaya->harga * $biaya->jumlah;
                  $sum += $total_biaya;
                  $no++;
                } 
              } 
              ?>
              <?php if($fee_tl > 0){ ?>
              <tr>
                <td colspan="5"><b>FEE TL</b></td>
                <td><?php echo "- Rp. ".number_format($fee_tl) ?></td>
              </tr>
              <?php $total_keseluruhan = ($sum + $total) - $fee_tl; }else{ $total_keseluruhan = ($sum + $total);  } ?>

              <tr>
                <td colspan="5"><b>TOTAL</b></td>
                <td><?php echo "Rp. ".number_format($total_keseluruhan) ?></td>
              </tr>
          </table>
      </div>
      <div class="row">
        <div class="col-md-12 m-4">
          <b><p class="m-0">Ket :</p></b>
          <b><p>1. <?php echo $keterangan_tambahan ?></p></b>
          <?php 
          $no = 2;
          if(!empty($biayas)){
               foreach ($biayas as $key => $biaya) {  ?>
          <b><p><?php echo $no.". ".$biaya->keterangan ?></p></b>
          <?php $no++; }
          } ?>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 m-4">
          <p class="m-0"><b>Terimakasih atas kepercayaan anda telah menggunakan jasa kami. “Kenyamanan anda merupakan Prioritas bagi kami”</b></p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-5 m-4">
          <p class="m-0"><b>Pembayaran pada rekening:</b></p>
          <p class="m-0"><b>Transfer via <?= $nama_bank ?></b></p>
          <p class="m-0"><b><?= $no_rekening ?> A/N <?= $this->data['users']->first_name ?></b></p>
          <p class="m-0"><b>Pembayaran via Transfer dinyatakan <?= $status ?></b></p>
          <p class="m-0"><b>Setelah disertai bukti transfer</b></p>
        </div>
        <div class="col-md-5 m-4 text-center float-right">
          <p class="m-0"><b>Tanggerang, <?= $tanggal_invoice ?></p></b>
          <p class="m-0">Hormat Kami</p>
          <img src="<?php echo base_url()?>assets/images/tanda_tangan.png" alt="">
          <p><b>Irman Taufiq</b></p>
        </div>
      </div>
    </div>
  </div>
  <div class="row p-4">
    <div class="col-md-12 text-right">
      <?php if($key_status == 1){ ?>
        <button class="btn btn-success btn-lunas mr-4" url="<?php echo base_url('transaksi/update_status/'.$this->uri->segment(3)) ?>" data-status="0"><i class="fa fa-check"></i> Lunaskan</a>
        <button class="btn btn-primary mr-4" data-toggle="modal" data-target="#biaya_tambahan_modal"><i class="fa fa-plus"></i> Biaya Tambahan</a>
        <?php } ?>
        <button class="btn btn-danger m-0" onclick="exportToPdf()"><i class="fa fa-file"></i> Export to PDF</a>
    </div>
  </div>
</section>

<div class="modal" id="biaya_tambahan_modal">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">

      <!-- Header Modal -->
      <div class="modal-header">
        <h4 class="modal-title">Data Biaya Tambahan</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>

      <!-- Body Modal -->
      <div class="modal-body">
        <!-- Formulir -->
        <div class="loading-spinner" width="40">
          <img src="<?php echo base_url() ?>assets/images/loading.gif" alt="">
        </div>
        <div id="form_biaya" method="post" action="" class="d-none">
          <form id="form_biaya_tambahan">
            <div class="form-group">
              <label for="tanggal">Tanggal</label>
              <input type="hidden" id="id_transaksi" name="id_transaksi" value="<?php echo $this->uri->segment(3);?>">
              <input type="hidden" id="id" name="id">
              <input type="hidden" id="action" name="action">
              <input type="date" class="form-control" id="tanggal" name="tanggal" placeholder="Masukkan Nama">
            </div>
            <div class="form-group">
              <label for="flight">Flight</label>
              <input type="text" class="form-control" id="flight" name="flight" placeholder="Masukkan Flight">
            </div>
            <div class="form-group">
              <label for="harga">Harga</label>
              <input type="text" class="form-control" id="harga" name="harga" placeholder="Masukkan Harga">
            </div>
            <div class="form-group">
              <label for="harga">Jumlah</label>
              <input type="text" class="form-control" id="jumlah_pax" name="jumlah" placeholder="Masukkan Jumlah">
            </div>
            <div class="form-group">
              <label for="fee">Fee</label>
              <input type="text" class="form-control" id="fee" name="fee" placeholder="Masukkan Fee">
            </div>
            <div class="form-group">
              <label for="total">Total Keseluruhan</label>
              <input type="text" class="form-control" id="total_keseluruhan" name="total_keseluruhan" placeholder="Masukkan Total Keluruhan" readonly>
            </div>
            <div class="form-group">
              <label for="keterangan">Keterangan</label>
              <input type="text" class="form-control" id="keterangan" name="keterangan" placeholder="Masukkan Keterangan">
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select name="status" id="status" class="form-control">
                <option value="">Pilih Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div class="form-group float-right">
              <button type="button" class="btn btn-primary btn-kirim">Kirim</button>
            </div>
          </form>
        </div>
        <div id="list_data">
          <div class="row">
            <div class="col-sm-12 text-right">
              <?php if ($is_can_create) {?>
                <button class="btn btn-primary btn-tambah-biaya"><i class="fa fa-plus"></i> Biaya Tambahan</button>
              <?php }?>
            </div>
          </div>
          <div class="table-responsive mt-4">
            <table class="table table-striped table-bordered" id="table-biaya" width="100%" cellspacing="0">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Flight</th>
                  <th>Harga</th>
                  <th>Jumlah</th>
                  <th>Fee</th>
                  <th>Keterangan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="modal-footer float-right">
          <button type="button" class="btn btn-danger btn-kembali d-none">Kembali</button>
          <button type="button" class="btn btn-secondary btn-tutup">Tutup</button>
      </div>

    </div>
  </div>
</div>

<div class="modal" id="keterangan_tambahan_modal">
  <div class="modal-dialog">
    <div class="modal-content">

      <!-- Header Modal -->
      <div class="modal-header">
        <h4 class="modal-title">Tambah Keterangan</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>

      <!-- Body Modal -->
      <div class="modal-body">
        <!-- Formulir -->
        <form>
          <div class="form-group">
            <label for="keterangan">Keterangan</label>
            <textarea name="keterangan_tambahan" id="keterangan_tambahan" class="form-control" placeholder="Keterangan Tambahan" cols="30" rows="5"></textarea>
          </div>
        </form>
      </div>
      
      <div class="modal-footer float-right">
          <!-- Tambahan field formulir lainnya sesuai kebutuhan -->
          <!-- Tombol untuk menutup modal -->
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
          <!-- Tombol untuk mengirim formulir (opsional) -->
          <button type="submit" class="btn btn-primary">Kirim</button>
      </div>

    </div>
  </div>
</div>
<script>
  function exportToPdf() {
      var element = document.getElementById('file-pdf');
      var options = {
                margin: 10,
                filename: 'Invoice '+$('#nama_travel').val()+'.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            };

      html2pdf(element, options);
  }
</script>
<script data-main="<?php echo base_url() ?>assets/js/main/main-transaksi" src="<?php echo base_url() ?>assets/js/require.js"></script>

</section>
