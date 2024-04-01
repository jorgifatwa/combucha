<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH.'core/Admin_Controller.php';
class User extends Admin_Controller {
 	public function __construct()
	{
		parent::__construct();
		$this->load->model('user_model');
		$this->load->model('ion_auth_model');
	}
	public function index()
	{
		$this->load->helper('url');
		if($this->data['is_can_read']){ 
			$this->data['content'] = 'admin/user/list_v'; 	
		}else{
			$this->data['content'] = 'errors/html/restrict'; 
		}
		
		$this->load->view('admin/layouts/page',$this->data);  
	}


	public function create()
	{ 
		$this->form_validation->set_rules('email',"Email", 'trim|required');  
		$this->form_validation->set_rules('name',"Nama", 'trim|required'); 
		$this->form_validation->set_rules('password',"Password", 'trim|required');
		$this->form_validation->set_rules('role_id',"Role", 'trim|required');
		$this->form_validation->set_rules('nama_bank',"Nama Bank", 'trim|required');
		$this->form_validation->set_rules('no_rekening',"No. Rekening", 'trim|required');
		if ($this->form_validation->run() === TRUE)
		{
			$data = array(
				'first_name' => $this->input->post('name'),
				'address' => $this->input->post('address'),
				'active' => 1,
				'email' => $this->input->post('email'),
				'phone' => $this->input->post('phone'),
				'nama_bank' => $this->input->post('nama_bank'),
				'no_rekening' => $this->input->post('no_rekening'),
				'is_deleted' => 0
			); 
			$role = array($this->input->post('role_id'));  
 			$username = '';
 			$password = $this->input->post('password');
 			$email = $this->input->post('email');

			$insert = $this->ion_auth->register($username, $password, $email, $data,$role);

			if ($insert)
			{ 
				$this->session->set_flashdata('message', "Pengurus Baru Berhasil Disimpan");
				redirect("user");
			}
			else
			{
				$this->session->set_flashdata('message_error',$this->ion_auth->errors());
				redirect("user");
			}
		}else{   
			$this->load->model("roles_model");
			$this->data['content'] = 'admin/user/create_v'; 
			$this->data['roles'] = $this->roles_model->getAllById();
			$this->load->view('admin/layouts/page',$this->data); 
		}
	} 

	public function reset_password()
	{ 
		$this->form_validation->set_rules('new_password',"Password Baru Harus Di isi", 'trim|required');
		if ($this->form_validation->run() === TRUE)
		{
		
			$identity = $this->input->post('email');

			$change = $this->ion_auth->reset_password($identity, $this->input->post('new_password'));

			if ($change)
			{ 
				$this->session->set_flashdata('message', "Password Berhasil di Ubah");
				redirect("user");
			}
			else
			{
				$this->session->set_flashdata('message_error',$this->ion_auth->errors());
				redirect("user");
			}
		}else{   
			$this->data['content'] = 'admin/user/reset_v'; 
			$id = $this->uri->segment(3);
			$data = $this->user_model->getOneBy(array("users.id"=>$id)); 
			$this->data['email'] =   (!empty($data))?$data->email:"";
			$this->load->view('admin/layouts/page',$this->data); 
		}
	} 

	public function edit($id)
	{ 
		$this->form_validation->set_rules('email',"Email", 'trim|required');  
		$this->form_validation->set_rules('name',"Nama", 'trim|required'); 
		$this->form_validation->set_rules('role_id',"Role", 'trim|required');
		$this->form_validation->set_rules('nama_bank',"Nama Bank", 'trim|required');
		$this->form_validation->set_rules('no_rekening',"No. Rekening", 'trim|required');
		if ($this->form_validation->run() === TRUE)
		{
			$data = array(
				'first_name' => $this->input->post('name'),
				'address' => $this->input->post('address'),
				'active' => 1,
				'email' => $this->input->post('email'),
				'phone' => $this->input->post('phone'),
				'nama_bank' => $this->input->post('nama_bank'),
				'no_rekening' => $this->input->post('no_rekening'),
				'is_deleted' => 0
			); 
			$user_id = $this->input->post('id'); 
			$update = $this->ion_auth->update($user_id, $data);

			$data_roles = array(
				'role_id' => $this->input->post('role_id')
			);

			$where = array(
				'user_id' => $user_id
			);

			$this->user_model->update_roles($data_roles, $where);

			if ($update)
			{ 
				$this->session->set_flashdata('message', "User Berhasil Diubah");
				redirect("user","refresh");
			}else{
				$this->session->set_flashdata('message_error', "User Gagal Diubah");
				redirect("user","refresh");
			}
		} 
		else
		{
			if(!empty($_POST)){ 
				$id = $this->input->post('id'); 
				$this->session->set_flashdata('message_error',validation_errors());
				return redirect("user/edit/".$id);	
			}else{
				$this->data['id']= $id;
				$data = $this->user_model->getOneBy(array("users.id"=>$this->data['id'])); 
				$this->load->model("roles_model");
				$this->data['roles'] = $this->roles_model->getAllById();
				$this->data['first_name'] =   (!empty($data))?$data->first_name:"";
				$this->data['last_name'] =   (!empty($data))?$data->last_name:"";
				$this->data['address'] =   (!empty($data))?$data->address:"";
				$this->data['email'] =   (!empty($data))?$data->email:""; 
				$this->data['phone'] =   (!empty($data))?$data->phone:"";  
				$this->data['role_id'] =   (!empty($data))?$data->role_id:""; 
				$this->data['nama_bank'] =   (!empty($data))?$data->nama_bank:""; 
				$this->data['no_rekening'] =   (!empty($data))?$data->no_rekening:""; 
				$this->data['content'] = 'admin/user/edit_v'; 
				$this->load->view('admin/layouts/page',$this->data); 
			}  
		}    
		
	} 

