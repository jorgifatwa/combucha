<form id="form_privileges" method="POST" class="form-horizontal" action="">
<input type="hidden" name="role_id" value="<?php echo $id ?>">
<section class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">Hak Akses</h1>
        <p class="m-0">Jabatan</p>
      </div><!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href="<?php echo base_url() ?>role"></i>Jabatan</a></li>
          <li class="breadcrumb-item active">Hak Akses</li>
        </ol>
      </div><!-- /.col -->
    </div><!-- /.row -->
  </div><!-- /.container-fluid -->
</section>

<section class="content">
	<div class="card">
		<div class="container-fluid">
			<div class="card-body">
				<div role="tabpanel">
		<!-- Nav tabs -->

		<!-- Tab panes -->
					<div class="tab-content">
						<div role="tabpanel" class="tab-pane active" id="home">
							<table id="tabweb" class="table table-striped">
								<thead>
									<th style="width:70px"> <label class="mar-0 control control--checkbox"><input type="checkbox" id="checkAll"><div class="control__indicator" style="top:-15px;"></div></label ></th>
									<th>Menu</th>
									<th>Fungsi</th>
								</thead>
								<tbody>
								<?php
function isMenuSelected($menu_selecteds, $menu_id, $count) {
	foreach ($menu_selecteds as $key => $value) {
		if ($menu_id == $value['menu_id'] && (count($value['functions']) == $count)) {
			return true;
		}
	}
	return false;
};
function isMenuFunctionSelected($menu_selecteds, $menu_id, $function_id) {
	foreach ($menu_selecteds as $key => $menus) {
		if ($menu_id == $menus['menu_id']) {
			foreach ($menus['functions'] as $key => $function) {
				if ($function_id == $function['id']) {
					return true;
				}
			}
		}
	}
	return false;
};
foreach ($menus as $key => $data_menu) {
	?>
									<tr>
										<td>
											<label class="mar-0 control control--checkbox">
												<input type="checkbox" class="cb-element" name="menus[]" value="<?php echo $data_menu['id']; ?>" <?php echo (isMenuSelected($menu_selecteds, $data_menu['id'], count($data_menu['functions'])) ? "checked" : "") ?>>
												<div class="control__indicator" style="top:-8px;"></div>
											</label>
										</td>
										<td>
											<div><?php echo $data_menu['name']; ?></div>
											<div class="btn-group dropdown">
												<button class="btn btn-sm btn-success dropdown-toggle" data-toggle="dropdown">Pilih Fungsi</button>
												<div class="dropdown-menu function-parent pad">
												<?php foreach ($data_menu['functions'] as $function) {?>
													<input type="checkbox" class="cb-element-child function-<?php echo $function['id'] ?>" name="functions[<?php echo $data_menu['id']; ?>][]" value="<?php echo $function['id'] ?>" <?php echo (isMenuFunctionSelected($menu_selecteds, $data_menu['id'], $function['id']) ? "checked" : "") ?>>

													<label class="form-check-label"><?php echo $function['name'] ?></label>
													<br>
												<?php }?>
												</div>
											</div>
										</td>
										<td>
										<?php
foreach ($data_menu['functions'] as $function) {
		if ((isMenuFunctionSelected($menu_selecteds, $data_menu['id'], $function['id']))) {?>
											<span class="badge"><?php echo $function['name'] ?></span>
											<?php }?>
										<?php }?>
										</td>
									</tr>
								<?php }?>
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div class="box-footer">
					<div class="row">
						<div class="col-sm-12 text-right">
							<a href="<?php echo base_url(); ?>role" class="btn btn-danger">Batal</a>
							<button type="submit" class="btn btn-primary" id="save-btn">Simpan</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</section>
</form>
 <script data-main="<?php echo base_url() ?>assets/js/main/main-role" src="<?php echo base_url() ?>assets/js/require.js"></script>
