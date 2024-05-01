<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Produk extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('produk_model');
		$this->load->model('kategori_produk_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/produk/list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
	}

	public function create() 
	{
		$this->form_validation->set_rules('name', "Nama Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_jual', "Harga Jual Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_modal', "Harga Modal Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('kategori_id', "Kategori Harus Dipilih", 'trim|required');
		$this->form_validation->set_rules('status', "Status Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			
			$data = array(
				'nama' => $this->input->post('name'),
				'kategori_id' => $this->input->post('kategori_id'),
				'harga_jual' => str_replace(".", "", $this->input->post('harga_jual')),
				'harga_modal' => str_replace(".", "", $this->input->post('harga_modal')),
				'status' => $this->input->post('status'),
				'keterangan' => $this->input->post('keterangan'),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);

			$location_path = "./uploads/produk/";
			if(!is_dir($location_path))
			{
				mkdir($location_path);
			}

			$tmp = $_FILES["gambar"]['name'];
			$ext = ".".pathinfo($tmp, PATHINFO_EXTENSION);
			$uploaded      = uploadFile('gambar', $location_path, 'produk', $ext);
			
			if($uploaded['status']==TRUE){
				$data['gambar'] = str_replace(' ', '_', $uploaded['message']);	
			}


			$insert = $this->produk_model->insert($data);

			if ($insert) {
				$this->session->set_flashdata('message', "Produk Baru Berhasil Disimpan");
				redirect("produk");
			} else {
				$this->session->set_flashdata('message_error', "Produk Baru Gagal Disimpan");
				redirect("produk");
			}
		} else {
			$this->data['kategori_produks'] = $this->kategori_produk_model->getAllById();
			$this->data['content'] = 'admin/produk/create_v';
			$this->load->view('admin/layouts/page', $this->data);
		}
	}

	public function edit() 
	{
		$this->form_validation->set_rules('name', "Nama Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_jual', "Harga Jual Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_modal', "Harga Modal Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('kategori_id', "Kategori Harus Dipilih", 'trim|required');
		$this->form_validation->set_rules('status', "Status Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			
			$data = array(
				'nama' => $this->input->post('name'),
				'kategori_id' => $this->input->post('kategori_id'),
				'harga_jual' => str_replace(".", "", $this->input->post('harga_jual')),
				'harga_modal' => str_replace(".", "", $this->input->post('harga_modal')),
				'status' => $this->input->post('status'),
				'keterangan' => $this->input->post('keterangan'),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);

			$id = $this->input->post('id');

			$location_path = "./uploads/produk/";
			if(!is_dir($location_path))
			{
				mkdir($location_path);
			}

			$tmp = $_FILES["gambar"]['name'];
			$ext = ".".pathinfo($tmp, PATHINFO_EXTENSION);
			$uploaded      = uploadFile('gambar', $location_path, 'produk', $ext);
			
			if($uploaded['status']==TRUE){
				$data['gambar'] = str_replace(' ', '_', $uploaded['message']);	
			}

			$update = $this->produk_model->update($data, array("produk.id" => $id));

			if ($update) {
				$this->session->set_flashdata('message', "Produk Berhasil Diubah");
				redirect("produk", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "Produk Gagal Diubah");
				redirect("produk", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("produk/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$produk = $this->produk_model->getAllById(array("produk.id" => $this->data['id']));

				$this->data['kategori_produks'] = $this->kategori_produk_model->getAllById();
				
				$this->data['id'] 	= (!empty($produk)) ? $produk[0]->id : "";
				$this->data['nama'] 	= (!empty($produk)) ? $produk[0]->nama : "";
				$this->data['harga_jual'] 	= (!empty($produk)) ? $produk[0]->harga_jual : "";
				$this->data['harga_modal'] 	= (!empty($produk)) ? $produk[0]->harga_modal : "";
				$this->data['kategori_id'] 	= (!empty($produk)) ? $produk[0]->kategori_id : "";
				$this->data['status'] 	= (!empty($produk)) ? $produk[0]->status : "";
				$this->data['gambar'] 	= (!empty($produk)) ? $produk[0]->gambar : "";
				$this->data['keterangan'] = (!empty($produk)) ? $produk[0]->keterangan : "";
				$this->data['content'] = 'admin/produk/edit_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function dataList() 
	{
		$columns = array(
			0 => 'nama',
			1 => 'kategori',
			2 => 'harga_modal',
			2 => 'harga_jual',
			3 => 'gambar',
			4 => 'keterangan',
			5 => 'status',
			6 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->produk_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"produk.nama" => $search_value,
				"kategori_produk.nama" => $search_value,
				"produk.harga_modal" => $search_value,
				"produk.harga_jual" => $search_value,
				"produk.status" => $search_value,
				"produk.keterangan" => $search_value,
			);
			$totalFiltered = $this->produk_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->produk_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='" . base_url() . "produk/edit/" . $data->id . "' class='btn btn-sm btn-info white'> Ubah</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "produk/destroy/" . $data->id . "/" . $data->is_deleted . "'
						class='btn btn-sm btn-danger white delete'>Hapus
						</a>";
				}

				$nestedData['id'] = $start + $key + 1;
				$nestedData['nama'] = $data->nama;
				$nestedData['harga_modal'] = "Rp. ".number_format($data->harga_modal);
				$nestedData['harga_jual'] = "Rp. ".number_format($data->harga_jual);
				$nestedData['kategori'] = $data->kategori_name;
				
				// Convert numeric status to string representation
				$nestedData['status'] = ($data->status == 0) ? "Aktif" : "Tidak Aktif";
				
				// Corrected image source attribute
				$nestedData['gambar'] = "<img src='uploads/produk/" . $data->gambar . "' width='50'>";
				$nestedData['keterangan'] = substr(strip_tags($data->keterangan), 0, 50);
				$nestedData['action'] = $edit_url . " " . $delete_url;
				
				$new_data[] = $nestedData;
			}
		}

		$json_data = array(
			"draw" => intval($this->input->post('draw')),
			"recordsTotal" => intval($totalData),
			"recordsFiltered" => intval($totalFiltered),
			"data" => $new_data,
		);

		echo json_encode($json_data);
	}

	public function destroy() 
	{
		$response_data = array();
		$response_data['status'] = false;
		$response_data['msg'] = "";
		$response_data['data'] = array();

		$id = $this->uri->segment(3);
		$is_deleted = $this->uri->segment(4);
		if (!empty($id)) {
			$this->load->model("produk_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->produk_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "Produk Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	
}
