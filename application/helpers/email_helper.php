<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
date_default_timezone_set("Asia/Jakarta");

if ( ! function_exists('email_helper'))
{
    function email_helper($user_id, $email, $pin)
    {
	    $CI = get_instance();

	    $CI->load->model('users_model');

        $data = $CI->users_model->findusers(array("users.id"=>$user_id)); 
        $data->pin = $pin; 

        $email_config = $CI->config->item('email_config');
        $email_sender = $CI->config->item('email_sender');
        $CI->load->library(array('email'));
        $CI->email->initialize($email_config);

        $message = $CI->load->view('email/email', $data, TRUE);

        $CI->email->clear(); 
        $CI->email->from($email_sender, "ADMIN");
        $CI->email->to($email);
        $CI->email->subject("HYPOS.ID - SEND EMAIL USER PIN");
        $CI->email->message($message);
        $data_return['status'] = true;
        $data_return['data'] = array();
        $data_return['message'] = "undefined messages";

        if ($CI->email->send())

        {
            $data_return['status'] = true;
            $data_return['data'] = array();
            $data_return['message'] = "Email Sent";
        }

        else

        {
            $data_return['status'] = false;
            $data_return['data'] = $CI->email->print_debugger();;
            $data_return['message'] = "Sent Email Failed";
        }


        return $data_return;
    } 
    
}

if ( ! function_exists('email_reset'))
{
    function email_reset($user_email, $change_data, $users = array())
    {
        $CI = get_instance();

        $CI->load->model('user_model');
        if($users){
            $data['users'] = $users;
        }else{
            $data['users'] = $CI->user_model->getOneBy(array("users.email"=>$user_email));
        }
        $email = $data['users']->email; 
        $data['change_data'] = $change_data;

        $email_config = $CI->config->item('email_config');
        $email_sender = $CI->config->item('email_sender');
        $CI->load->library(array('email'));
        // var_dump($email_config);
        // die();
        $CI->email->initialize($email_config);

        $message = $CI->load->view('email/email_reset', $data, TRUE);

        $CI->email->clear(); 
        $CI->email->from($email_sender, "ADMIN");
        $CI->email->to($email);
        $CI->email->subject("Shirobyte - SEND RESET EMAIL USER");
        $CI->email->message($message);
        $data_return['status'] = true;
        $data_return['data'] = array();
        $data_return['message'] = "undefined messages";

        if ($CI->email->send())

        {
            $data_return['status'] = true;
            $data_return['data'] = array();
            $data_return['message'] = "Account Reset Success, Check Your Email";
        }

        else
        {
            $data_return['status'] = false;
            $data_return['data'] = $CI->email->print_debugger();;
            $data_return['message'] = "Sent Email Failed";
        }


        return $data_return;
    } 
    
}

if ( ! function_exists('cek_email'))

{

    function cek_email($user_id = 4, $email = 'ariefperdiansyah@gmail.com', $pin = '123456')

    {

        $CI = get_instance();



        $CI->load->model('users_model');



        $data = $CI->users_model->findusers(array("users.id"=>$user_id)); 

        $data->pin = $pin; 



        $email_config = $CI->config->item('email_config');

        $email_sender = $CI->config->item('email_sender');

        $CI->load->library(array('email'));

        $CI->email->initialize($email_config);



        $message = $CI->load->view('email/email', $data, TRUE);



        $CI->email->clear(); 

        $CI->email->from($email_sender, "ADMIN");

        $CI->email->to($email);

        $CI->email->subject("HYPOS.ID - SEND EMAIL USER PIN");

        $CI->email->message($message);

        $data_return['status'] = true;
        $data_return['data'] = array();
        $data_return['message'] = "undefined messages";

        if ($CI->email->send())

        {
            $data_return['status'] = true;
            $data_return['data'] = array();
            $data_return['message'] = "Email Sent";
        }

        else

        {
            $data_return['status'] = false;
            $data_return['data'] = $CI->email->print_debugger();;
            $data_return['message'] = "Sent Email Failed";
        }


        return $data_return;
    } 

}

if ( ! function_exists('send_invoice'))

