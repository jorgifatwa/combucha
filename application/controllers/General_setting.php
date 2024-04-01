<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class General_setting extends CI_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('blok_model');
		$this->load->model('location_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		$this->data['content'] = 'general_setting/setting';
		$this->data['locations'] = $this->location_model->getAllById();
		$this->load->view('general_setting/layout/page', $this->data);
	}

	public function create() 
	{
		$this->form_validation->set_rules('name', "Nama Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('location_id', "Lokasi Harus Dipilih", 'trim|required');
		$this->form_validation->set_rules('pit_id', "pit Harus Dipilih", 'trim|required');
		$this->form_validation->set_rules('seam_id', "Seam Harus Dipilih", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			$data = array(
				'name' => $this->input->post('name'),
				'location_id' => $this->input->post('location_id'),
				'pit_id' => $this->input->post('pit_id'),
				'seam_id' => $this->input->post('seam_id'),
				'description' => "",
			);
			if ($this->blok_model->insert($data)) {
				$this->session->set_flashdata('message', "Blok Baru Berhasil Disimpan");
				redirect("blok");
			} else {
				$this->session->set_flashdata('message_error', "Blok Baru Gagal Disimpan");
				redirect("blok");
			}
		} else {
			$this->data['content'] = 'admin/blok/create_v';
			$where_location = [
				"location.id !=" => 1,
				"location.is_deleted" => 0
			];
			$this->data['locations'] = $this->location_model->getAllById($where_location);
			$this->load->view('admin/layouts/page', $this->data);
		}
	}

	public function edit($id) 
	{
		$this->form_validation->set_rules('name', "Nama Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('location_id', "Lokasi Harus Dipilih", 'trim|required');
		$this->form_validation->set_rules('pit_id', "Pit Harus Dipilih", 'trim|required');
		$this->form_validation->set_rules('seam_id', "Seam Harus Dipilih", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			$data = array(
				'name' => $this->input->post('name'),
				'location_id' => $this->input->post('location_id'),
				'pit_id' => $this->input->post('pit_id'),
				'seam_id' => $this->input->post('seam_id'),
				'description' => "",
			);
			$update = $this->blok_model->update($data, array("blok.id" => $id));
			if ($update) {
				$this->session->set_flashdata('message', "blok Berhasil Diubah");
				redirect("blok", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "blok Gagal Diubah");
				redirect("blok", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("blok/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$blok = $this->blok_model->getAllById(array("blok.id" => $this->data['id']));
				$this->data['name'] 	= (!empty($blok)) ? $blok[0]->name : "";
				$this->data['seam_id'] 	= (!empty($blok)) ? $blok[0]->seam_id : "";
				$this->data['pit_id'] 	= (!empty($blok)) ? $blok[0]->pit_id : "";
				$this->data['location_id'] = (!empty($blok)) ? $blok[0]->location_id : "";
				$this->data['description'] = (!empty($blok)) ? $blok[0]->description : "";
				$where_location = [
					"location.id !=" => 1,
					"location.is_deleted" => 0
				];
				$this->data['locations'] = $this->location_model->getAllById($where_location);
				$this->data['content'] = 'admin/blok/edit_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function dataList() 
	{
		$columns = array(
			0 => 'location_name',
			1 => 'pit_name',
			2 => 'seam_name',
			3 => 'name',
			4 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->blok_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"blok.name" => $search_value,
				"location.name" => $search_value,
				"pit.name" => $search_value,
				"seam.name" => $search_value,
				"blok.description" => $search_value,
			);
			$totalFiltered = $this->blok_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->blok_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='" . base_url() . "blok/edit/" . $data->id . "' class='btn btn-sm btn-info white'> Ubah</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "blok/destroy/" . $data->id . "/" . $data->is_deleted . "'
						class='btn btn-sm btn-danger white delete'> Hapus
						</a>";
				}

				$nestedData['id'] = $start + $key + 1;
				$nestedData['name'] = $data->name;
				$nestedData['pit_name'] = $data->pit_name;
				$nestedData['seam_name'] = $data->seam_name;
				$nestedData['location_name'] = $data->location_name;
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
			$this->load->model("blok_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->blok_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "Blok Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	public function getPit()
	{
		$id = $this->input->post("id");
		$pit = $this->pit_model->getAllById(['pit.location_id' => $id]);

		if(!empty($pit)){	
            $response_data['status'] = true;
            $response_data['data'] = $pit;
            $response_data['message'] = 'Berhasil Mengambil Data';
        }else{
            $response_data['status'] = false;
            $response_data['data'] = [];
            $response_data['message'] = 'Gagal Mengambil Data';
        }

        echo json_encode($response_data);
	}

	public function getSeam()
	{
		$id = $this->input->post("id");
		$seam = $this->seam_model->getAllById(['seam.pit_id' => $id]);

		if(!empty($seam)){
            $response_data['status'] = true;
            $response_data['data'] = $seam;
            $response_data['message'] = 'Berhasil Mengambil Data';
        }else{
            $response_data['status'] = false;
            $response_data['data'] = [];
            $response_data['message'] = 'Gagal Mengambil Data';
        }

        echo json_encode($response_data);
	}
}
