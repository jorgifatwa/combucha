<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
class Pesanan_data extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('pesanan_data_model');
		$this->load->model('pesanan_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/pesanan_data/list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
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

			$update = $this->pesanan_data_model->update($data, array("pesanan_data.id" => $id));

			if ($update) {
				$this->session->set_flashdata('message', "Data Pesanan Berhasil Diubah");
				redirect("pesanan_data", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "Data Pesanan Gagal Diubah");
				redirect("pesanan_data", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("pesanan_data/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$pesanan_data = $this->pesanan_data_model->getAllById(array("pesanan_data.id" => $this->data['id']));
				
				$this->data['id'] 	= (!empty($pesanan_data)) ? $pesanan_data[0]->id : "";
				$this->data['nama'] 	= (!empty($pesanan_data)) ? $pesanan_data[0]->nama : "";
				$this->data['description'] = (!empty($pesanan_data)) ? $pesanan_data[0]->description : "";
				$this->data['content'] = 'admin/pesanan_data/edit_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function dataList() 
	{
		$columns = array(
			0 => 'created_at',
			1 => 'nama_pelanggan',
			2 => 'status',
			3 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->pesanan_data_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"transaksi.created_at" => $search_value,
				"pelanggan.nama" => $search_value,
				"transksi.status" => $search_value,
			);
			$totalFiltered = $this->pesanan_data_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->pesanan_data_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$delete_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<button type='button' data-id='".$data->id."' class='btn btn-sm btn-info btn-detail white'>Detail</button>";
				}

				if($data-> status == 1){
					$delete_url = "<a href='#'
						url='" . base_url() . "pesanan_data/destroy/" . $data->id . "/" . $data->status . "'
						class='btn btn-sm btn-success white delete'>Lunaskan
						</a>";
				}
				$nestedData['id'] = $start + $key + 1;
				$nestedData['tanggal'] = $data->created_at;
				$nestedData['status'] = $data->status == 0 ? 'Lunas' : 'Tidak Lunas';
				$nestedData['nama_pelanggan'] = $data->nama_pelanggan;
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
		$status = $this->uri->segment(4);
		if (!empty($id)) {
			$this->load->model("pesanan_data_model");
			$data = array(
				'status' => ($status == 1) ? 0 : 1,
			);
			$update = $this->pesanan_data_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "Data Pesanan Berhasil di Lunaskan";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Di isi";
		}

		echo json_encode($response_data);
	}

	public function getDetailData(){
		$id = $this->input->post('id');
		$data['data_detail'] = $this->pesanan_model->getAllById(array('id_transaksi' => $id));
		foreach ($data['data_detail'] as $key => $value) {
			$data['data_detail'][$key]->sub_total = $value->harga_jual * $value->jumlah;
		}
		echo json_encode($data);
		return json_encode($data);
	}

	public function cetak_pdf()
	{

		$data['data_pesanan'] = $this->pesanan_model->getAllHariIni();
        
        return $this->load->view('admin/pesanan_data/cetak', $data);
		
	}

	
}
