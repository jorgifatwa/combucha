<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Karyawan extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('karyawan_model');
		$this->load->model('ion_auth_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/karyawan/list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
	}

	public function create() 
	{
		$this->form_validation->set_rules('name', "Nama Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('email', "Email Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('no_hp', "No. HP Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('alamat', "Alamat Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			
			$data = array(
				'nama' => $this->input->post('name'),
				'email' => $this->input->post('email'),
				'no_hp' => $this->input->post('no_hp'),
				'alamat' => $this->input->post('alamat'),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);

			$insert = $this->karyawan_model->insert($data);

			if ($insert) {
				$this->session->set_flashdata('message', "Karyawan Baru Berhasil Disimpan");
				redirect("karyawan");
			} else {
				$this->session->set_flashdata('message_error', "Karyawan Baru Gagal Disimpan");
				redirect("karyawan");
			}
		} else {
			$this->data['content'] = 'admin/karyawan/create_v';
			$this->load->view('admin/layouts/page', $this->data);
		}
	}

	public function edit() 
	{
		$this->form_validation->set_rules('name', "Nama Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			

			$data = array(
				'nama' => $this->input->post('name'),
				'email' => $this->input->post('email'),
				'no_hp' => $this->input->post('no_hp'),
				'alamat' => $this->input->post('alamat'),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);

			$id = $this->input->post('id');

			$update = $this->karyawan_model->update($data, array("karyawan.id" => $id));

			if ($update) {
				$this->session->set_flashdata('message', "Karyawan Berhasil Diubah");
				redirect("karyawan", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "Karyawan Gagal Diubah");
				redirect("karyawan", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("karyawan/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$karyawan = $this->karyawan_model->getAllById(array("karyawan.id" => $this->data['id']));
				
				$this->data['id'] 	= (!empty($karyawan)) ? $karyawan[0]->id : "";
				$this->data['nama'] 	= (!empty($karyawan)) ? $karyawan[0]->nama : "";
				$this->data['email'] 	= (!empty($karyawan)) ? $karyawan[0]->email : "";
				$this->data['no_hp'] 	= (!empty($karyawan)) ? $karyawan[0]->no_hp : "";
				$this->data['alamat'] 	= (!empty($karyawan)) ? $karyawan[0]->alamat : "";
				$this->data['content'] = 'admin/karyawan/edit_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function dataList() 
	{
		$columns = array(
			0 => 'nama',
			1 => 'email',
			2 => 'no_hp',
			3 => 'alamat',
			4 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->karyawan_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"karyawan.nama" => $search_value,
				"karyawan.email" => $search_value,
				"karyawan.no_hp" => $search_value,
				"karyawan.alamat" => $search_value,
				"karyawan.description" => $search_value,
			);
			$totalFiltered = $this->karyawan_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->karyawan_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='" . base_url() . "karyawan/edit/" . $data->id . "' class='btn btn-sm btn-info white'> Ubah</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "karyawan/destroy/" . $data->id . "/" . $data->is_deleted . "'
						class='btn btn-sm btn-danger white delete'>Hapus
						</a>";
				}

				$nestedData['id'] = $start + $key + 1;
				$nestedData['nama'] = $data->nama;
				$nestedData['email'] = $data->email;
				$nestedData['no_hp'] = $data->no_hp;
				$nestedData['alamat'] = $data->alamat;
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
			$this->load->model("karyawan_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->karyawan_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "karyawan Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	
}