	public function dataList()
	{
		$columns = array( 
            0 =>'id',  
      		1 =>'role_name', 
            2 =>'users.first_name',
            3 =>'users.phone',
            4 => 'users.email',  
            5 => 'users.nama_bank',  
            6 => 'users.no_rekening',  
            7 => 'action'
        ); 
        $order = $columns[$this->input->post('order')[0]['column']];
        $dir = $this->input->post('order')[0]['dir'];
  		$search = array();
  		$where= array("roles.id >"=>"1");
  		$limit = 0;
  		$start = 0;
        $totalData = $this->user_model->getCountAllBy($limit,$start,$search,$order,$dir,$where); 

        if(!empty($this->input->post('search')['value'])){
        	$search_value = $this->input->post('search')['value'];
           	$search = array(
           		"roles.name"=>$search_value,
           		"users.first_name"=>$search_value,
           		"users.phone"=>$search_value,
           		"users.email"=>$search_value,
           		"users.nama_bank"=>$search_value,
           		"users.no_rekening"=>$search_value,
           	); 
           	$totalFiltered = $this->user_model->getCountAllBy($limit,$start,$search,$order,$dir); 
        }else{
        	$totalFiltered = $totalData;
        } 
       
        $limit = $this->input->post('length');
        $start = $this->input->post('start');
		$datas = $this->user_model->getAllBy($limit,$start,$search,$order,$dir,$where);
     	
        $new_data = array();
        if(!empty($datas))
        { 
            foreach ($datas as $key=>$data)
            {  

            	$edit_url = "";
     			$delete_url = "";
     			$reset_url = "";
     		
            	if($this->data['is_can_edit'] && $data->is_deleted == 0){
            		$edit_url = "<a href='".base_url()."user/edit/".$data->id."' class='btn btn-info btn-sm white'><i class='fa fa-pencil'></i> Ubah</a>";
            		$reset_url = "<a href='".base_url()."user/reset_password/".$data->id."' class='btn btn-warning btn-sm white text-white'>Reset Password</a>";
            	}  
            	if($this->data['is_can_delete']){
	            	if($data->is_deleted == 0){
	        			$delete_url = "<a href='#' url='".base_url()."user/destroy/".$data->id."/".$data->is_deleted."'
	        				class='btn btn-sm btn-danger white delete' >Non Aktifkan
	        				</a>";
	        		}else{
	        			$delete_url = "<a href='#' url='".base_url()."user/destroy/".$data->id."/".$data->is_deleted."'
	        				class='btn btn-danger btn-sm white delete' 
	        				 >Aktifkan
	        				</a>";
	        		}
        		}
            	

                $nestedData['id'] = $start+$key+1;
                $nestedData['role_name'] = $data->role_name;  
                $nestedData['name'] = $data->first_name . ' ' . $data->last_name;
                $nestedData['phone'] = $data->phone; 
                $nestedData['nama_bank'] = $data->nama_bank; 
                $nestedData['no_rekening'] = $data->no_rekening; 
                $nestedData['email'] = $data->email;
                if(empty($data->photo)){
                	$nestedData['photo'] = ''; 	
                }else{
                	$photo = explode(".", $data->photo);
                	$nestedData['photo'] = "<img width='40px' src=".base_url()."assets/images/profile/".$data->photo.">"; 
                }
           		$nestedData['action'] = $reset_url." ".$edit_url." ".$delete_url;   
                $new_data[] = $nestedData; 
            }
        }
          
        $json_data = array(
                    "draw"            => intval($this->input->post('draw')),  
                    "recordsTotal"    => intval($totalData),  
                    "recordsFiltered" => intval($totalFiltered), 
                    "data"            => $new_data   
                    );
            
        echo json_encode($json_data); 
	}

	public function destroy(){
		$response_data = array();
        $response_data['status'] = false;
        $response_data['msg'] = "";
        $response_data['data'] = array();   

		$id =$this->uri->segment(3);
		$is_deleted = $this->uri->segment(4);
 		if(!empty($id)){
 			$this->load->model("user_model");
			$data = array(
				'is_deleted' => ($is_deleted == 1)?0:1
			); 
			$update = $this->user_model->update($data,array("id"=>$id));

        	$response_data['data'] = $data; 
         	$response_data['status'] = true;
 		}else{
 		 	$response_data['msg'] = "ID Harus Diisi";
 		}
		
        echo json_encode($response_data); 
		redirect('user');
	}
}
