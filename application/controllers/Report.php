<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'core/Admin_Controller.php';
class Report extends Admin_Controller {
 	public function __construct()
	{
		parent::__construct(); 
	 	$this->load->model('fleet_event_model');
	 	$this->load->model('hours_meter_model');
	 	$this->load->model('location_model');
	}

	public function index()
	{

		$this->load->helper('url');
		if($this->data['is_can_read']){
			$this->data['content'] = 'admin/report/list_v'; 	
		}else{
			$this->data['content'] = 'errors/html/restrict'; 
		}
		
		$this->load->view('admin/layouts/page',$this->data);  
	}

	public function hm_monthly()
	{
		$bulan = $this->input->post('bulan');
		$tahun = $this->input->post('tahun');

		$this->load->helper('url');
		if($this->data['is_can_read']){
			
			$this->data['bulan'] = getBulan();
			$this->data['location'] = $this->location_model->getAllById(['location.is_deleted' => 0]);
			$this->data['content'] = 'admin/report/hm/monthly_v'; 	
		}else{
			$this->data['content'] = 'errors/html/restrict'; 
		}
		
		$this->load->view('admin/layouts/page',$this->data);  
	}

	public function dataListHmMonthly()
	{
		$tahun  = $this->input->post('tahun');
		$bulan  = $this->input->post('bulan');
		$lokasi = $this->input->post('lokasi');
		$where = [];
		if(empty($bulan)){
			$bulan = date("m");
		}

		if(empty($tahun)){
			$tahun = date("Y");
		}
		
		$where["YEAR(hours_meter.tanggal) = "]  = $tahun;
		$where["MONTH(hours_meter.tanggal) = "]  = sprintf("%02d", $bulan);

		if(!empty($lokasi)){
			$where["hours_meter.location_id"] = $lokasi;
		}
     	$datas = $this->hours_meter_model->getDataMonthly($where);
        $text_header = "Data Bulan ".bulan((int)$bulan)." ".$tahun;
	    $new_data = array();
        if(!empty($datas))
        {
            foreach ($datas as $key=>$data)
            {  
				$time_down = 0;
				if(!empty($data->time_down)){
					$jam_down = floatVal(date('h', strtotime($data->time_down)));
					$menit_down = floatVal(date('i', strtotime($data->time_down)))/60;
					$time_down = $jam_down+$menit_down;
				}
				
				$duration = 0;
				if(!empty($data->duration)){
					$duration = $data->duration;
				}

				$standy = "-";
				$standy = 12-$duration-$time_down;

				if(empty($duration)){
					$duration = "-";
				}

				if(empty($time_down)){
					$time_down = "-";
				}


                $nestedData['tanggal'] = $data->tanggal; 
                $nestedData['shift_name'] = $data->shift_name; 
                $nestedData['unit_kode'] = $data->unit_kode;
                $nestedData['unit_model_name'] = $data->unit_model_name; 
                $nestedData['operator_name'] = $data->operator_name; 
                $nestedData['hm_start'] = $data->hm_start; 
                $nestedData['hm_end'] = $data->hm_end; 
                $nestedData['duration'] = $duration; 
                $nestedData['standy'] = $standy; 
                $nestedData['time_down'] = $time_down; 
                $nestedData['remarks'] = $data->remarks; 
                $nestedData['location_name'] = $data->location_name; 
                $nestedData['week'] = $data->week; 
                $new_data[] = $nestedData; 
            }
        }
          
        $json_data = array(
			"data"=> $new_data,
			"text_header" => $text_header
		);
            
        echo json_encode($json_data); 
	}

	public function hm_location()
	{
		$bulan = $this->input->post('bulan');
		$tahun = $this->input->post('tahun');

		$this->load->helper('url');
		if($this->data['is_can_read']){
			$this->data['bulan'] = getBulan();
			$this->data['content'] = 'admin/report/hm/location_v'; 	
		}else{
			$this->data['content'] = 'errors/html/restrict'; 
		}
		
		$this->load->view('admin/layouts/page',$this->data);  
	}