{
    function send_invoice($data = [], $email = 'ariefperdiansyah@gmail.com'){
        $CI = get_instance();

        $email_config = $CI->config->item('email_config_reminder');

        $email_sender = $CI->config->item('email_sender_reminder');

        $CI->load->library(array('email'));

        $CI->email->initialize($email_config);

        $date_indo = get_date_indo($data['invoice']->due_date);
        $tanggal_sent_at    = $date_indo['day_name']." ".$date_indo['day']." ".$date_indo['month_name']." ".$date_indo['year'];

        $message = "Pelanggan HYPOS yang terhormat,
        Terima kasih atas kepercayaaan menggunakan layanan HYPOS.<br>
        Kami informasikan bahwa tagihan periode ".$date_indo['month_name']." ".$date_indo['year']." layanan HYPOS Anda sebesar Rp. 180.000  jatuh tempo pada ".$tanggal_sent_at.", dengan Nomor invoice ".$data['invoice']->invoice_number."<br>
        Untuk kenyamanan Anda, mohon lakukan pembayaran sebelum waktu yang telah ditetapkan.<br>
        Informasi lebih lanjut silakan menghubungi customer care melalui telepon: 022 8732 1179 atau email: hello@hypos.id
        <br><br>
        Mohon abaikan email ini jika sudah melakukan pembayaran.
        Terima kasih.";
        // echo $message;
        // $message = $CI->load->view('email/email_invoice', $data, TRUE);



        $CI->email->clear(TRUE); 

        $CI->email->from($email_sender, "ADMIN");

        $CI->email->to($email);

        $CI->email->subject("HYPOS - Tagihan Akun Nomor ".$data['invoice']->contract_number);

        $CI->email->message($message);

        // // $attched_file= "pdf/ticket/".$data['filename'].".pdf";
        // // $attched_file= "assets/Usermanual.pdf";
        // // echo $attched_file;
        $attched_file= FCPATH."/file_invoice/".$data['outlet']->private_key.".pdf";
        $CI->email->attach($attched_file);

        // // die();

        $data_return['status'] = true;
        $data_return['data'] = array();
        $data_return['message'] = "undefined messages";

        if ($CI->email->send())

        {
            $data_return['status'] = true;
            $data_return['data'] = array();
            $data_return['message'] = "Email Sent";
        }

        else

        {
            $data_return['status'] = false;
            $data_return['data'] = $CI->email->print_debugger();;
            $data_return['message'] = "Sent Email Failed";
        }


        return $data_return;
    }
}

if ( ! function_exists('email_online_notification'))

{
    function email_online_notification($data, $email)
    {
        $CI = get_instance();


        $email_config = $CI->config->item('email_config');
        $email_sender = $CI->config->item('email_sender');
        $CI->load->library(array('email'));
        $CI->email->initialize($email_config);

        $message = $CI->load->view('email/online_notification', $data, TRUE);

        $CI->email->clear(); 
        $CI->email->from($email_sender, "ADMIN");
        $CI->email->to($email);
        $CI->email->subject("Hypos - Osengmercon");
        $CI->email->message($message);
        $data_return['status'] = true;
        $data_return['data'] = array();
        $data_return['message'] = "undefined messages";

        if ($CI->email->send())

        {
            $data_return['status'] = true;
            $data_return['data'] = array();
            $data_return['message'] = "Account Reset Success, Check Your Email";
        }

        else
        {
            $data_return['status'] = false;
            $data_return['data'] = $CI->email->print_debugger();;
            $data_return['message'] = "Sent Email Failed";
        }


        return $data_return;
    }
}
if ( ! function_exists('email_online_bill'))

{
    function email_online_bill($data, $email)
    {
        $CI = get_instance();


        $email_config = $CI->config->item('email_config');
        $email_sender = $CI->config->item('email_sender');
        $CI->load->library(array('email'));
        $CI->email->initialize($email_config);

        $message = $CI->load->view('email/bill', $data, TRUE);

        $CI->email->clear(); 
        $CI->email->from($email_sender, "ADMIN");
        $CI->email->to($email);
        $CI->email->subject("Hypos - Osengmercon Bill");
        $CI->email->message($message);
        $data_return['status'] = true;
        $data_return['data'] = array();
        $data_return['message'] = "undefined messages";

        if ($CI->email->send())

        {
            $data_return['status'] = true;
            $data_return['data'] = array();
            $data_return['message'] = "Account Reset Success, Check Your Email";
        }

        else
        {
            $data_return['status'] = false;
            $data_return['data'] = $CI->email->print_debugger();;
            $data_return['message'] = "Sent Email Failed";
        }


        return $data_return;
    }
}     

function get_date_indo($date = NULL){
    $hari = array ( 1 =>    'Senin',
                'Selasa',
                'Rabu',
                'Kamis',
                'Jumat',
                'Sabtu',
                'Minggu'
            );
            
    $bulan = array (1 =>   'Januari',
                'Februari',
                'Maret',
                'April',
                'Mei',
                'Juni',
                'Juli',
                'Agustus',
                'September',
                'Oktober',
                'November',
                'Desember'
            );

    if(!$date){
        $date = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
        $date2 = $date->format('d M Y H:i:s'); 
    }else{
        $date = new DateTime($date);
    }
    $day = $date->format('d'); 
    $month = $date->format('m'); 
    $year = $date->format('Y');
    $year = $date->format('Y');
    $num_day = $date->format('N'); 
    $new_date = array(
        "day" => $date->format('d'),
        "day_name" => $hari[$num_day],
        "month" => $date->format('m'),
        "month_name" => $bulan[$date->format('n')],
        "year" => $date->format('Y'),
        "time" => $date->format('H:i:s'),
    );
    return $new_date;
}




?>