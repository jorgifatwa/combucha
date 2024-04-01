<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
require_once FCPATH . 'vendor/autoload.php';

use Spipu\Html2Pdf\Html2Pdf;
class Transaksi extends Admin_Controller 
{
	public function __construct() 
	{
		parent::__construct();
		$this->load->model('transaksi_model');
		$this->load->model('biaya_tambahan_model');
		$this->load->model('travel_model');
	}

	public function index() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/transaksi/list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
	}

	public function create() 
	{
		$this->form_validation->set_rules('tanggal_keberangkatan', "Tanggal Keberangkatan Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('no_flight', "No. Flight Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('travel_id', "Nama Travel Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga', "Harga Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('jumlah_pax', "Jumlah Pax Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('status', "Status Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('flight', "Flight Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('fee_tl', "Fee TL Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('keterangan_tambahan', "Keterangan Harus Diisi", 'trim|required');

		if ($this->form_validation->run() === TRUE) {
			$data = array(
				'tanggal_keberangkatan' => $this->input->post('tanggal_keberangkatan'),
				'no_flight' => $this->input->post('no_flight'),
				'travel_id' => $this->input->post('travel_id'),
				'harga' => str_replace('.', '', $this->input->post('harga')),
				'jumlah_pax' => str_replace('.', '', $this->input->post('jumlah_pax')),
				'status' => $this->input->post('status'),
				'fee_tl' => str_replace('.', '', $this->input->post('fee_tl')),
				'keterangan' => $this->input->post('flight'),
				'keterangan_tambahan' => $this->input->post('keterangan_tambahan'),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);

			$insert = $this->transaksi_model->insert($data);

			if ($insert) {
				$this->session->set_flashdata('message', "transaksi Baru Berhasil Disimpan");
				redirect("transaksi");
			} else {
				$this->session->set_flashdata('message_error', "transaksi Baru Gagal Disimpan");
				redirect("transaksi");
			}
		} else {
			$this->data['travels'] = $this->travel_model->getAllById();
			$this->data['content'] = 'admin/transaksi/create_v';
			$this->load->view('admin/layouts/page', $this->data);
		}
	}

	public function edit() 
	{
		$this->form_validation->set_rules('tanggal_keberangkatan', "Tanggal Keberangkatan Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('no_flight', "No. Flight Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('travel_id', "Nama Travel Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga', "Harga Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('jumlah_pax', "Jumlah Pax Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('status', "Status Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('flight', "Flight Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('fee_tl', "Fee TL Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('keterangan_tambahan', "Keterangan Harus Diisi", 'trim|required');


		if ($this->form_validation->run() === TRUE) {
			

			$data = array(
				'tanggal_keberangkatan' => $this->input->post('tanggal_keberangkatan'),
				'no_flight' => $this->input->post('no_flight'),
				'travel_id' => $this->input->post('travel_id'),
				'harga' => str_replace('.', '', $this->input->post('harga')),
				'jumlah_pax' => str_replace('.', '', $this->input->post('jumlah_pax')),
				'status' => $this->input->post('status'),
				'fee_tl' => str_replace('.', '', $this->input->post('fee_tl')),
				'keterangan' => $this->input->post('flight'),
				'keterangan_tambahan' => $this->input->post('keterangan_tambahan'),
				'updated_at' => date('Y-m-d H:i:s'),
				'updated_by' => $this->data['users']->id
			);

			$id = $this->input->post('id');

			$update = $this->transaksi_model->update($data, array("transaksi.id" => $id));

			if ($update) {
				$this->session->set_flashdata('message', "transaksi Berhasil Diubah");
				redirect("transaksi", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "transaksi Gagal Diubah");
				redirect("transaksi", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("transaksi/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$transaksi = $this->transaksi_model->getAllById(array("transaksi.id" => $this->data['id']));
				$this->data['travels'] = $this->travel_model->getAllById();
				$this->data['id'] 	= (!empty($transaksi)) ? $transaksi[0]->id : "";
				$this->data['tanggal_keberangkatan'] 	= (!empty($transaksi)) ? $transaksi[0]->tanggal_keberangkatan : "";
				$this->data['no_flight'] 	= (!empty($transaksi)) ? $transaksi[0]->no_flight : "";
				$this->data['travel_id'] 	= (!empty($transaksi)) ? $transaksi[0]->travel_id : "";
				$this->data['harga'] 	= (!empty($transaksi)) ? $transaksi[0]->harga : "";
				$this->data['jumlah_pax'] 	= (!empty($transaksi)) ? $transaksi[0]->jumlah_pax : "";
				$this->data['fee_tl'] 	= (!empty($transaksi)) ? $transaksi[0]->fee_tl : "";
				$this->data['keterangan'] 	= (!empty($transaksi)) ? $transaksi[0]->keterangan : "";
				$this->data['keterangan_tambahan'] 	= (!empty($transaksi)) ? $transaksi[0]->keterangan_tambahan : "";
				$this->data['status'] 	= (!empty($transaksi)) ? $transaksi[0]->status : "";
				$this->data['content'] = 'admin/transaksi/edit_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function detail() 
	{

		$this->form_validation->set_rules('tanggal_keberangkatan', "Tanggal Keberangkatan Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('no_flight', "No. Flight Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('travel_id', "Nama Travel Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('harga', "Harga Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('jumlah_pax', "Jumlah Pax Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('status', "Status Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('flight', "Flight Harus Diisi", 'trim|required');
		$this->form_validation->set_rules('keterangan_tambahan', "Keterangan Harus Diisi", 'trim|required');


		if ($this->form_validation->run() === TRUE) {
			

			$data = array(
				'tanggal_keberangkatan' => $this->input->post('tanggal_keberangkatan'),
				'no_flight' => $this->input->post('no_flight'),
				'travel_id' => $this->input->post('travel_id'),
				'harga' => str_replace('.', '', $this->input->post('harga')),
				'jumlah_pax' => str_replace('.', '', $this->input->post('jumlah_pax')),
				'status' => $this->input->post('status'),
				'keterangan' => $this->input->post('flight'),
				'keterangan_tambahan' => $this->input->post('keterangan_tambahan'),
				'created_at' => date('Y-m-d H:i:s'),
				'created_by' => $this->data['users']->id
			);

			$id = $this->input->post('id');

			$update = $this->transaksi_model->update($data, array("transaksi.id" => $id));

			if ($update) {
				$this->session->set_flashdata('message', "transaksi Berhasil Diubah");
				redirect("transaksi", "refresh");
			} else {
				$this->session->set_flashdata('message_error', "transaksi Gagal Diubah");
				redirect("transaksi", "refresh");
			}
		} else {
			if (!empty($_POST)) {
				$id = $this->input->post('id');
				$this->session->set_flashdata('message_error', validation_errors());
				return redirect("transaksi/edit/" . $id);
			} else {
				$this->data['id'] = $this->uri->segment(3);
				$transaksi = $this->transaksi_model->getAllById(array("transaksi.id" => $this->data['id']));
				$this->data['travels'] = $this->travel_model->getAllById();
				$this->data['biayas'] = $this->biaya_tambahan_model->getAllById(array("transaksi_id" => $this->data['id']));
				$this->data['id'] 	= (!empty($transaksi)) ? $transaksi[0]->id : "";
				$this->data['tanggal_keberangkatan'] 	= (!empty($transaksi)) ? $transaksi[0]->tanggal_keberangkatan : "";
				$this->data['no_flight'] 	= (!empty($transaksi)) ? $transaksi[0]->no_flight : "";
				$this->data['travel_id'] 	= (!empty($transaksi)) ? $transaksi[0]->travel_id : "";
				$this->data['harga'] 	= (!empty($transaksi)) ? $transaksi[0]->harga : "";
				$this->data['jumlah_pax'] 	= (!empty($transaksi)) ? $transaksi[0]->jumlah_pax : "";
				$this->data['fee_tl'] 	= (!empty($transaksi)) ? $transaksi[0]->fee_tl : "";
				$this->data['keterangan'] 	= (!empty($transaksi)) ? $transaksi[0]->keterangan : "";
				$this->data['keterangan_tambahan'] 	= (!empty($transaksi)) ? $transaksi[0]->keterangan_tambahan : "";
				$this->data['status'] 	= (!empty($transaksi)) ? $transaksi[0]->status : "";
				$this->data['key_status'] 	= (!empty($transaksi)) ? $transaksi[0]->status : "";

				if($this->data['status'] == 0){
					$this->data['status'] = "Lunas";
				}else{
					$this->data['status'] = "Belum Lunas";
				}

				if($this->data['jumlah_pax'] >= 40){
					$total_jumlah_pax = $this->data['jumlah_pax'] / 40;
					$total_jumlah_pax = floor($total_jumlah_pax);
					$this->data['total_fee'] = $this->data['harga'] * $total_jumlah_pax;
				}else{
					$this->data['total_fee'] = 0;
				}

				$this->data['nama_travel'] 	= (!empty($transaksi)) ? $transaksi[0]->nama_travel : "";
				$this->data['nama_bank'] 	= (!empty($this->data['users'])) ? $this->data['users']->nama_bank : "";
				$this->data['no_rekening'] 	= (!empty($this->data['users'])) ? $this->data['users']->no_rekening : "";
				$this->data['nama_lengkap'] 	= (!empty($this->data['users'])) ? $this->data['users']->first_name." ".$this->data['users']->last_name : "";
				$this->data['content'] = 'admin/transaksi/detail_v';
				$this->load->view('admin/layouts/page', $this->data);
			}
		}

	}

	public function dataList() 
	{
		$columns = array(
			0 => 'tanggal_keberangkatan',
			1 => 'no_flight',
			2 => 'nama_travel',
			3 => 'harga',
			4 => 'jumlah_pax',
			5 => 'status',
			6 => 'nama_karyawan',
			7 => 'keterangan',
			8 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$limit = 0;
		$start = 0;
		$totalData = $this->transaksi_model->getCountAllBy($limit, $start, $search, $order, $dir);

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"transaksi.tanggal_keberangkatan" => $search_value,
				"transaksi.no_flight" => $search_value,
				"travel.nama" => $search_value,
				"transaksi.harga" => $search_value,
				"transaksi.jumlah_pax" => $search_value,
				"transaksi.status" => $search_value,
				"transaksi.keterangan" => $search_value,
				"users.first_name" => $search_value,
			);
			$totalFiltered = $this->transaksi_model->getCountAllBy($limit, $start, $search, $order, $dir);
		} else {
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->transaksi_model->getAllBy($limit, $start, $search, $order, $dir);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$edit_url = "";
				$delete_url = "";
				$detail_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$edit_url = "<a href='" . base_url() . "transaksi/edit/" . $data->id . "' class='btn btn-sm btn-primary text-white white'> Ubah</a>";
					$detail_url = "<a href='" . base_url() . "transaksi/detail/" . $data->id . "/transaksi' class='btn btn-sm btn-info white'> Detail</a>";
				}
				if ($this->data['is_can_delete']) {
					$delete_url = "<a href='#'
						url='" . base_url() . "transaksi/destroy/" . $data->id . "/" . $data->is_deleted . "'
						class='btn btn-sm btn-danger white delete'>Hapus
						</a>";
				}

				if($data->status == 0){
					$data->status = "Lunas";
				}else{
					$data->status = "Belum Lunas";
				}

				$nestedData['id'] = $start + $key + 1;
				$nestedData['no_flight'] = $data->no_flight;
				$nestedData['tanggal_keberangkatan'] = $data->tanggal_keberangkatan;
				$nestedData['nama_travel'] = $data->nama_travel;
				$nestedData['harga'] = "Rp. ".number_format($data->harga);
				$nestedData['jumlah_pax'] = number_format($data->jumlah_pax);
				$total = $data->harga * $data->jumlah_pax;
				$nestedData['status'] = $data->status;
				$nestedData['nama_karyawan'] = $data->nama_karyawan;
				$nestedData['keterangan'] = $data->keterangan;
				$nestedData['total'] = "Rp. ".number_format($total);
				$nestedData['action'] = $edit_url . " " . $detail_url." ".$delete_url;
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
			$this->load->model("transaksi_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1) ? 0 : 1,
			);
			$update = $this->transaksi_model->update($data, array("id" => $id));

			$response_data['data'] = $data;
			$response_data['msg'] = "transaksi Berhasil di Hapus";
			$response_data['status'] = true;
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	public function update_status() 
	{
		$response_data = array();
		$response_data['status'] = false;
		$response_data['msg'] = "";
		$response_data['data'] = array();

		$id = $this->uri->segment(3);
		$is_deleted = $this->uri->segment(4);

		if (!empty($id)) {
			$this->load->model("transaksi_model");
			$where = array(
				'status' => 'Pending',
				'transaksi_id' => $id
			);
			$biayas = $this->biaya_tambahan_model->getAllByid($where);
			if(empty($biayas)){
				$data = array(
					'status' => 0,
				);
				$update = $this->transaksi_model->update($data, array("id" => $id));
	
				$response_data['data'] = $data;
				$response_data['msg'] = "transaksi Berhasil di Lunaskan";
				$response_data['status'] = true;
			}else{
				$response_data['msg'] = "Biaya Masih Ada Yang Belum Lunas";
			}
		} else {
			$response_data['msg'] = "ID Harus Diisi";
		}

		echo json_encode($response_data);
	}

	public function generate_pdf() {
        $htmlContent = $this->input->post('htmlContent'); // Get HTML content from POST data

        $pdf = new Html2Pdf();
        $pdf->writeHTML($htmlContent);
        $pdf->output('output.pdf');
    }

	public function belum_lunas() 
	{
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/transaksi/belum_lunas_list_v';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$bulan = array (1 =>   'Januari',
                'Februari',
                'Maret',
                'April',
                'Mei',
                'Juni',
                'Juli',
                'Agustus',
                'September',
                'Oktober',
                'November',
                'Desember'
            );

		$this->data['bulan'] = $bulan;
		$this->data['travels'] = $this->travel_model->getAllById();

		$this->load->view('admin/layouts/page', $this->data);
	}

	public function belum_lunas_list() 
	{
		$columns = array(
			0 => 'tanggal_keberangkatan',
			1 => 'no_flight',
			2 => 'travel_id',
			3 => 'harga',
			4 => 'jumlah_pax',
			5 => 'status',
			6 => 'nama_karyawan',
			7 => 'keterangan',
			8 => '',
		);

		$order = $columns[$this->input->post('order')[0]['column']];
		$dir = $this->input->post('order')[0]['dir'];
		$search = array();
		$where = array('status' => 1);
		$limit = 0;
		$start = 0;
		$totalData = $this->transaksi_model->getCountAllByTransaksi($limit, $start, $search, $order, $dir, $where);
		$searchColumn = $this->input->post('columns');
		$filtered = false;

		if(!empty($searchColumn[0]['search']['value'])){
			$value = $searchColumn[0]['search']['value'];
			$where['MONTH(tanggal_keberangkatan) = '] = $value;

			$filtered = true;
		}

		if(!empty($searchColumn[2]['search']['value'])){
			$value = $searchColumn[2]['search']['value'];
			$where['transaksi.travel_id'] = $value;

			$filtered = true;
		}

		if (!empty($this->input->post('search')['value'])) {
			$search_value = $this->input->post('search')['value'];
			$search = array(
				"transaksi.tanggal_keberangkatan" => $search_value,
				"transaksi.no_flight" => $search_value,
				"travel.id" => $search_value,
				"transaksi.harga" => $search_value,
				"transaksi.jumlah_pax" => $search_value,
				"transaksi.status" => $search_value,
				"transaksi.keterangan" => $search_value,
				"users.first_name" => $search_value,
			);
			$filtered = true;
		}


		if($filtered){
			$totalFiltered = $this->transaksi_model->getCountAllByTransaksi($limit,$start,$search,$order,$dir, $where); 

		}else{
			$totalFiltered = $totalData;
		}

		$limit = $this->input->post('length');
		$start = $this->input->post('start');
		$datas = $this->transaksi_model->getAllByTransaksi($limit, $start, $search, $order, $dir, $where);

		$new_data = array();
		if (!empty($datas)) {

			foreach ($datas as $key => $data) {

				$delete_url = "";
				$detail_url = "";

				if ($this->data['is_can_edit'] && $data->is_deleted == 0) {
					$detail_url = "<a href='" . base_url() . "transaksi/detail/" . $data->id . "/belum_lunas' class='btn btn-sm btn-info white'> Detail</a>";
				}

				if($data->status == 0){
					$data->status = "Lunas";
				}else{
					$data->status = "Belum Lunas";
				}

				$nestedData['id'] = $start + $key + 1;
				$nestedData['no_flight'] = $data->no_flight;
				$nestedData['tanggal_keberangkatan'] = $data->tanggal_keberangkatan;
				$nestedData['nama_travel'] = $data->nama_travel;
				$nestedData['harga'] = "Rp. ".number_format($data->harga);
				$nestedData['jumlah_pax'] = number_format($data->jumlah_pax);
				$total = $data->harga * $data->jumlah_pax;
				$nestedData['status'] = $data->status;
				$nestedData['nama_karyawan'] = $data->nama_karyawan;
				$nestedData['keterangan'] = $data->keterangan;
				$nestedData['total'] = "Rp. ".number_format($total);
				$nestedData['action'] = $detail_url." ".$delete_url;
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
}
