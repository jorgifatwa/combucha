<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Template extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('template_model');
		$this->load->model('paket_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/template/list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
	}

	public function create() 
	{
		$this->form_validation->set_rules('id_paket', "Paket Harus Dipilih", 'trim|required');
		$this->form_validation->set_rules('pesan', "Pesan Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			$data = array(
				'id_paket' => $this->input->post('id_paket'),
				'pesan' => $this->input->post('pesan'),
			);
			if ($this->template_model->insert($data)) {
				$this->session->set_flashdata('message', "Template Baru Berhasil Disimpan");
				redirect("template");
			} else {
				$this->session->set_flashdata('message_error', "Template Baru Gagal Disimpan");
				redirect("template");
			}
		} else {
			$this->data['content'] = 'admin/template/create_v';
			$this->data['pakets'] = $this->paket_model->getAllById();
			$this->load->view('admin/layouts/page', $this->data);
		}
	}

	public function edit($id) 
	{
		$this->form_validation->set_rules('id_paket', "Paket Harus Dipilih", 'trim|required');
		$this->form_validation->set_rules('pesan', "Pesan Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			$data = array(
				'id_paket' => $this->input->post('id_paket'),
				'pesan' => $this->input->post('pesan'),
			);
			$update = $this->template_model->update($data, array("template_whatsapp.id" => $id));
			if ($update) {
				$this->session->set_flashdata('message', "Template Berhasil Diubah");
				redirect("template", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "Template Gagal Diubah");
				redirect("template", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("template/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$where_template = [
					"template_whatsapp.id" => $this->data['id'],
				];
				$template = $this->template_model->getAllById($where_template);
				$this->data['pakets'] = $this->paket_model->getAllById();
				$this->data['id_paket'] = (!empty($template)) ? $template[0]->id_paket : "";
				$this->data['pesan'] = (!empty($template)) ? $template[0]->pesan : "";

				$this->data['content'] = 'admin/template/edit_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function dataList() 
	{
		$columns = array(
			0 => 'paket_name',
			1 => 'pesan',
			2 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->template_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"paket.name" => $search_value,
				"template_whatsapp.pesan" => $search_value,
			);
			$totalFiltered = $this->template_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->template_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {
				$edit_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='" . base_url() . "template/edit/" . $data->id . "' class='btn btn-sm btn-info white'> Ubah</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "template/destroy/" . $data->id . "/" . $data->is_deleted . "'
						class='btn btn-sm btn-danger white delete'> Hapus
						</a>";
				}

				$nestedData['id'] = $start + $key + 1;
				$nestedData['paket_name'] = $data->paket_name;
				$nestedData['pesan'] = $data->pesan;
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
			$this->load->model("template_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->template_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "Template Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}
}
