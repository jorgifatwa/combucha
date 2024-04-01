<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . 'core/Admin_Controller.php';
use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

class Dashboard extends Admin_Controller {
	public function __construct() {
		parent::__construct();
	}
	public function index() {
		$this->load->helper('url');
		if ($this->data['is_can_read']) {
			$this->data['content'] = 'admin/dashboard';
		} else {
			$this->data['content'] = 'errors/html/restrict';
		}

		$this->load->view('admin/layouts/page', $this->data);
	}

}
