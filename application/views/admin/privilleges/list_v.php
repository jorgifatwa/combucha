<section class="content-header">
    <h1>
        <?php echo ucwords(str_replace("_"," ",$this->uri->segment(1)))?>
        <small></small>
    </h1>
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
        <li class="active"><?php echo ucwords(str_replace("_"," ",$this->uri->segment(1)))?></li>
    </ol>
</section>

<section class="content">
    <div class="box mb-3">
        <div class="box-header">
            <div class="row">
                <div class="col-sm-6">
                    Data <?php echo ucwords(str_replace("_"," ",$this->uri->segment(1)))?>
                </div>
                <div class="col-sm-6 text-right">
                </div>
            </div>
        </div>
        <div class="box-body">
            <div class="table-responsive">
                <table class="table table-striped table-bordered" id="table" width="100%" cellspacing="0">
                    <thead>
                        <th>No Urut</th>
                        <th>Role</th>  
                        <th width="20%">Action</th> 
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
<script 
  data-main="<?php echo base_url()?>assets/js/main/main-privilleges" 
  src="<?php echo base_url()?>assets/js/require.js">  
</script>

