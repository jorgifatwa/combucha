<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		 
	}
	public function index()
	{
		$this->load->view('user/home'); 
    } 
    
	public function detail()
	{
		$this->data['content'] = 'user/detail';   

		$this->load->view('user/layouts/page',$this->data); 
    } 
	public function target()
	{
		$this->data['content'] = 'user/target';   

		$this->load->view('user/layouts/page',$this->data); 
    } 
    
    
}
