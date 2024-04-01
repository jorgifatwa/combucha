<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class User_mutation_model extends CI_Model {

	public function __construct() {
		parent::__construct();
	}
	public function getOneBy($where = array()) {
		$this->db->select("user_mutation.*, location.name as last_location_name")->from("user_mutation");
		$this->db->join("location", "location.id = user_mutation.to_location");
		$this->db->where($where);
		$this->db->where("user_mutation.status", 1);
		$this->db->order_by('id', 'DESC');
		$this->db->limit(1);

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->row();
		}
		return FALSE;
	}

	public function getUserByLocation($where = array()) {
		$this->db->select("users.id, users.nik, users.first_name, roles.name as role_name")->from("user_mutation");
		$this->db->join("users", "users.id = user_mutation.user_id");
		$this->db->join("users_roles", "users_roles.user_id = users.id");
		$this->db->join("roles", "roles.id = users_roles.role_id");
		$this->db->join("location lokasi_tujuan", "lokasi_tujuan.id = user_mutation.to_location");
		$this->db->where("users_roles.role_id !=", 1);
		$this->db->where("user_mutation.status", 1);
		$this->db->where($where);
		$this->db->group_by('user_mutation.user_id');
		$this->db->order_by('user_mutation.id', 'DESC');

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->result();
		}
		return FALSE;
	}

	public function getSupervisor($where = array()) {
		$this->db->select("users.id as user_id, users.first_name as username")->from("user_mutation");
		$this->db->join("users", "users.id = user_mutation.user_id");
		$this->db->join("users_roles", "users_roles.user_id = users.id");
		$this->db->join("location lokasi_tujuan", "lokasi_tujuan.id = user_mutation.to_location");
		$this->db->where("users_roles.role_id", 3);
		$this->db->where($where);
		$this->db->group_by('user_mutation.user_id');
		$this->db->order_by('user_mutation.id', 'DESC');

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->result();
		}
		return FALSE;
	}
	public function getOperator($where = array()) {
		$this->db->select("users.id as user_id, users.first_name as username")->from("user_mutation");
		$this->db->join("users", "users.id = user_mutation.user_id");
		$this->db->join("users_roles", "users_roles.user_id = users.id");
		$this->db->join("location lokasi_tujuan", "lokasi_tujuan.id = user_mutation.to_location");
		$this->db->where($where);
		$this->db->group_by('user_mutation.user_id');
		$this->db->order_by('user_mutation.id', 'DESC');

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->result();
		}
		return FALSE;
	}
	public function getAllById($where = array()) {
		$this->db->select("user_mutation.*")->from("user_mutation");
		$this->db->where("user_mutation.status", 1);
		$this->db->where($where);

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->result();
		}
		return FALSE;
	}
	public function insert($data) {
		$this->db->insert("user_mutation", $data);
		return $this->db->insert_id();
	}

	public function update($data, $where) {
		$this->db->update("user_mutation", $data, $where);
		return $this->db->affected_rows();
	}

	public function delete($where) {
		$this->db->where($where);
		$this->db->delete("user_mutation");
		if ($this->db->affected_rows()) {
			return TRUE;
		}
		return FALSE;
	}

	function getAllBy($limit, $start, $search, $col, $dir) {
		$this->db->select("user_mutation.*, lokasi_awal.name as from, lokasi_tujuan.name as to, users.first_name as user_name, roles.name as roles_name, users.nik as nik, IF(user_mutation.from_location = user_mutation.to_location, '0', '1') as show_data")->from("user_mutation");
		$this->db->join("location lokasi_awal", "lokasi_awal.id = user_mutation.from_location");
		$this->db->join("location lokasi_tujuan", "lokasi_tujuan.id = user_mutation.to_location");
		$this->db->join("users", "users.id = user_mutation.user_id");
		$this->db->join("users_roles", "users_roles.user_id = user_mutation.user_id");
		$this->db->join("roles", "roles.id = users_roles.role_id");
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
		$this->db->select("user_mutation.*, lokasi_awal.name as from, lokasi_tujuan.name as to, users.first_name as user_name, roles.name as roles_name, users.nik as nik, IF(user_mutation.from_location = user_mutation.to_location, '0', '1') as show_data")->from("user_mutation");
		$this->db->join("location lokasi_awal", "lokasi_awal.id = user_mutation.from_location");
		$this->db->join("location lokasi_tujuan", "lokasi_tujuan.id = user_mutation.to_location");
		$this->db->join("users", "users.id = user_mutation.user_id");
		$this->db->join("users_roles", "users_roles.user_id = user_mutation.user_id");
		$this->db->join("roles", "roles.id = users_roles.role_id");
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

	public function getLastLocation($user_id) {
		$this->db->select("to_location")->from("user_mutation");
		$this->db->where("user_mutation.status", 1);
		$this->db->where('user_id', $user_id);
		$this->db->order_by('id', 'DESC');
		$this->db->limit(1);

		$query = $this->db->get();
		if ($query->num_rows() > 0) {
			return $query->row()->to_location;
		}
		return FALSE;
	}
}
