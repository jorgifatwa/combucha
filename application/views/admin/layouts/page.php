<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php $this->load->view("admin/layouts/header");?>
<body class="hold-transition sidebar-mini sidebar-collapse layout-fixed">
	<!-- <div class="loadingpage" >
		<div class="loading-container">
			<div class="loader">
			<img src="<?php echo base_url() ?>assets/images/logo.png">
		  </div>
		</div>
	</div> -->
	<div class="wrapper">
		<?php $this->load->view("admin/layouts/topbar");?>
		<?php $this->load->view("admin/layouts/sidemenu");?>
		<div class="content-wrapper">
			<?php $this->load->view($content);?>
		</div>
		<?php $this->load->view("admin/layouts/footer");?>
		<?php $this->load->view('errors/html/alert_error')?>

		<div class="modal fade" id="logoutModal">
        	<div class="modal-dialog">
          		<div class="modal-content">
					<div class="modal-body">
						<p>Apakah anda yakin akan keluar dari aplikasi ?</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-dismiss="modal">Batal</button>
						<a href="<?php echo base_url('auth/logout'); ?>" class="btn btn-danger">Keluar</a>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="alert_modal">
        	<div class="modal-dialog">
          		<div class="modal-content">
					<div class="modal-body">
						<div class="modal-title"></div>
						<div class="alert-msg"></div>
					</div>
					<div class="modal-footer">
						<a href="<?php echo base_url('auth/logout'); ?>" class="btn btn-danger d-none">Keluar</a>
						<button type="button" class="btn btn-primary alert-cancel d-none" data-dismiss="modal">Batal</button>
						<button type="button" class="btn btn-danger alert-ok d-none" data-dismiss="modal">Ok</button>
					</div>
				</div>
			</div>
		</div>

				<div class="modal modal-blur fade in" id="alert_approval" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-sm modal-dialog-centered" role="document">
						<div class="modal-content">
							<div class="modal-body">
								<div class="modal-title"></div>
								<div class="alert-msg"></div>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-link link-secondary me-auto  alert-cancel" data-dismiss="modal">Batal</button>
								<button type="button" class="btn btn-danger alert-reject" data-dismiss="modal">Tidak Setuju</button>
								<button type="button" class="btn btn-success alert-approve" data-dismiss="modal">Setuju</button>
							</div>
						</div>
					</div>
				</div>

				<div class="modal modal-blur fade in" id="alert_rejection" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-sm modal-dialog-centered" role="document">
						<form class="modal-content" action="" method="post" id="form_reject">
							<div class="modal-body">
								<div class="modal-title">Rejection</div>
								<div class="form-group">
									<label class="form-label">Alasan (*)</label>
									<input type="text" class="form-control" name="reason" placeholder="Tuliskan alasan disini ..." required>
								</div>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-link link-secondary me-auto  alert-cancel" data-dismiss="modal">Batal</button>
								<button type="submit" class="btn btn-danger">Tolak</button>
							</div>
						</form>
					</div>
				</div>

				<div class="modal" data-backdrop="false" id="modalEvent">
					<div class="modal-dialog">
						<div class="modal-content">

						<!-- Modal Header -->
						<div class="modal-header">
							<h4 class="modal-title">Tambah Plan</h4>
							<button type="button" class="close" id="closeButton" data-dismiss="modal">&times;</button>
						</div>

						<!-- Modal body -->
						<div class="modal-body">
						<form id="form-create" method="post">
						<div class="form-group">
							<label for="">Nilai</label>
							<input class="form-control" type="number" placeholder="Nilai" name="nilai" id="nilai">
						</div>
						<input type="hidden" id="id_plan" name="id_plan" class="form-control">
							<input type="hidden" id="tanggal" name="tanggal" class="form-control" placeholder="Tanggal">
						</div>

						<!-- Modal footer -->
						<div class="modal-footer">
							<button type="button" class="btn btn-light" id="cancelButton" data-dismiss="modal">Batal</button>
							<button type="submit" class="btn btn-primary">Simpan</button>
						</div>
						</form>
						</div>
					</div>
				</div>

				<div class="modal" data-backdrop="false" id="modalRns">
					<div class="modal-dialog">
						<div class="modal-content">

						<!-- Modal Header -->
						<div class="modal-header">
							<h4 class="modal-title">Tambah Plan</h4>
							<button type="button" class="close" id="closeButton" data-dismiss="modal">&times;</button>
						</div>

						<!-- Modal body -->
						<div class="modal-body">
						<form id="form-create" method="post">
						<div class="form-group">
							<label for="">RNS</label>
							<input class="form-control" type="number" placeholder="RNS" name="rns" id="rns">
						</div>
						<div class="form-group">
							<label for="">Rainfall</label>
							<input class="form-control" type="number" placeholder="Rainfall" name="rainfall" id="rainfall">
						</div>
						<input type="hidden" id="id_plan" name="id_plan" class="form-control">
							<input type="hidden" id="tanggal" name="tanggal" class="form-control" placeholder="Tanggal">
						</div>

						<!-- Modal footer -->
						<div class="modal-footer">
							<button type="button" class="btn btn-light" id="cancelButton" data-dismiss="modal">Batal</button>
							<button type="submit" class="btn btn-primary">Simpan</button>
						</div>
						</form>
						</div>
					</div>
				</div>

				<div class="modal" data-backdrop="false" id="modal-production">
					<div class="modal-dialog">
						<div class="modal-content">

						<!-- Modal Header -->
						<div class="modal-header">
							<h4 class="modal-title">Tambah Production JS</h4>
							<button type="button" class="close" id="closeButton" data-dismiss="modal">&times;</button>
						</div>

						<!-- Modal body -->
						<div class="modal-body">
						<form id="form-create-production" method="post">
						<div class="form-group">
							<label for="">Total Production</label>
							<input class="form-control" type="number" placeholder="Total Production" name="total_production" id="total_production">
						</div>
						<div class="form-group">
							<label for="">Bulan</label>
							<select name="bulan_production" id="bulan_production" class="form-control">
								<option value="">Pilih Bulan</option>
								<?php foreach ($bulan as $key => $bln) {?>
									<option value="<?php echo $key ?>"><?php echo $bln ?></option>
								<?php }?>
							</select>
						</div>
						<div class="form-group">
							<label for="">Tahun</label>
							<select name="tahun_production" id="tahun_production" class="form-control">
								<option value="">Pilih Tahun</option>
								<?php for ($i = 2011; $i <= date('Y'); $i++) {?>
									<option value="<?php echo $i ?>"><?php echo $i ?></option>
								<?php }?>
							</select>
						</div>
						</div>

						<!-- Modal footer -->
						<div class="modal-footer">
							<button type="button" class="btn btn-light" id="btn-reset">Batal</button>
							<button type="submit" class="btn btn-primary">Simpan</button>
						</div>
						</form>
						</div>
					</div>
				</div>

				<div class="modal" data-backdrop="false" id="modal-set-joki">
					<div class="modal-dialog">
						<div class="modal-content">

						<!-- Modal Header -->
						<div class="modal-header">
							<h4 class="modal-title">Set Joki</h4>
							<button type="button" class="close" id="closeButton" data-dismiss="modal">&times;</button>
						</div>

						<!-- Modal body -->
						<div class="modal-body">
						<form id="form-create-production" method="post">
						<div class="form-group">
							<label for="">Joki</label>
							<input type="hidden" name="url" id="url">
							<input type="hidden" name="id" id="id">
							<select name="id_joki" id="id_joki" class="form-control">
								<option value="">Pilih Joki</option>
								<?php foreach ($jokis as $joki) {?>
									<option value="<?php echo $joki->id ?>"><?php echo $joki->name ?></option>
								<?php }?>
							</select>
						</div>
						</div>

						<!-- Modal footer -->
						<div class="modal-footer">
							<button type="button" class="btn btn-light" id="btn-batal">Batal</button>
							<button type="button" class="btn btn-primary" id="btn-simpan">Simpan</button>
						</div>
						</form>
						</div>
					</div>
				</div>

				<div class="modal fade" id="fullCalModal">
					<div class="modal-dialog">
						<div class="modal-content">

						<!-- Modal Header -->
						<div class="modal-header">
							<h4 class="modal-title" id="modalTitle"></h4>
							<button type="button" class="close" data-dismiss="modal">&times;</button>
						</div>

						<!-- Modal body -->
						<div class="modal-body">
							<p id="modalBody"></p>
						</div>

						<!-- Modal footer -->
						<div class="modal-footer">
							<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
						</div>

						</div>
					</div>
				</div>
		</div>
	</div>
</body>
<input type="hidden" id="base_url" value="<?php echo base_url(); ?>">
<input type="hidden" id="cloud_url" value="<?php echo $this->config->item('cloud_url'); ?>">
</html>
