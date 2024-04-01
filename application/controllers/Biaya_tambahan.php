<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Biaya_tambahan extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('biaya_tambahan_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/biaya_tambahan/list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
	}

	public function create() 
	{
			$data = array(
				'transaksi_id' => $this->input->post('id_transaksi'),
				'tanggal' => $this->input->post('tanggal'),
				'flight' => $this->input->post('flight'),
				'harga' => str_replace('.', '', $this->input->post('harga')),
				'fee' => str_replace('.', '', $this->input->post('fee')),
				'jumlah' => str_replace('.', '', $this->input->post('jumlah')),
				'status' => $this->input->post('status'),
				'keterangan' => $this->input->post('keterangan'),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);

			$insert = $this->biaya_tambahan_model->insert($data);

			if ($insert) {
				$data['status_data'] = true;
				$data['msg'] = "Biaya Tambahan Berhasil Dibuat";
				echo json_encode($data);
			} else {
				$data['status_data'] = false;
				$data['msg'] = "Biaya Tambahan Gagal Dibuat";
				echo json_encode($data);
			}
		
	}

	public function edit() 
	{
		$this->form_validation->set_rules('tanggal', "Tanggal Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('flight', "light Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga', "Harga Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('fee', "Fee Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('jumlah', "Jumlah Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('status', "Status Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('keterangan', "Keterangan Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			$data = array(
				'tanggal' => $this->input->post('tanggal'),
				'flight' => $this->input->post('flight'),
				'harga' => str_replace('.', '', $this->input->post('harga')),
				'fee' => str_replace('.', '', $this->input->post('fee')),
				'jumlah' => str_replace('.', '', $this->input->post('jumlah')),
				'status' => $this->input->post('status'),
				'keterangan' => $this->input->post('keterangan'),
				'updated_at' => date('Y-m-d H:i:s'),
				'updated_by' => $this->data['users']->id
			);

			$id = $this->input->post('id');

			$update = $this->biaya_tambahan_model->update($data, array("biaya_tambahan.id" => $id));

			if ($update) {
				$data['msg'] = "Biaya Tambahan Berhasil Diubah";
				$data['status_data'] = true;
				echo json_encode($data);
			} else {
				$data['msg'] = "Biaya Tambahan Gagal Diubah";
				$data['status_data'] = false;
				echo json_encode($data);
			}
		} else {
				$this->data['id'] = $this->uri->segment(3);
				$biaya_tambahan = $this->biaya_tambahan_model->getAllById(array("biaya_tambahan.id" => $this->data['id']));
				$this->data['id'] 	= (!empty($biaya_tambahan)) ? $biaya_tambahan[0]->id : "";
				$this->data['tanggal'] 	= (!empty($biaya_tambahan)) ? $biaya_tambahan[0]->tanggal : "";
				$this->data['flight'] 	= (!empty($biaya_tambahan)) ? $biaya_tambahan[0]->flight : "";
				$this->data['harga'] 	= (!empty($biaya_tambahan)) ? $biaya_tambahan[0]->harga : "";
				$this->data['jumlah'] 	= (!empty($biaya_tambahan)) ? $biaya_tambahan[0]->jumlah : "";
				$this->data['fee'] 	= (!empty($biaya_tambahan)) ? $biaya_tambahan[0]->fee : "";
				$this->data['keterangan'] 	= (!empty($biaya_tambahan)) ? $biaya_tambahan[0]->keterangan : "";
				$this->data['status'] 	= (!empty($biaya_tambahan)) ? $biaya_tambahan[0]->status : "";
				$this->data['content'] = 'admin/biaya_tambahan/edit_v';

				echo json_encode($this->data);
		}

	}

	public function dataList($id_transaksi) 
	{
		$columns = array(
			0 => 'tanggal',
			1 => 'flight',
			2 => 'harga',
			3 => 'jumlah',
			4 => 'fee',
			5 => 'status',
			6 => 'keterangan',
			7 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$where = array('transaksi_id' => $id_transaksi);
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->biaya_tambahan_model->getCountAllBy($limit, $start, $search, $order, $dir, $where);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"biaya_tambahan.tanggal" => $search_value,
				"biaya_tambahan.flight" => $search_value,
				"biaya_tambahan.harga" => $search_value,
				"biaya_tambahan.jumlah" => $search_value,
				"biaya_tambahan.fee" => $search_value,
				"biaya_tambahan.status" => $search_value,
				"biaya_tambahan.keterangan" => $search_value,
			);
			$totalFiltered = $this->biaya_tambahan_model->getCountAllBy($limit, $start, $search, $order, $dir, $where);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->biaya_tambahan_model->getAllBy($limit, $start, $search, $order, $dir, $where);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='#' url='" . base_url() . "biaya_tambahan/edit/" . $data->id . "' class='btn btn-sm btn-primary text-white white btn-ubah'> Ubah</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "biaya_tambahan/destroy/" . $data->id . "/" . $data->is_deleted . "'
						class='btn btn-sm btn-danger white delete'>Hapus
						</a>";
				}

				$nestedData['id'] = $start + $key + 1;
				$nestedData['flight'] = $data->flight;
				$nestedData['tanggal'] = $data->tanggal;
				$nestedData['harga'] = "Rp. ".number_format($data->harga);
				$nestedData['fee'] = "Rp. ".number_format($data->fee);
				$nestedData['jumlah'] = number_format($data->jumlah);
				$total = $data->harga * $data->jumlah;
				$nestedData['status'] = $data->status;
				$nestedData['keterangan'] = $data->keterangan;
				$nestedData['total'] = "Rp. ".number_format($total);
				$nestedData['action'] = $edit_url . " " .$delete_url;
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
			$this->load->model("biaya_tambahan_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->biaya_tambahan_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "Biaya Tambahan Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	
}
