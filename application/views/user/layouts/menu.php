<nav class="navbar navbar-expand-lg navbar-light bg-white shadowed bg-light sticky-top">
  <div class="container">
      <a class="navbar-brand" href="<?php echo base_url();?>">
        <img src="<?php echo base_url();?>assets/img/logo-home.png">
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="<?php echo base_url();?>">Beranda</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Air Minum
              </a>
              <div class="dropdown-menu dropdown-menu-right  animate slideIn" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="<?php echo base_url();?>target">Target & capaian air minum</a>
                  <a class="dropdown-item" href="<?php echo base_url();?>detail">Jaringan perpipaan</a>
                  <a class="dropdown-item" href="<?php echo base_url();?>detail">Bukan jaringan perpipaan</a>
                  <a class="dropdown-item" href="<?php echo base_url();?>detail">Aman</a>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Air Limbah Domestik
              </a>
              <div class="dropdown-menu dropdown-menu-right animate slideIn" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="<?php echo base_url();?>target">Target & capaian sanitasi</a>
                  <a class="dropdown-item" href="<?php echo base_url();?>detail">Sanitasi layak</a>
                  <a class="dropdown-item" href="<?php echo base_url();?>detail">Sanitasi belum layak</a>
                  <a class="dropdown-item" href="<?php echo base_url();?>detail">Sanitasi aman</a>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Persampahan
              </a>
              <div class="dropdown-menu dropdown-menu-right animate slideIn" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="<?php echo base_url();?>target">Target & capaian persampahan</a>
                  <a class="dropdown-item" href="<?php echo base_url();?>detail">Penanganan</a>
                  <a class="dropdown-item" href="<?php echo base_url();?>detail">Pengurangan</a>
              </div>
            </li>
        </ul>
      </div>
    </div>
</nav>