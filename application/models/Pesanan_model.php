<?php 
defined('BASEPATH') OR exit('No direct script access allowed'); 
class Pesanan_model extends CI_Model
{
     

    public function __construct()
    {
        parent::__construct(); 
    }  
    public function getOneBy($where = array()){
        $this->db->select("pesanan.*")->from("pesanan"); 
        $this->db->where($where);  
        $this->db->where("pesanan.is_deleted",0);  

        $query = $this->db->get();
        if ($query->num_rows() >0){  
            return $query->row(); 
        } 
        return FALSE;
    }
 
    public function getAllById($where = array()){
        $this->db->select("pesanan.*, produk.harga_jual as harga_jual, produk.nama as nama_produk")->from("pesanan"); 
        $this->db->join("produk", "pesanan.id_produk = produk.id");
        $this->db->join("transaksi", "pesanan.id_transaksi = transaksi.id"); 
        $this->db->where($where);  
        $this->db->where("pesanan.is_deleted",0);  

        $query = $this->db->get();
        if ($query->num_rows() >0){  
            return $query->result(); 
        } 
        return FALSE;
    }
    public function insert($data){
        $this->db->insert("pesanan", $data);
        return $this->db->insert_id();
    }

    public function update($data,$where){
        $this->db->update("pesanan", $data, $where);
        return $this->db->affected_rows();
    }

    public function delete($where){
        $this->db->where($where);
        $this->db->delete("pesanan"); 
        if($this->db->affected_rows()){
            return TRUE;
        }
        return FALSE;
    }

    function getAllBy($limit,$start,$search,$col,$dir)
    {
        $this->db->select("pesanan.*")->from("pesanan");   
        $this->db->where("pesanan.is_deleted",0);  
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
        $this->db->select("pesanan.*")->from("pesanan");
        $this->db->where("pesanan.is_deleted",0);  
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

    function getPendapatan(){
        $this->db->select("SUM(pesanan.jumlah * produk.harga_jual) AS total");
        $this->db->from("pesanan");
        $this->db->join("produk", "pesanan.id_produk = produk.id");
        $this->db->join("transaksi", "pesanan.id_transaksi = transaksi.id");
        $this->db->where("pesanan.is_deleted", 0);  
        $this->db->where("transaksi.status", 0);  
        $this->db->where("DATE(transaksi.created_at)", date("Y-m-d"));  

        // if(!empty($search)){
        //     $this->db->group_start();
        //     foreach($search as $key => $value){
        //         $this->db->or_like($key,$value);    
        //     }   
        //     $this->db->group_end();
        // } 

        // $this->db->group_by("pesanan.id_transaksi");

        $result = $this->db->get();

        return $result->result();  
    }

    function getPendapatanBersih(){
        $this->db->select("SUM(pesanan.jumlah * produk.harga_modal) AS total");
        $this->db->from("pesanan");
        $this->db->join("produk", "pesanan.id_produk = produk.id");
        $this->db->join("transaksi", "pesanan.id_transaksi = transaksi.id");
        $this->db->where("pesanan.is_deleted", 0);  
        $this->db->where("transaksi.status", 0);  
        $this->db->where("DATE(transaksi.created_at)", date("Y-m-d"));  

        // if(!empty($search)){
        //     $this->db->group_start();
        //     foreach($search as $key => $value){
        //         $this->db->or_like($key,$value);    
        //     }   
        //     $this->db->group_end();
        // } 

        // $this->db->group_by("pesanan.id_transaksi");

        $result = $this->db->get();

        return $result->result();  
    }
}
