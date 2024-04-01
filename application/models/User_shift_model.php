<?php 
defined('BASEPATH') OR exit('No direct script access allowed'); 
class User_shift_model extends CI_Model
{
     

    public function __construct()
    {
        parent::__construct(); 
    }  
    public function getOneBy($where = array()){
        $this->db->select("user_shift.*")->from("user_shift"); 
        $this->db->where($where);  
        $this->db->where("user_shift.is_deleted",0);  

        $query = $this->db->get();
        if ($query->num_rows() >0){  
            return $query->row(); 
        } 
        return FALSE;
    }
    public function getAllById($where = array()){
        $this->db->select("user_shift.*")->from("user_shift");  

        $this->db->where($where);  
        $this->db->where("user_shift.is_deleted",0);  

        $query = $this->db->get();
        if ($query->num_rows() >0){  
            return $query->result(); 
        } 
        return FALSE;
    }
    public function insert($data){
        $this->db->insert("user_shift", $data);
        return $this->db->insert_id();
    }

    public function update($data,$where){
        $this->db->update("user_shift", $data, $where);
        return $this->db->affected_rows();
    }

    public function delete($where){
        $this->db->where($where);
        $this->db->delete("user_shift"); 
        if($this->db->affected_rows()){
            return TRUE;
        }
        return FALSE;
    }

    function getAllBy($limit,$start,$search,$col,$dir)
    {
        $this->db->select("user_shift.*, enum_shift.name as shift_name")->from("user_shift");   
    	$this->db->join("enum_shift","enum_shift.id = user_shift.shift_id");
        $this->db->where("user_shift.is_deleted",0);  

        $this->db->limit($limit,$start)->order_by($col,$dir);
        if(!empty($search)){
            $this->db->group_start();
            foreach($search as $key => $value){
                $this->db->or_like($key,$value);    
            }   
            $this->db->group_end();
        } 
  
        $result = $this->db->get();
        if($result->num_rows()>0)
        {
            return $result->result();  
        }
        else
        {
            return null;
        }
    }

    function getCountAllBy($limit,$start,$search,$order,$dir)
    { 
        $this->db->select("user_shift.*, enum_shift.name as shift_name")->from("user_shift");   
    	$this->db->join("enum_shift","enum_shift.id = user_shift.shift_id");
        $this->db->where("user_shift.is_deleted",0);  

        if(!empty($search)){
            $this->db->group_start();
            foreach($search as $key => $value){
                $this->db->or_like($key,$value);    
            }   
            $this->db->group_end();
        } 
 
        $result = $this->db->get();
    
        return $result->num_rows();
    } 

}
