<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'libraries/REST_Controller.php';
class Api_Controller extends REST_Controller {
    protected $useAPIKEY = TRUE;

 	public function __construct()
	{
		parent::__construct();
        if ($this->useAPIKEY === TRUE)
        {
            if (!$this->_detect_api_key())
            {
                return $this->response(['status' => FALSE, 'message' => 'API key tidak sesuai'], parent::HTTP_OK);
            }else{
                $this->load->model("user_model");
                $data_users = $this->user_model->getOneBy(array("users.id"=>$this->_apiuser->user_id));
                if(!empty($data_users)){
                    $this->_apiuser= $data_users;  
                }else{
                    $this->_apiuser->id = $this->_apiuser->user_id;
                }
            }
        }
	}

}
