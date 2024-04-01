<section class="content">
  <div class="box">
    <div role="tabpanel">
      <div class="box-body">
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active">
          <a href="#home" aria-controls="home" role="tab" data-toggle="tab">Profil Pengguna</a>
        </li>
        <li role="presentation">
          <a href="#tab" aria-controls="tab" role="tab" data-toggle="tab">Ganti Password</a>
        </li>
      </ul>
    </div>
      <!-- Tab panes -->
      <div class="tab-content">
        <div role="tabpanel" class="tab-pane active" id="home">
          <input type="hidden" id="user_id" value="">
          <form class="form-horizontal" id="form" method="POST" action="">
            <div class="box-body">
              <?php if(!empty($this->session->flashdata('message_error'))){?>
              <div class="alert alert-danger">
              <?php   
                 print_r($this->session->flashdata('message_error'));
              ?>
              </div>
              <?php }?> 
              <?php if(!empty($this->session->flashdata('message'))){?>
              <div class="alert alert-success">
              <?php   
                 print_r($this->session->flashdata('message'));
              ?>
              </div>
              <?php }?> 
              <input type="hidden" name="id" value="<?php echo $id;?>">
              <div class="form-group row">
                <label for="inputEmail3" class="col-sm-3 form-label">Nama Lengkap</label> 
                <div class="col-sm-4">
                  <input type="text" class="form-control" id="nama_lengkap" placeholder="Nama Lengkap" name="nama_lengkap" value="<?php echo $name;?>">
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword3" class="col-sm-3 form-label">Email</label> 
                <div class="col-sm-4">
                 <input type="email" class="form-control" id="email" placeholder="Email" name="email" value="<?php echo $email;?>">
                </div>
              </div> 
              <div class="form-group row">
                <label  class="col-sm-3 form-label">Nomor Handphone</label> 
                <div class="col-sm-4">
                 <input type="text" class="form-control" id="phone" placeholder="Nomor Handphone" name="phone" value="<?php echo $phone;?>">
                </div>
              </div> 
              <div class="form-group row">
                <label class="col-sm-3 form-label">Alamat</label> 
                <div class="col-sm-4">
                 <textarea class="form-control" id="address" name="address"><?php echo $address?></textarea>
                </div>
              </div>  
            </div> 
            <div class="box-footer">
              <div class="row">
                <div class="col-sm-12 text-right">
                  <a href="<?php echo base_url();?>dashboard" class="btn btn-secondary text-black">Batal</a>
                  <button type="submit" class="btn btn-primary" name="profil_pengguna" value="1" id="save-btn">Simpan</button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div role="tabpanel" class="tab-pane" id="tab">
        <form class="form-horizontal" id="forms" method="POST" action="<?php echo base_url()?>profile">
          <div class="box-body">
            <?php if(!empty($this->session->flashdata('messages'))){?>
            <div class="alert alert-success">
            <?php   
               print_r($this->session->flashdata('messages'));
            ?>
            </div>
            <?php }?> 
            <input type="hidden" name="id" value="<?php echo $id;?>">
            <div class="form-group row">
              <label for="inputEmail3" class="col-sm-3 form-label">Password Lama</label> 
              <div class="col-sm-4">
                <input type="password" class="form-control" id="old_password"  name="old_password">
              </div>
            </div>
            <div class="form-group row">
              <label for="inputEmail3" class="col-sm-3 form-label">Password Baru</label> 
              <div class="col-sm-4">
                <input type="password" class="form-control" id="new_password" name="new_password">
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword3" class="col-sm-3 form-label">Konfirmasi Password Baru</label> 
              <div class="col-sm-4">
               <input type="password" class="form-control" id="confirm_password" name="confirm_password">
              </div>
            </div>  
          </div> 
          <div class="box-footer">
            <div class="row">
              <div class="col-sm-12 text-right">
                <a href="<?php echo base_url();?>dashboard" class="btn btn-secondary text-black">Batal</a>
                <button type="submit" class="btn btn-primary" name="password_pengguna" value="1" id="save-btn2">Simpan</button>
              </div>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  </div>  
</section>
 <script data-main="<?php echo base_url()?>assets/js/main/main-profile" src="<?php echo base_url()?>assets/js/require.js"></script>
