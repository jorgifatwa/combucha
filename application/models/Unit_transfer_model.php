<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Unit_transfer_model extends CI_Model {
	public function __construct() {
		parent::__construct();
	}
	public function getOneBy($where = array()) {
		$this->db->select("unit_transfer.*, location.name as last_location_name")->from("unit_transfer");
		$this->db->join("location", "location.id = unit_transfer.to_location");
		$this->db->where($where);
		$this->db->where("unit_transfer.is_deleted", 1);
		$this->db->order_by('id', 'DESC');
		$this->db->limit(1);

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->row();
		}
		return FALSE;
	}

	public function getUnitByLocation($where = array()) {
		$this->db->select("unit.id, unit.kode, unit_brand.name as unit_brand_name, unit_model.name as unit_model_name")->from("unit_transfer");
		$this->db->join("location lokasi_tujuan", "lokasi_tujuan.id = unit_transfer.to_location");
		$this->db->join("unit", "unit.id = unit_transfer.unit_id");
		$this->db->join("unit_brand", "unit_brand.id = unit.brand_id");
		$this->db->join("unit_model", "unit_model.id = unit.unit_model_id");
		$this->db->where("unit_transfer.is_deleted", 1);
		$this->db->where($where);
		$this->db->group_by('unit_transfer.unit_id');
		$this->db->order_by('unit_transfer.id', 'DESC');

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->result();
		}
		return FALSE;
	}

	public function getAllById($where = array()) {
		$this->db->select("unit_transfer.*")->from("unit_transfer");
		$this->db->where("unit_transfer.is_deleted", 1);
		$this->db->where($where);

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->result();
		}
		return FALSE;
	}
	public function insert($data) {
		$this->db->insert("unit_transfer", $data);
		return $this->db->insert_id();
	}

	public function update($data, $where) {
		$this->db->update("unit_transfer", $data, $where);
		return $this->db->affected_rows();
	}

	public function delete($where) {
		$this->db->where($where);
		$this->db->delete("unit_transfer");
		if ($this->db->affected_rows()) {
			return TRUE;
		}
		return FALSE;
	}

	function getAllBy($limit, $start, $search, $col, $dir) {
		$this->db->select("unit_transfer.*, lokasi_awal.name as from, lokasi_tujuan.name as to, unit.kode as unit_name, unit_brand.name as unit_brand_name, unit_model.name as unit_model_name, IF(unit_transfer.from_location = unit_transfer.to_location, '0', '1') as show_data")->from("unit_transfer");
		$this->db->join("location lokasi_awal", "lokasi_awal.id = unit_transfer.from_location");
		$this->db->join("location lokasi_tujuan", "lokasi_tujuan.id = unit_transfer.to_location");
		$this->db->join("unit", "unit.id = unit_transfer.unit_id");
		$this->db->join("unit_brand", "unit_brand.id = unit.brand_id");
		$this->db->join("unit_model", "unit_model.id = unit.unit_model_id");
		$this->db->having("show_data", 1);
		$this->db->limit($limit, $start)->order_by($col, $dir);
		if (!empty($search)) {
			$this->db->group_start();
			foreach ($search as $key => $value) {
				$this->db->or_like($key, $value);
			}
			$this->db->group_end();
		}

		$result = $this->db->get();
		if ($result->num_rows() > 0) {
			return $result->result();
		} else {
			return null;
		}
	}

	function getCountAllBy($limit, $start, $search, $order, $dir) {
		$this->db->select("unit_transfer.*, lokasi_awal.name as from, lokasi_tujuan.name as to, unit.kode as unit_name, unit_brand.name as unit_brand_name, unit_model.name as unit_model_name, IF(unit_transfer.from_location = unit_transfer.to_location, '0', '1') as show_data")->from("unit_transfer");
		$this->db->join("location lokasi_awal", "lokasi_awal.id = unit_transfer.from_location");
		$this->db->join("location lokasi_tujuan", "lokasi_tujuan.id = unit_transfer.to_location");
		$this->db->join("unit", "unit.id = unit_transfer.unit_id");
		$this->db->join("unit_brand", "unit_brand.id = unit.brand_id");
		$this->db->join("unit_model", "unit_model.id = unit.unit_model_id");
		$this->db->having("show_data", 1);
		if (!empty($search)) {
			$this->db->group_start();
			foreach ($search as $key => $value) {
				$this->db->or_like($key, $value);
			}
			$this->db->group_end();
		}

		$result = $this->db->get();

		return $result->num_rows();
	}

	public function getLastLocation($unit_id) {
		$this->db->select("to_location")->from("unit_transfer");
		$this->db->where("unit_transfer.is_deleted", 1);
		$this->db->where('unit_id', $unit_id);
		$this->db->order_by('id', 'DESC');
		$this->db->limit(1);

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->row()->to_location;
		}
		return FALSE;
	}
}
