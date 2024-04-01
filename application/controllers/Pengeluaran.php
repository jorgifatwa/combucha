<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Pengeluaran extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('pengeluaran_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/pengeluaran/list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
	}

	public function create() 
	{
		$this->form_validation->set_rules('tanggal', "Tanggal Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('keterangan', "keterangan Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('jumlah', "Jumlah Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga', "Harga Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			
			$data = array(
				'tanggal' => $this->input->post('tanggal'),
				'keterangan' => $this->input->post('keterangan'),
				'harga' => str_replace('.', '', $this->input->post('harga')),
				'jumlah' => str_replace('.', '', $this->input->post('jumlah')),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);


			$insert = $this->pengeluaran_model->insert($data);

			if ($insert) {
				$this->session->set_flashdata('message', "Pengeluaran Baru Berhasil Disimpan");
				redirect("pengeluaran");
			} else {
				$this->session->set_flashdata('message_error', "Pengeluaran Baru Gagal Disimpan");
				redirect("pengeluaran");
			}
		} else {
			$this->data['content'] = 'admin/pengeluaran/create_v';
			$this->load->view('admin/layouts/page', $this->data);
		}
	}

	public function edit() 
	{
		$this->form_validation->set_rules('tanggal', "Tanggal Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('keterangan', "keterangan Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('jumlah', "Jumlah Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga', "Harga Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			
			$data = array(
				'tanggal' => $this->input->post('tanggal'),
				'keterangan' => $this->input->post('keterangan'),
				'harga' => str_replace('.', '', $this->input->post('harga')),
				'jumlah' => str_replace('.', '', $this->input->post('jumlah')),
				'updated_at' => date('Y-m-d H:i:s'),
				'updated_by' => $this->data['users']->id
			);


			$id = $this->input->post('id');

			$update = $this->pengeluaran_model->update($data, array("pengeluaran.id" => $id));

			if ($update) {
				$this->session->set_flashdata('message', "Pengeluaran Berhasil Diubah");
				redirect("pengeluaran", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "Pengeluaran Gagal Diubah");
				redirect("pengeluaran", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("pengeluaran/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$pengeluaran = $this->pengeluaran_model->getAllById(array("pengeluaran.id" => $this->data['id']));
				
				$this->data['id'] 	= (!empty($pengeluaran)) ? $pengeluaran[0]->id : "";
				$this->data['tanggal'] 	= (!empty($pengeluaran)) ? $pengeluaran[0]->tanggal : "";
				$this->data['keterangan'] 	= (!empty($pengeluaran)) ? $pengeluaran[0]->keterangan : "";
				$this->data['jumlah'] = (!empty($pengeluaran)) ? $pengeluaran[0]->jumlah : "";
				$this->data['harga'] = (!empty($pengeluaran)) ? $pengeluaran[0]->harga : "";
				$this->data['content'] = 'admin/pengeluaran/edit_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function dataList() 
	{
		$columns = array(
			0 => 'tanggal',
			1 => 'harga',
			2 => 'jumlah',
			3 => 'keterangan',
			4 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->pengeluaran_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"pengeluaran.tanggal" => $search_value,
				"pengeluaran.harga" => $search_value,
				"pengeluaran.jumlah" => $search_value,
				"pengeluaran.keterangan" => $search_value,
			);
			$totalFiltered = $this->pengeluaran_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->pengeluaran_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='" . base_url() . "pengeluaran/edit/" . $data->id . "' class='btn btn-sm btn-info white'> Ubah</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "pengeluaran/destroy/" . $data->id . "/" . $data->is_deleted . "'
						class='btn btn-sm btn-danger white delete'>Hapus
						</a>";
				}

				$nestedData['id'] = $start + $key + 1;
				$nestedData['tanggal'] = $data->tanggal;
				$nestedData['harga'] = "Rp. ".number_format($data->harga);
				$nestedData['jumlah'] = number_format($data->jumlah);
				$total = $data->harga * $data->jumlah;
				$nestedData['keterangan'] = $data->keterangan;
				$nestedData['total'] = "Rp. ".number_format($total);
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
			$this->load->model("pengeluaran_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->pengeluaran_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "Pengeluaran Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	
}
