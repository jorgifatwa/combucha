<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Barang extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('barang_model');
		$this->load->model('ppn_model');
		$this->load->model('price_marketplace_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/barang/list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
	}

	public function create() 
	{
		$this->form_validation->set_rules('nama', "Nama Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_modal', "Harga Modal Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_jual_biasa', "Harga Jual Biasa Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_jual_campaign', "Harga Jual Campaign Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_jual_flash_sale', "Harga Jual Flash Sale Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_jual_bottom', "Harga Jual Bottom Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			
			$data = array(
				'kode_barang' => $this->input->post('kode_barang'),
				'nama' => $this->input->post('nama'),
				'harga_modal' => $this->input->post('harga_modal'),
				'harga_jual_biasa' => $this->input->post('harga_jual_biasa'),
				'harga_jual_campaign' => $this->input->post('harga_jual_campaign'),
				'harga_jual_flash_sale' => $this->input->post('harga_jual_flash_sale'),
				'harga_jual_bottom' => $this->input->post('harga_jual_bottom'),
				'description' => $this->input->post('description'),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);


			$insert = $this->barang_model->insert($data);

			for ($i=0; $i < count($_POST['harga_marketplace']); $i++) { 
				$data_price = array(
					'id_barang' => $insert,
					'id_marketplace' => $_POST['id_marketplace'][$i],
					'harga' => $_POST['harga_marketplace'][$i],
					'created_at' => date('Y-m-d H:i:s'),
					'created_by' => $this->data['users']->id
				);

				$this->price_marketplace_model->insert($data_price);
			}

			if ($insert) {
				$this->session->set_flashdata('message', "barang Baru Berhasil Disimpan");
				redirect("barang");
			} else {
				$this->session->set_flashdata('message_error', "barang Baru Gagal Disimpan");
				redirect("barang");
			}
		} else {
			$dariDB = $this->barang_model->cekKodeBarang();
			
			$nourut = substr($dariDB, 2, 4);
			
			$kode_barang = $nourut + 1;
			
			if($dariDB == 'B009' || $nourut >= 10){
				$this->data['kode_barang'] = 'B0'.$kode_barang;
			}elseif ($dariDB == 'B099' || $nourut >= 100) {
				$this->data['kode_barang'] = 'B'.$kode_barang;
			}else{
				$this->data['kode_barang'] = 'B00'.$kode_barang;
			}

			$this->data['content'] = 'admin/barang/create_v';
			$this->data['ppns'] = $this->ppn_model->getAllById();
			$this->load->view('admin/layouts/page', $this->data);
		}
	}

	public function edit() 
	{
		$this->form_validation->set_rules('nama', "Nama Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_modal', "Harga Modal Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_jual_biasa', "Harga Jual Biasa Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_jual_campaign', "Harga Jual Campaign Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_jual_flash_sale', "Harga Jual Flash Sale Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga_jual_bottom', "Harga Jual Bottom Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			

			$data = array(
				'kode_barang' => $this->input->post('kode_barang'),
				'nama' => $this->input->post('nama'),
				'harga_modal' => $this->input->post('harga_modal'),
				'harga_jual_biasa' => $this->input->post('harga_jual_biasa'),
				'harga_jual_campaign' => $this->input->post('harga_jual_campaign'),
				'harga_jual_flash_sale' => $this->input->post('harga_jual_flash_sale'),
				'harga_jual_bottom' => $this->input->post('harga_jual_bottom'),
				'description' => $this->input->post('description'),
				'updated_at' => date('Y-m-d H:i:s'),
				'updated_by' => $this->data['users']->id
			);

			$id = $this->input->post('id');

			$update = $this->barang_model->update($data, array("barang.id" => $id));

			for ($i=0; $i < count($_POST['harga_marketplace']); $i++) { 
				$data_price = array(
					'id_barang' => $id,
					'id_marketplace' => $_POST['id_marketplace'][$i],
					'harga' => $_POST['harga_marketplace'][$i],
					'updated_at' => date('Y-m-d H:i:s'),
					'updated_by' => $this->data['users']->id
				);

				$this->price_marketplace_model->update($data_price, array('id_barang' => $id, 'id_marketplace' => $_POST['id_marketplace'][$i]));
			}

			if ($update) {
				$this->session->set_flashdata('message', "barang Berhasil Diubah");
				redirect("barang", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "barang Gagal Diubah");
				redirect("barang", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("barang/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$barang = $this->barang_model->getAllById(array("barang.id" => $this->data['id']));
				
				$this->data['id'] 	= (!empty($barang)) ? $barang[0]->id : "";
				$this->data['nama'] 	= (!empty($barang)) ? $barang[0]->nama : "";
				$this->data['kode_barang'] 	= (!empty($barang)) ? $barang[0]->kode_barang : "";
				$this->data['harga_modal'] = (!empty($barang)) ? $barang[0]->harga_modal : "";
				$this->data['harga_jual_biasa'] = (!empty($barang)) ? $barang[0]->harga_jual_biasa : "";
				$this->data['harga_jual_campaign'] = (!empty($barang)) ? $barang[0]->harga_jual_campaign : "";
				$this->data['harga_jual_flash_sale'] = (!empty($barang)) ? $barang[0]->harga_jual_flash_sale : "";
				$this->data['harga_jual_bottom'] = (!empty($barang)) ? $barang[0]->harga_jual_bottom : "";
				$this->data['description'] = (!empty($barang)) ? $barang[0]->description : "";
				$this->data['ppns'] = $this->ppn_model->getAllByIdWithMarketplace(array('id_barang' => $this->data['id']));
				$this->data['ppn_oris'] = $this->ppn_model->getAllById();
				$this->data['content'] = 'admin/barang/edit_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function detail() 
	{
		$this->data['id'] = $this->uri->segment(3);
		$barang = $this->barang_model->getAllById(array("barang.id" => $this->data['id']));
		$this->data['nama'] 	= (!empty($barang)) ? $barang[0]->nama : "";
		$this->data['kode_barang'] 	= (!empty($barang)) ? $barang[0]->kode_barang : "";
		$this->data['harga_modal'] = (!empty($barang)) ? $barang[0]->harga_modal : "";
		$this->data['harga_jual_biasa'] = (!empty($barang)) ? $barang[0]->harga_jual_biasa : "";
		$this->data['harga_jual_campaign'] = (!empty($barang)) ? $barang[0]->harga_jual_campaign : "";
		$this->data['harga_jual_flash_sale'] = (!empty($barang)) ? $barang[0]->harga_jual_flash_sale : "";
		$this->data['harga_jual_bottom'] = (!empty($barang)) ? $barang[0]->harga_jual_bottom : "";
		$this->data['description'] = (!empty($barang)) ? $barang[0]->description : "";
		$this->data['content'] = 'admin/barang/detail_v';
		$this->data['ppns'] = $this->ppn_model->getAllByIdWithMarketplace(array('id_barang' => $this->data['id']));
		$this->load->view('admin/layouts/page', $this->data);
	}

	public function dataList() 
	{
		$columns = array(
			0 => 'nama',
			1 => 'harga_modal',
			2 => 'harga_jual_biasa',
			3 => 'harga_jual_campaign',
			4 => 'harga_jual_flash_sale',
			5 => 'harga_jual_bottom',
			6 => 'description',
			7 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->barang_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"barang.nama" => $search_value,
				"barang.harga_modal" => $search_value,
				"barang.harga_jual_biasa" => $search_value,
				"barang.harga_jual_campaign" => $search_value,
				"barang.harga_jual_flash_sale" => $search_value,
				"barang.harga_jual_bottom" => $search_value,
				"barang.description" => $search_value,
			);
			$totalFiltered = $this->barang_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->barang_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$detail_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='" . base_url() . "barang/edit/" . $data->id . "' class='btn btn-sm btn-info white'> Ubah</a>";
					$detail_url = "<a href='" . base_url() . "barang/detail/" . $data->id . "' class='btn btn-sm btn-primary white'> Detail</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "barang/destroy/" . $data->id . "/" . $data->is_deleted . "'
						class='btn btn-sm btn-danger white delete'>Hapus
						</a>";
				}
				$generator = new Picqer\Barcode\BarcodeGeneratorJPG();
				$download_url = "<a download href='data:image/png;base64," . base64_encode($generator->getBarcode($data->kode_barang, $generator::TYPE_CODE_128))."' class='btn btn-sm btn-info'>Download Barcode </a>";
		

				$nestedData['id'] = $start + $key + 1;
				$nestedData['nama'] = $data->nama;
				$nestedData['harga_modal'] = "Rp. ".number_format($data->harga_modal);
				$nestedData['harga_jual_biasa'] = "Rp. ".number_format($data->harga_jual_biasa);
				$nestedData['harga_jual_campaign'] = "Rp. ".number_format($data->harga_jual_campaign);
				$nestedData['harga_jual_flash_sale'] = "Rp. ".number_format($data->harga_jual_flash_sale);
				$nestedData['harga_jual_bottom'] = "Rp. ".number_format($data->harga_jual_bottom);
				$nestedData['description'] = substr(strip_tags($data->description), 0, 50);
				$nestedData['action'] = $download_url." ".$detail_url." ".$edit_url . " " . $delete_url;
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
			$this->load->model("barang_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->barang_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "Barang Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	function qrcode(){
		$redColor = [255, 0, 0];

		$generator = new Picqer\Barcode\BarcodeGeneratorJPG();
		echo '<img width="150" src="data:image/png;base64,' . base64_encode($generator->getBarcode('123123', $generator::TYPE_CODE_128)) . '">';
		$file = "data:image/png;base64," . base64_encode($generator->getBarcode('12341234', $generator::TYPE_CODE_128));
		echo '<a href="'.$file.'" download>asdf</a>';
	}

	public function getPpn()
	{
		$ppn = $this->ppn_model->getAllById();

		if(!empty($ppn)){	
            $response_data['status'] = true;
            $response_data['data'] = $ppn;
            $response_data['message'] = 'Berhasil Mengambil Data';
        }else{
            $response_data['status'] = false;
            $response_data['data'] = [];
            $response_data['message'] = 'Gagal Mengambil Data';
        }

        echo json_encode($response_data);
	}

	
}
