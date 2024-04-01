<?php

defined('BASEPATH') OR exit('No direct script access allowed');




$config['email_config'] = array(

        'protocol' => 'smtp',

        'smtp_host' => 'ssl://mail.shirobyte.com',

        'smtp_port' => '465',

        'smtp_user' => 'no-reply@shirobyte.com',

        'smtp_pass' => 'p0h0d3u1??',

        'mailtype' => 'html',

        'mail_charset' => 'iso-8859-1',

        'newline' => "\r\n",

        'mail_timeout' => '4',

        'wordwrap'=>TRUE

);

$config['email_sender'] = 'noreply@shirobyte.com';

$config['email_config_reminder'] = array(

        'protocol' => 'smtp',

        'smtp_host' => 'ssl://mail.shirobyte.com',

        'smtp_port' => '465',

        'smtp_user' => 'reminder@shirobyte.com',

        'smtp_pass' => 'Sh1r012222903!@#',

        'mailtype' => 'html',

        'mail_charset' => 'iso-8859-1',

        'newline' => "\r\n",

        'mail_timeout' => '4',

        'wordwrap'=>TRUE

);

$config['email_sender_reminder'] = 'reminder@shirobyte.com';