<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_Controller extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->data = array();
		$this->data['users'] = array();
		if (!$this->ion_auth->logged_in()) {
			redirect('auth/login', 'refresh');
		} else {
			$this->data['users'] = $this->ion_auth->user()->row();
			$this->data['users_groups'] = $this->ion_auth->get_users_groups($this->data['users']->id)->row();
		}

		$this->data['page'] = "";
		$this->data['parent_page_name'] = "";
		$this->data['page_id'] = "";
		$this->data['is_superadmin'] = false;
		$this->data['is_can_create'] = false;
		$this->data['is_can_read'] = false;
		$this->data['is_can_edit'] = false;
		$this->data['is_can_delete'] = false;
		$this->data['is_can_search'] = false;
		$this->data['is_can_approval'] = false;
		$this->data['is_can_download'] = false;
		$this->data['is_can_upload'] = false;
		$this->load->model("menu_model");

		if ($this->ion_auth->in_group(1)) {
			$this->data['is_superadmin'] = true;
		}
		if (!$this->input->is_ajax_request()) {
			$this->data['menu'] = $this->loadMenu();
		} else {
			$this->data['page_id'] = $this->session->userdata('page_id');
		}

		if ($this->data['is_superadmin']) {

			$this->data['is_can_create'] = true;
			$this->data['is_can_read'] = true;
			$this->data['is_can_edit'] = true;
			$this->data['is_can_delete'] = true;
			$this->data['is_can_search'] = true;
			$this->data['is_can_approval'] = true;
			$this->data['is_can_download'] = true;
			$this->data['is_can_upload'] = true;
		} else {
			$this->load->model("privilleges_model");
			$dataPrivilleges = $this->privilleges_model->getOneBy(array(
				"menu_id" => $this->data['page_id'],
				"role_id" => $this->data['users_groups']->id,
			));

			$this->data['is_can_create'] = ($this->isInPrivilleges($dataPrivilleges, 1));
			$this->data['is_can_read'] = ($this->isInPrivilleges($dataPrivilleges, 2));
			$this->data['is_can_edit'] = ($this->isInPrivilleges($dataPrivilleges, 3));
			$this->data['is_can_delete'] = ($this->isInPrivilleges($dataPrivilleges, 4));
			$this->data['is_can_search'] = ($this->isInPrivilleges($dataPrivilleges, 5));
			$this->data['is_can_approval'] = ($this->isInPrivilleges($dataPrivilleges, 6));
			$this->data['is_can_download'] = ($this->isInPrivilleges($dataPrivilleges, 7));
			$this->data['is_can_upload'] = ($this->isInPrivilleges($dataPrivilleges, 8));
		}
	}
	private function isInPrivilleges($data, $id) {
		if (!empty($data)) {
			for ($i = 0; $i < count($data); $i++) {
				if (isset($data[$i]) && $data[$i]->function_id == $id) {
					return true;
				}
			}
		}

		return false;
	}
	private function createTree($parent, $menu, $parent_id, $path_active_name) {

		$html = "";
		if (isset($menu['parents'][$parent])) {
			if ($parent == 1) {
				$html .= '<ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false"> ';
			} else {
				$style = ($parent == $parent_id) ? "style='display:block;'" : "style='display:none;'";
				$html .= '<ul class="nav nav-treeview ' . $style . '">';
			}
			foreach ($menu['parents'][$parent] as $itemId) {
				$id = $menu['items'][$itemId]['id'];
				$url = $menu['items'][$itemId]['url'];
				$urlText = $menu['items'][$itemId]['url-text'];
				$icon = $menu['items'][$itemId]['icon'];
				$name = $menu['items'][$itemId]['name'];
				if (!isset($menu['parents'][$itemId])) {
					$class = ($path_active_name == strtolower($urlText)) ? "nav-link active" : "nav-link";
					$html .= '<li class="nav-item">
     					<a href="' . $url . '" class="' . $class . '"">
     						<i class="fas ' . $icon . ' nav-icon"></i>
     						<p>' . $name . '</p>
     					</a>
     				</li>';
				} else {
					$class = ($id == $parent_id) ? "active" : '';
					$menuOpen = ($id == $parent_id) ? "menu-open" : '';
					$html .= '<li class="nav-item ' . $menuOpen . '">
								<a href="#" class="nav-link ' . $class . '">
				            		<i class="fas ' . $icon . ' nav-icon"></i>
				            		<p>' . $name . '</p>
				            		<i class="right fas fa-angle-left"></i>
								</a>';
					$html .= $this->createTree($itemId, $menu, $parent_id, $path_active_name);
					$html .= "</li>";
				}
			}
			$html .= "</ul>";
		}
		return $html;
	}
	private function loadMenu() {
		if ($this->data['is_superadmin']) {
			$menus = $this->menu_model->getMenuSuperadmin();
		} else {
			$menus = $this->menu_model->getMenuPrivilleges(array("role_id" => $this->data['users_groups']->id));
		}
		if (empty($menus)) {
			return "";
		}

		$new_menus = array();

		foreach ($menus as $key => $value) {
			$new_menus[$value->id] = array();
			$new_menus[$value->id]['id'] = $value->id;
			$new_menus[$value->id]['name'] = $value->name;
			$new_menus[$value->id]['url'] = base_url() . $value->url;
			$new_menus[$value->id]['url-text'] = $value->url;
			$new_menus[$value->id]['parent_id'] = $value->parent_id;
			$new_menus[$value->id]['icon'] = $value->icon;
		}

		$tree_menu = array(
			'items' => array(),
			'parents' => array(),
		);
		foreach ($new_menus as $a) {
			$tree_menu['items'][$a['id']] = $a;
			// Creates list of all items with children
			$tree_menu['parents'][$a['parent_id']][] = $a['id'];
		}
		$path_active_name = $this->uri->segment(1);
		if (!empty($this->uri->segment(2))) {
			$data_uri_2 = [
				"create",
				"edit",
				"detail",
				"destroy",
				"importExcel",
				"exportJson",
				"reset_password",
				"hm_monthly",
				"hm_location",
				"hm_operator",
				"hm_unit_duration",
				"fe_monthly",
				"fe_location",
				"input_data",
				"edit_data",
				"activity",
				"approval",
				"privileges",
				"import",
			];
			if (!in_array($this->uri->segment(2), $data_uri_2) && $this->uri->segment(2) != "") {
				$path_active_name = $this->uri->segment(1) . "/" . $this->uri->segment(2);
			}
		}

		$data_parent = $this->menu_model->getParentIdBy(array("URL" => $path_active_name));
		$data_menu = $this->menu_model->getDetailMenuBy(array("URL" => $path_active_name));

		$parent_id = (!empty($data_parent)) ? $data_parent->parent_id : 0;
		if ($data_parent) {
			$parent = $this->menu_model->getParentIdBy(array("id" => $data_parent->parent_id));
		}

		$this->data['parent_page_name'] = (!empty($parent)) ? $parent->name : "";
		$this->data['page'] = (!empty($data_menu)) ? $data_menu->name : "";
		$this->data['page_id'] = (!empty($data_menu)) ? $data_menu->id : "";
		$this->session->set_userdata(array("page_id" => $this->data['page_id']));
		return $this->createTree(1, $tree_menu, $parent_id, $path_active_name);
	}

}
