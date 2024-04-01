<div class="container">
	<div class="col-12 title-setting">
		<h5>General Settings</h5>
	</div>
	<input type="hidden" name="outlet_id" id="outlet_id">
	<input type="hidden" name="resto_id" id="resto_id">
	<input type="hidden" name="department_id" id="department_id">
	<form method="POST" id="form-general-settings">	
		<div class="row">
			<div class="col-12">
				<?php if(!empty($_GET['status'])){
		          if($_GET['status']=='true'){?>
		            <div class="alert alert-info">
		              <?php echo $_GET['message']?>
		            </div><?php
		          }else{?>
		            <div class="alert alert-danger">
		              <?php echo $_GET['message']?>
		            </div><?php } ?>
		        <?php }?>
	        </div>
		</div>
		<div class="form-group">
			<div class="row">
				<label class="form-label col-md-6">Lokasi <span>Lorem ipsum dolor sit amet</span></label>
				<div class="col-md-6">
					<select name="location_id" id="location_id" class="form-control">
						<option value="">Pilih Lokasi</option>
						<?php foreach ($locations as $key => $location) { ?>
							<option value="<?php echo $location->id ?>"><?php echo $location->name ?></option>
						<?php } ?>
					</select>
				</div>
			</div>
		</div>
		<div class="form-group text-right">
			<button class="btn btn-darkblue" type="submit">Save</button>
		</div>
	</form>
	<br>

	<div class="col-12 title-setting">
		<h5>Synchronize</h5>
	</div>
	<div class="row">
		<div class="col-md-6 mbot-25 text-center">
			<button class="btn btn-success mbot-5" type="button" id="btn-sync"><i class="fa fa-download"></i> Sinkronisasi Download Data</button>
			<p class="fontsize-18 text-black marbot-0 bold">Sinkronisasi Terakhir :</p>
			<!-- <p class="fontsize-16 text-grey" id="status_text_download"><?php echo $last_update_download?></p> -->
		</div>
		<div class="col-md-6 mbot-25 text-center">
			<button class="btn btn-danger mbot-5" type="button" id="btn-sync-upload"><i class="fa fa-upload"></i>Sinkronisasi Upload Data</button>
			<p class="fontsize-18 text-black marbot-0 bold">Sinkronisasi Terakhir :</p>
			<!-- <p class="fontsize-16 text-grey" id="status_text_upload"><?php echo $last_update_upload?></p> -->
		</div>
		<!-- <div class="col-3">
			<p class="fontsize-18 text-black marbot-0 bold">Sinkronisasi Terakhir :</p>
		</div>
		<div class="col-5">
			
		</div> -->
	</div>
</div>
<div class="modal" id="modal_progress">
  <div class="modal-dialog">
    <div class="modal-content"> 
      <div class="modal-header alert-msg"> 
      </div>
      <div class="modal-body">
      		<div id="container-info" class="box-header">
	            <p id="title" class="text-center">Data Berhasil Di Sinkron</p>
	      			<div class="row">
			            <div class="col-md-2">
			            	<p>Sukses </p>
			            </div>
			            <div class="col-md-2">
			            	<p id="p-success">: 0</p>
			            </div>
		        	</div>
	            <div class="row">
		            <div class="col-md-2">
		            	<p>Gagal </p>
		            </div>
		            <div class="col-md-2">
		            	<p id="p-fail">: 0</p>
		            </div>
	        	</div>
	        </div>
	        <div class="ptop-10">
	          	<button type="button" class="btn btn-info btn-sm" id="btn-detail">Lihat Detail</button>
	        </div>
	        <div id="container_detail" class="box-header scroll_detail">
	        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sm btn-danger alert-ok" data-dismiss="modal">Ok</button>
      </div>
    </div> 
  </div> 
</div>

<div class="modal" id="modal_progress_bar" data-backdrop="static">
  <div class="modal-dialog modal-lg">
    <div class="modal-content"> 
      <div class="modal-header alert-msg"> 
      </div>
      <div class="modal-body">
				<div class="progress progress-sm active">
          <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style="width: 50%" id="progress_bar">
          	<input type="hidden" id="progress_value" value="0">
            <span id="progress_text">Wait To Sync</span>
          </div>
      	</div>
				<p class="bold text-center" >Sync In process</p>
      		
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sm btn-danger alert-ok" data-dismiss="modal">Ok</button>
      </div>
    </div> 
  </div> 
</div>
<script data-main="<?php echo base_url()?>assets/js/main/main-general-setting" src="<?php echo base_url()?>assets/js/require.js"></script>