	public function grafikHmByLocation()
	{
		$tahun  = $this->input->post('tahun');
		$bulan  = $this->input->post('bulan');
		$type   = $this->input->post('type');
		if(empty($type)){
			$type = "day";
		}

		$where = [];
		if(empty($bulan) && $type != "month"){
			$bulan = date("m");
		}

		if(empty($tahun)){
			$tahun = date("Y");
		}
		
		$where["YEAR(hours_meter.tanggal) = "]  = $tahun;
		if($type != "month"){
			$where["MONTH(hours_meter.tanggal) = "]  = sprintf("%02d", $bulan);
		}

		$datas = $this->hours_meter_model->getDataHmByLocation($where, $type);

		$kategori = [];
		$location_data = [];
		$tmp_data = [];

		//get tmp data untuk di olah
		if(!empty($datas)){
			if($type == "week"){
				$total_hari = date("Y-m-d", strtotime($tahun."-".$bulan."-01"));
				$firstweek = $this->weekOfYear(strtotime($total_hari)); 	
			}
			
			foreach ($datas as $key => $value) {
				if($type == "day"){
					$filter_tanggal = date("j", strtotime($value->filter_tanggal));
				}elseif ($type == "week") {
					$filter_tanggal = $value->filter_tanggal - $firstweek;
				}elseif ($type == "month") {
					$filter_tanggal = $value->filter_tanggal;
				}
				$tmp_data[$value->location_name][$filter_tanggal] = $value->total;
			}
		}

		//get kategori
		if($type == "day"){
			$text_header = "Data Harian Bulan ".bulan((int)$bulan)." ".$tahun;
			$total_hari = date("t", strtotime($tahun."-".$bulan));
			for ($i=1; $i <= $total_hari ; $i++) { 
				$kategori[] = $i;
			}
		}elseif($type == "week"){
			$text_header = "Data Mingguan Bulan ".bulan((int)$bulan)." ".$tahun;
			$total_hari = date("Y-m-t", strtotime($tahun."-".$bulan));
			$lastweek = $this->weekOfMonth(strtotime($total_hari)); 
			for ($i=1; $i <= $lastweek ; $i++) { 
				$kategori[] = "Minggu Ke ".$i;
			}
		}elseif ($type == "month") {
			$text_header = "Data Bulanan ".$tahun;
			for ($i=1; $i <= 12 ; $i++) { 
				$kategori[] = bulan($i);
			}
		}

		//get data dari tmp 
		if(!empty($tmp_data)){
			foreach ($tmp_data as $key => $value) {
				$location = new stdClass();	
				$location->name = $key;
				$data = [];
				for ($i=1; $i <= count($kategori); $i++) { 
					if(!empty($value[$i])){
						$data[] = intVal($value[$i]);
					}else{
						$data[] = 0;
					}
				}
				$location->data = $data;
				array_push($location_data, $location);
			}
		}
		
		$json_data = array(
			"kategori" => $kategori,
			"data"=> $location_data,
			"text_header" => $text_header
		);
            
        echo json_encode($json_data); 
	}

	public function hm_operator()
	{
		$bulan = $this->input->post('bulan');
		$tahun = $this->input->post('tahun');

		$this->load->helper('url');
		if($this->data['is_can_read']){
			$this->data['bulan'] = getBulan();
			$this->data['location'] = $this->location_model->getAllById(['location.is_deleted' => 0]);
			$this->data['content'] = 'admin/report/hm/operator_v'; 	
		}else{
			$this->data['content'] = 'errors/html/restrict'; 
		}
		
		$this->load->view('admin/layouts/page',$this->data);  
	}

