<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Customer extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('produk_model');
		$this->load->model('pelanggan_model');
		$this->load->model('kategori_produk_model');
		$this->load->model('transaksi_model');
		$this->load->model('pesanan_model');
	}

	public function index() 
	{
		$this->load->helper('url');
        $this->data['produks'] = $this->produk_model->getAllById();
        $this->data['kategoris'] = $this->kategori_produk_model->getAllById();
		$this->data['pelanggans'] = $this->pelanggan_model->getAllById();
		$this->load->view('user/customer/menu_v', $this->data);
	}

	public function checkout() 
	{
		$nama_pelanggan = $this->input->post('nama_pelanggan');
		$pelanggan = $this->pelanggan_model->getAllById(array('nama' => $nama_pelanggan));

		if (isset($pelanggan)) {
			$data = array(
				'nama' => $this->input->post('nama_pelanggan'),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);

			$insert = $this->pelanggan_model->insert($data);
		}

		if(isset($insert)){
			$data_transaksi = array(
				'id_pelanggan' => $insert,
				'status' => 1,
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);
		}else{
			$data_transaksi = array(
				'id_pelanggan' => $this->input->post('nama_pelanggan'),
				'status' => 1,
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);
		}

		$insert_transaksi = $this->transaksi_model->insert($data_transaksi);

		$id_produk = $this->input->post('id_produk');
		$quantity = $this->input->post('quantity');
		for ($i=0; $i < count($id_produk); $i++) { 
			$data_pesanan = array(
				'tanggal_pesanan' => date('Y-m-d H:i:s'),
				'id_transaksi' => $insert_transaksi,
				'id_produk' => $id_produk[$i],
				'jumlah' => $quantity[$i],
				'keterangan' => '',
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);
			$insert_pesanan = $this->pesanan_model->insert($data_pesanan);
		}

		if($insert_pesanan){
			$notifikasi['status'] = "Pesanan Berhasil";
			echo json_encode($notifikasi);
			return json_encode($notifikasi);
		}else{
			$notifikasi['status'] = "Pesanan Gagal";
			echo json_encode($notifikasi);
			return json_encode($notifikasi);
		}
	}

	
	
}
