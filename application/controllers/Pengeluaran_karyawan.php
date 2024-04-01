<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Pengeluaran_karyawan extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('pengeluaran_karyawan_model');
		$this->load->model('karyawan_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/pengeluaran_karyawan/list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
	}

	public function create() 
	{
		$this->form_validation->set_rules('tanggal', "Tanggal Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('keterangan', "keterangan Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga', "Harga Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('karyawan_id', "Karyawan Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			
			$data = array(
				'tanggal' => $this->input->post('tanggal'),
				'keterangan' => $this->input->post('keterangan'),
				'karyawan_id' => $this->input->post('karyawan_id'),
				'harga' => str_replace('.', '', $this->input->post('harga')),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);


			$insert = $this->pengeluaran_karyawan_model->insert($data);

			if ($insert) {
				$this->session->set_flashdata('message', "Pengeluaran Karyawan Baru Berhasil Disimpan");
				redirect("pengeluaran_karyawan");
			} else {
				$this->session->set_flashdata('message_error', "Pengeluaran Karyawan Baru Gagal Disimpan");
				redirect("pengeluaran_karyawan");
			}
		} else {
			$this->data['karyawans'] = $this->karyawan_model->getAllById();
			$this->data['content'] = 'admin/pengeluaran_karyawan/create_v';
			$this->load->view('admin/layouts/page', $this->data);
		}
	}

	public function edit() 
	{
		$this->form_validation->set_rules('tanggal', "Tanggal Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('keterangan', "keterangan Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga', "Harga Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('karyawan_id', "Karyawan Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			
			$data = array(
				'tanggal' => $this->input->post('tanggal'),
				'keterangan' => $this->input->post('keterangan'),
				'karyawan_id' => $this->input->post('karyawan_id'),
				'harga' => str_replace('.', '', $this->input->post('harga')),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);

			$id = $this->input->post('id');

			$update = $this->pengeluaran_karyawan_model->update($data, array("pengeluaran_karyawan.id" => $id));

			if ($update) {
				$this->session->set_flashdata('message', "Pengeluaran Karyawan Berhasil Diubah");
				redirect("pengeluaran_karyawan", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "Pengeluaran Karyawan Gagal Diubah");
				redirect("pengeluaran_karyawan", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("pengeluaran_karyawan/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$pengeluaran = $this->pengeluaran_karyawan_model->getAllById(array("pengeluaran_karyawan.id" => $this->data['id']));
				$this->data['karyawans'] = $this->karyawan_model->getAllById();
				$this->data['id'] 	= (!empty($pengeluaran)) ? $pengeluaran[0]->id : "";
				$this->data['tanggal'] 	= (!empty($pengeluaran)) ? $pengeluaran[0]->tanggal : "";
				$this->data['keterangan'] 	= (!empty($pengeluaran)) ? $pengeluaran[0]->keterangan : "";
				$this->data['harga'] = (!empty($pengeluaran)) ? $pengeluaran[0]->harga : "";
				$this->data['karyawan_id'] = (!empty($pengeluaran)) ? $pengeluaran[0]->karyawan_id : "";
				$this->data['content'] = 'admin/pengeluaran_karyawan/edit_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function dataList() 
	{
		$columns = array(
			0 => 'tanggal',
			1 => 'nama_karyawan',
			2 => 'harga',
			3 => 'keterangan',
			4 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->pengeluaran_karyawan_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"pengeluaran_karyawan.tanggal" => $search_value,
				"pengeluaran_karyawan.harga" => $search_value,
				"pengeluaran_karyawan.keterangan" => $search_value,
				"karyawan.nama" => $search_value,
			);
			$totalFiltered = $this->pengeluaran_karyawan_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->pengeluaran_karyawan_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='" . base_url() . "pengeluaran_karyawan/edit/" . $data->id . "' class='btn btn-sm btn-info white'> Ubah</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "pengeluaran_karyawan/destroy/" . $data->id . "/" . $data->is_deleted . "'
						class='btn btn-sm btn-danger white delete'>Hapus
						</a>";
				}

				$nestedData['id'] = $start + $key + 1;
				$nestedData['tanggal'] = $data->tanggal;
				$nestedData['harga'] = "Rp. ".number_format($data->harga);
				$nestedData['nama_karyawan'] = $data->nama_karyawan;
				$nestedData['keterangan'] = $data->keterangan;
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
			$this->load->model("pengeluaran_karyawan_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->pengeluaran_karyawan_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "Pengeluaran Karyawan Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	
}
