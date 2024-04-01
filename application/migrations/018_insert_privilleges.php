<?php
/**
 * @author   Natan Felles <natanfelles@gmail.com>
 */
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Class Migration_create_table_api_limits
 *
 * @property CI_DB_forge         $dbforge
 * @property CI_DB_query_builder $db
 */
class Migration_insert_privilleges extends CI_Migration {


	public function up()
	{ 
		// insert function value
		 $data_function = array(
            array('role_id'=> 2, 'menu_id' => 11, 'function_id' => 1),
            array('role_id'=> 2, 'menu_id' => 11, 'function_id' => 2),
            array('role_id'=> 2, 'menu_id' => 11, 'function_id' => 3),
            array('role_id'=> 2, 'menu_id' => 11, 'function_id' => 4),
            array('role_id'=> 2, 'menu_id' => 11, 'function_id' => 5),
            array('role_id'=> 2, 'menu_id' => 1,  'function_id' => 1),
            array('role_id'=> 2, 'menu_id' => 10, 'function_id' => 1),
        );
        $this->db->insert_batch('privilleges', $data_function); 
	}


	public function down()
	{
		
	}

}