	public function grafikHmByOperator()
	{
		$tahun  = $this->input->post('tahun');
		$bulan  = $this->input->post('bulan');
		$type   = $this->input->post('type');
		$lokasi = $this->input->post('lokasi');
		if(empty($type)){
			$type = "day";
		}

		$where = [];
		if(empty($bulan) && $type != "month"){
			$bulan = date("m");
		}

		if(empty($tahun)){
			$tahun = date("Y");
		}
		
		$where["YEAR(hours_meter.tanggal) = "]  = $tahun;
		if($type != "month"){
			$where["MONTH(hours_meter.tanggal) = "]  = sprintf("%02d", $bulan);
		}

		if(!empty($lokasi)){
			$where["hours_meter.location_id"]  = $lokasi;
		}

		$datas = $this->hours_meter_model->getDataHmByOperator($where, $type);

		$kategori = [];
		$operator_data = [];
		$tmp_data = [];

		//get tmp data untuk di olah
		if(!empty($datas)){
			if($type == "week"){
				$total_hari = date("Y-m-d", strtotime($tahun."-".$bulan."-01"));
				$firstweek = $this->weekOfYear(strtotime($total_hari)); 	
			}
			
			foreach ($datas as $key => $value) {
				if($type == "day"){
					$filter_tanggal = date("j", strtotime($value->filter_tanggal));
				}elseif ($type == "week") {
					$filter_tanggal = $value->filter_tanggal - $firstweek;
				}elseif ($type == "month") {
					$filter_tanggal = $value->filter_tanggal;
				}
				$tmp_data[$value->operator_name][$filter_tanggal] = $value->total;
			}
		}

		//get kategori
		if($type == "day"){
			$text_header = "Data Harian Bulan ".bulan((int)$bulan)." ".$tahun;
			$total_hari = date("t", strtotime($tahun."-".$bulan));
			for ($i=1; $i <= $total_hari ; $i++) { 
				$kategori[] = $i;
			}
		}elseif($type == "week"){
			$text_header = "Data Mingguan Bulan ".bulan((int)$bulan)." ".$tahun;
			$total_hari = date("Y-m-t", strtotime($tahun."-".$bulan));
			$lastweek = $this->weekOfMonth(strtotime($total_hari)); 
			for ($i=1; $i <= $lastweek ; $i++) { 
				$kategori[] = "Minggu Ke ".$i;
			}
		}elseif ($type == "month") {
			$text_header = "Data Bulanan ".$tahun;
			for ($i=1; $i <= 12 ; $i++) { 
				$kategori[] = bulan($i);
			}
		}

		//get data dari tmp 
		if(!empty($tmp_data)){
			foreach ($tmp_data as $key => $value) {
				$operator = new stdClass();	
				$operator->name = $key;
				$data = [];
				for ($i=1; $i <= count($kategori); $i++) { 
					if(!empty($value[$i])){
						$data[] = intVal($value[$i]);
					}else{
						$data[] = 0;
					}
				}
				$operator->data = $data;
				array_push($operator_data, $operator);
			}
		}
		
		$json_data = array(
			"kategori" => $kategori,
			"data"=> $operator_data,
			"text_header" => $text_header
		);
            
        echo json_encode($json_data); 
	}

	public function hm_unit_duration()
	{
		$bulan = $this->input->post('bulan');
		$tahun = $this->input->post('tahun');

		$this->load->helper('url');
		if($this->data['is_can_read']){
			$this->data['bulan'] = getBulan();
			$this->data['location'] = $this->location_model->getAllById(['location.is_deleted' => 0]);
			$this->data['content'] = 'admin/report/hm/unit_duration_v'; 	
		}else{
			$this->data['content'] = 'errors/html/restrict'; 
		}
		
		$this->load->view('admin/layouts/page',$this->data);  
	}

	public function grafikHmByUnit()
	{
		$tahun  = $this->input->post('tahun');
		$bulan  = $this->input->post('bulan');
		$type   = $this->input->post('type');
		$lokasi = $this->input->post('lokasi');
		if(empty($type)){
			$type = "day";
		}

		$where = [];
		if(empty($bulan) && $type != "month"){
			$bulan = date("m");
		}

		if(empty($tahun)){
			$tahun = date("Y");
		}
		
		$where["YEAR(hours_meter.tanggal) = "]  = $tahun;
		if($type != "month"){
			$where["MONTH(hours_meter.tanggal) = "]  = sprintf("%02d", $bulan);
		}

		if(!empty($lokasi)){
			$where["hours_meter.location_id"]  = $lokasi;
		}

		$datas = $this->hours_meter_model->getDataHmByUnit($where, $type);
		$kategori = [];
		$operator_data = [];
		$tmp_data = [];

		//get tmp data untuk di olah
		if(!empty($datas)){
			if($type == "week"){
				$total_hari = date("Y-m-d", strtotime($tahun."-".$bulan."-01"));
				$firstweek = $this->weekOfYear(strtotime($total_hari)); 	
			}
			
			foreach ($datas as $key => $value) {
				if($type == "day"){
					$filter_tanggal = date("j", strtotime($value->filter_tanggal));
				}elseif ($type == "week") {
					$filter_tanggal = $value->filter_tanggal - $firstweek;
				}elseif ($type == "month") {
					$filter_tanggal = $value->filter_tanggal;
				}
				$tmp_data["Duration"][$filter_tanggal] = $value->duration;
				$tmp_data["Breakdown"][$filter_tanggal] = $value->breakdown;
				if(empty($value->duration) && empty($value->breakdown)){
					$tmp_data["Standby"][$filter_tanggal] = 12;
				}elseif (empty($value->duration) || empty($value->breakdown)) {
					$tmp_data["Standby"][$filter_tanggal] = 0;
				}else{
					$tmp_data["Standby"][$filter_tanggal] = $value->standby;
				}
			}
		}
		//get kategori
		if($type == "day"){
			$text_header = "Data Harian Bulan ".bulan((int)$bulan)." ".$tahun;
			$total_hari = date("t", strtotime($tahun."-".$bulan));
			for ($i=1; $i <= $total_hari ; $i++) { 
				$kategori[] = $i;
			}
		}elseif($type == "week"){
			$text_header = "Data Mingguan Bulan ".bulan((int)$bulan)." ".$tahun;
			$total_hari = date("Y-m-t", strtotime($tahun."-".$bulan));
			$lastweek = $this->weekOfMonth(strtotime($total_hari)); 
			for ($i=1; $i <= $lastweek ; $i++) { 
				$kategori[] = "Minggu Ke ".$i;
			}
		}elseif ($type == "month") {
			$text_header = "Data Bulanan ".$tahun;
			for ($i=1; $i <= 12 ; $i++) { 
				$kategori[] = bulan($i);
			}
		}

		//get data dari tmp 
		if(!empty($tmp_data)){
			foreach ($tmp_data as $key => $value) {
				$operator = new stdClass();	
				$operator->name = $key;
				$data = [];
				for ($i=1; $i <= count($kategori); $i++) { 
					if(!empty($value[$i])){
						$data[] = floatVal($value[$i]);
					}else{
						$data[] = 0;
					}
				}
				$operator->data = $data;
				array_push($operator_data, $operator);
			}
		}
		$json_data = array(
			"kategori" => $kategori,
			"data"=> $operator_data,
			"text_header" => $text_header
		);
            
        echo json_encode($json_data); 
	}

