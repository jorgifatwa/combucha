<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Unit_model_model extends CI_Model {

	public function __construct() {
		parent::__construct();
	}
	public function getOneBy($where = array()) {
		$this->db->select("unit_model.*, unit_brand.name as brand_name, unit_category.name as category_name")->from("unit_model");
		$this->db->join("unit_brand", "unit_brand.id = unit_model.brand_id");
		$this->db->join("unit_category", "unit_category.id = unit_model.unit_category_id");
		$this->db->where($where);
		$this->db->where("unit_model.is_deleted", 0);

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->row();
		}
		return FALSE;
	}

	public function getTotal($where = array()) {
		$this->db->select("count(unit_model.id) as total")->from("unit_model");
		$this->db->where($where);
		$this->db->where("unit_model.is_deleted", 0);

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->row();
		}
		return FALSE;
	}
	public function getAllById($where = array()) {
		$this->db->select("unit_model.*, unit_brand.name as brand_name, unit_category.name as category_name")->from("unit_model");
		$this->db->join("unit_brand", "unit_brand.id = unit_model.brand_id");
		$this->db->join("unit_category", "unit_category.id = unit_model.unit_category_id");

		$this->db->where($where);
		$this->db->where("unit_model.is_deleted", 0);

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->result();
		}
		return FALSE;
	}

	public function getModel($where = array()) {
		$this->db->select("unit_model.*")->from("unit_model");

		$this->db->where($where);
		$this->db->where("unit_model.is_deleted", 0);

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->result();
		}
		return FALSE;
	}
	public function insert($data) {
		$this->db->insert("unit_model", $data);
		return $this->db->insert_id();
	}

	public function update($data, $where) {
		$this->db->update("unit_model", $data, $where);
		return $this->db->affected_rows();
	}

	public function delete($where) {
		$this->db->where($where);
		$this->db->delete("unit_model");
		if ($this->db->affected_rows()) {
			return TRUE;
		}
		return FALSE;
	}

	function getAllBy($limit, $start, $search, $col, $dir, $where) {
		$this->db->select("unit_model.*, unit_brand.name as brand_name, unit_category.name as category_name")->from("unit_model");
		$this->db->join("unit_brand", "unit_brand.id = unit_model.brand_id");
		$this->db->join("unit_category", "unit_category.id = unit_model.unit_category_id");
		$this->db->where("unit_model.is_deleted", 0);
		$this->db->limit($limit, $start)->order_by($col, $dir);
		if (!empty($search)) {
			$this->db->group_start();
			foreach ($search as $key => $value) {
				$this->db->or_like($key, $value);
			}
			$this->db->group_end();
		}
		$this->db->where($where);
		$result = $this->db->get();
		if ($result->num_rows() > 0) {
			return $result->result();
		} else {
			return null;
		}
	}

	function getCountAllBy($limit, $start, $search, $order, $dir, $where) {
		$this->db->select("unit_model.*, unit_brand.name as brand_name, unit_category.name as category_name")->from("unit_model");
		$this->db->join("unit_brand", "unit_brand.id = unit_model.brand_id");
		$this->db->join("unit_category", "unit_category.id = unit_model.unit_category_id");
		$this->db->where("unit_model.is_deleted", 0);
		if (!empty($search)) {
			$this->db->group_start();
			foreach ($search as $key => $value) {
				$this->db->or_like($key, $value);
			}
			$this->db->group_end();
		}
		$this->db->where($where);
		$result = $this->db->get();

		return $result->num_rows();
	}

	public function getAllByIdBrand($where = array()) {
		$this->db->select("unit_model.*, unit_brand.name as brand_name, unit_category.name as category_name")->from("unit_model");
		$this->db->join("unit_brand", "unit_brand.id = unit_model.brand_id");
		$this->db->join("unit_category", "unit_category.id = unit_model.unit_category_id");

		$this->db->where($where);
		$this->db->where("unit_model.is_deleted", 0);
		$this->db->group_by('unit_category.id');
		$this->db->order_by('unit_category.name', 'ASC');

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->result();
		}
		return FALSE;
	}

	public function getAllByIdBrandCategory($where = array()) {
		$this->db->select("unit_model.*, unit_brand.name as brand_name, unit_category.name as category_name")->from("unit_model");
		$this->db->join("unit_brand", "unit_brand.id = unit_model.brand_id");
		$this->db->join("unit_category", "unit_category.id = unit_model.unit_category_id");

		$this->db->where($where);
		$this->db->where("unit_model.is_deleted", 0);
		$this->db->order_by('unit_model.name', 'ASC');

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->result();
		}
		return FALSE;
	}
}
