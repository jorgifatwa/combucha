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
class Migration_create_table_kategori_produk extends CI_Migration {


	public function up()
	{ 
		$table = "kategori_produk";
		$fields = array(
			'id'           => [
				'type'           => 'INT(11)',
				'auto_increment' => TRUE,
				'unsigned'       => TRUE,
			],
			'nama'          => [
				'type' => 'VARCHAR(100)',
			],
			'description'      => [
				'type' => 'TEXT',
			],
			'created_at'      => [
				'type' => 'DATETIME',
			],
			'updated_at'      => [
				'type' => 'DATETIME',
			],
			'created_by'      => [
				'type' => 'TINYINT(4)',
			],
			'updated_by'      => [
				'type' => 'TINYINT(4)',
			],
			'is_deleted' => [
				'type' => 'TINYINT(4)',
			],
		);
		$this->dbforge->add_field($fields);
		$this->dbforge->add_key('id', TRUE);
		$this->dbforge->create_table($table);
	 
	}


	public function down()
	{
		$table = "kategori_produk";
		if ($this->db->table_exists($table))
		{
			$this->db->query(drop_foreign_key($table, 'api_key'));
			$this->dbforge->drop_table($table);
		}
	}

}
