<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Travel extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('travel_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/travel/list_v';
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


			$insert = $this->travel_model->insert($data);

			if ($insert) {
				$this->session->set_flashdata('message', "Travel Baru Berhasil Disimpan");
				redirect("travel");
			} else {
				$this->session->set_flashdata('message_error', "Travel Baru Gagal Disimpan");
				redirect("travel");
			}
		} else {
			$this->data['content'] = 'admin/travel/create_v';
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

			$update = $this->travel_model->update($data, array("travel.id" => $id));

			if ($update) {
				$this->session->set_flashdata('message', "Travel Berhasil Diubah");
				redirect("travel", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "Travel Gagal Diubah");
				redirect("travel", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("travel/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$travel = $this->travel_model->getAllById(array("travel.id" => $this->data['id']));
				
				$this->data['id'] 	= (!empty($travel)) ? $travel[0]->id : "";
				$this->data['nama'] 	= (!empty($travel)) ? $travel[0]->nama : "";
				$this->data['description'] = (!empty($travel)) ? $travel[0]->description : "";
				$this->data['content'] = 'admin/travel/edit_v';
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
		$totalData = $this->travel_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"travel.nama" => $search_value,
				"travel.description" => $search_value,
			);
			$totalFiltered = $this->travel_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->travel_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='" . base_url() . "travel/edit/" . $data->id . "' class='btn btn-sm btn-info white'> Ubah</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "travel/destroy/" . $data->id . "/" . $data->is_deleted . "'
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
			$this->load->model("travel_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->travel_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "Travel Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	
}
