<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Kategori_produk extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('kategori_produk_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/kategori_produk/list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
	}

	public function create() 
	{
		$this->form_validation->set_rules('name', "Nama Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			
			$data = array(
				'nama' => $this->input->post('name'),
				'description' => $this->input->post('description'),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);


			$insert = $this->kategori_produk_model->insert($data);

			if ($insert) {
				$this->session->set_flashdata('message', "Kategori Produk Baru Berhasil Disimpan");
				redirect("kategori_produk");
			} else {
				$this->session->set_flashdata('message_error', "Kategori Produk Baru Gagal Disimpan");
				redirect("kategori_produk");
			}
		} else {
			$this->data['content'] = 'admin/kategori_produk/create_v';
			$this->load->view('admin/layouts/page', $this->data);
		}
	}

	public function edit() 
	{
		$this->form_validation->set_rules('name', "Nama Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			

			$data = array(
				'nama' => $this->input->post('name'),
				'description' => $this->input->post('description'),
				'updated_at' => date('Y-m-d H:i:s'),
				'updated_by' => $this->data['users']->id
			);

			$id = $this->input->post('id');

			$update = $this->kategori_produk_model->update($data, array("kategori_produk.id" => $id));

			if ($update) {
				$this->session->set_flashdata('message', "Kategori Produk Berhasil Diubah");
				redirect("kategori_produk", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "Kategori Produk Gagal Diubah");
				redirect("kategori_produk", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("kategori_produk/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$kategori_produk = $this->kategori_produk_model->getAllById(array("kategori_produk.id" => $this->data['id']));
				
				$this->data['id'] 	= (!empty($kategori_produk)) ? $kategori_produk[0]->id : "";
				$this->data['nama'] 	= (!empty($kategori_produk)) ? $kategori_produk[0]->nama : "";
				$this->data['description'] = (!empty($kategori_produk)) ? $kategori_produk[0]->description : "";
				$this->data['content'] = 'admin/kategori_produk/edit_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function dataList() 
	{
		$columns = array(
			0 => 'nama',
			1 => 'description',
			2 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->kategori_produk_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"kategori_produk.nama" => $search_value,
				"kategori_produk.description" => $search_value,
			);
			$totalFiltered = $this->kategori_produk_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->kategori_produk_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='" . base_url() . "kategori_produk/edit/" . $data->id . "' class='btn btn-sm btn-info white'> Ubah</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "kategori_produk/destroy/" . $data->id . "/" . $data->is_deleted . "'
						class='btn btn-sm btn-danger white delete'>Hapus
						</a>";
				}

				$nestedData['id'] = $start + $key + 1;
				$nestedData['nama'] = $data->nama;
				$nestedData['description'] = substr(strip_tags($data->description), 0, 50);
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
			$this->load->model("kategori_produk_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->kategori_produk_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "Kategori Produk Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	
}