	private function weekOfMonth($date) {
		$firstOfMonth = strtotime(date("Y-m-01", $date));
		return $this->weekOfYear($date) - $this->weekOfYear($firstOfMonth) + 1;
	}
	
	private function weekOfYear($date) {
		$weekOfYear = intval(date("W", $date));
		if (date('n', $date) == "1" && $weekOfYear > 51) {
			return 0;
		}
		else if (date('n', $date) == "12" && $weekOfYear == 1) {
			return 53;
		}
		else {
			return $weekOfYear;
		}
	}

	public function fe_monthly()
	{
		$bulan = $this->input->post('bulan');
		$tahun = $this->input->post('tahun');

		$this->load->helper('url');
		if($this->data['is_can_read']){
			
			$this->data['bulan'] = getBulan();
			$this->data['location'] = $this->location_model->getAllById(['location.is_deleted' => 0]);
			$this->data['content'] = 'admin/report/fe/monthly_v'; 	
		}else{
			$this->data['content'] = 'errors/html/restrict'; 
		}
		
		$this->load->view('admin/layouts/page',$this->data);  
	}

	public function dataListFeMonthly()
	{
		$tahun  = $this->input->post('tahun');
		$bulan  = $this->input->post('bulan');
		$lokasi = $this->input->post('lokasi');
		$where = [];
		$where_location = FALSE;
		if(empty($bulan)){
			$bulan = date("m");
		}

		if(empty($tahun)){
			$tahun = date("Y");
		}
		
		$where["YEAR(fleet_event.tanggal) = "]  = $tahun;
		$where["MONTH(fleet_event.tanggal) = "]  = sprintf("%02d", $bulan);

		if(!empty($lokasi)){
			$where["fleet_event.location_id"] = $lokasi;
		}
     	$datas = $this->fleet_event_model->getDataMonthly($where);
        $text_header = "Data Bulan ".bulan((int)$bulan)." ".$tahun;
	    $new_data = array();
        if(!empty($datas))
        {
            foreach ($datas as $key=>$data)
            {  
                $nestedData['tanggal'] = $data->tanggal; 
                $nestedData['shift'] = $data->shift; 
                $nestedData['unit_kode'] = $data->unit_kode;
                $nestedData['unit_model_name'] = $data->unit_model_name; 
                $nestedData['start_time'] = $data->start_time; 
                $nestedData['end_time'] = $data->end_time; 
                $nestedData['duration'] = $data->duration; 
                $nestedData['status_name'] = $data->status_name; 
                $nestedData['reason_name'] = $data->reason_name; 
                // $nestedData['location_name'] = $data->location_name; 
                $nestedData['location_name'] = ""; 
                $new_data[] = $nestedData; 
            }
        }
          
        $json_data = array(
			"data"=> $new_data,
			"text_header" => $text_header
		);
            
        echo json_encode($json_data); 
	}
}
