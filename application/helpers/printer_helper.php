<?php
 
defined('BASEPATH') OR exit('No direct script access allowed');

require __DIR__ . '/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\CapabilityProfile;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\PrintConnectors\CupsPrintConnector;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector; 
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector; 
use Mike42\Escpos\EscposImage;


function printerConnection($connection,$alias_name){
    $profile = CapabilityProfile::load("simple");
    // $alias_name = "Guest@".$alias_name;
    if($connection == "LAN"){
        $connector = new NetworkPrintConnector($alias_name);
    }
    else if($connection == "SHARED" || $connection =="USB"){
        $connector = new WindowsPrintConnector("smb://".$alias_name);
    }
    else{
        $connector = new CupsPrintConnector($alias_name); 
    }

    $printer = new Printer($connector,$profile);
    return $printer;
}

function demoprinter($info_printer){
    // $connector = new WindowsPrintConnector("smb://RIP/zj-58");
    // $printer = new Printer($connector);
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    /* Initialize */
    $printer -> initialize();
    /* Text */
    // $printer -> text("Hello world\n");
    // $printer -> cut();
    // /* Line feeds */
    // $printer -> text("ABC");
    // $printer -> feed(7);
    // $printer -> text("DEF");
    // $printer -> feedReverse(3);
    // $printer -> text("GHI");
    // $printer -> feed();
    // $printer -> cut();
    // $printer ->close();
    /* Font modes */
    $modes = array(
        Printer::MODE_FONT_B,
        Printer::MODE_EMPHASIZED,
        Printer::MODE_DOUBLE_HEIGHT,
        Printer::MODE_DOUBLE_WIDTH,
        Printer::MODE_UNDERLINE);
    for ($i = 0; $i < pow(2, count($modes)); $i++) {
        $bits = str_pad(decbin($i), count($modes), "0", STR_PAD_LEFT);
        $mode = 0;
        for ($j = 0; $j < strlen($bits); $j++) {
            if (substr($bits, $j, 1) == "1") {
                $mode |= $modes[$j];
            }
        }
        $printer -> selectPrintMode($mode);
        $printer -> text("AB\n");
        $printer -> text($mode."\n");
    }
    $printer -> selectPrintMode(); // Reset
    $printer -> close();
    die();
    $printer -> cut();
    /* Underline */
    for ($i = 0; $i < 3; $i++) {
        $printer -> setUnderline($i);
        $printer -> text("The quick brown fox jumps over the lazy dog\n");
    }
    $printer -> setUnderline(0); // Reset
    $printer -> cut();
    /* Cuts */
    $printer -> text("Partial cut\n(not available on all printers)\n");
    $printer -> cut(Printer::CUT_PARTIAL);
    $printer -> text("Full cut\n");
    $printer -> cut(Printer::CUT_FULL);
    /* Emphasis */
    for ($i = 0; $i < 2; $i++) {
        $printer -> setEmphasis($i == 1);
        $printer -> text("The quick brown fox jumps over the lazy dog\n");
    }
    $printer -> setEmphasis(false); // Reset
    $printer -> cut();
    /* Double-strike (looks basically the same as emphasis) */
    for ($i = 0; $i < 2; $i++) {
        $printer -> setDoubleStrike($i == 1);
        $printer -> text("The quick brown fox jumps over the lazy dog\n");
    }
    $printer -> setDoubleStrike(false);
    $printer -> cut();
    /* Fonts (many printers do not have a 'Font C') */
    $fonts = array(
        Printer::FONT_A,
        Printer::FONT_B,
        Printer::FONT_C);
    for ($i = 0; $i < count($fonts); $i++) {
        $printer -> setFont($fonts[$i]);
        $printer -> text("The quick brown fox jumps over the lazy dog\n");
    }
    $printer -> setFont(); // Reset
    $printer -> cut();
    /* Justification */
    $justification = array(
        Printer::JUSTIFY_LEFT,
        Printer::JUSTIFY_CENTER,
        Printer::JUSTIFY_RIGHT);
    for ($i = 0; $i < count($justification); $i++) {
        $printer -> setJustification($justification[$i]);
        $printer -> text("A man a plan a canal panama\n");
    }
    $printer -> setJustification(); // Reset
    $printer -> cut();
    /* Barcodes - see barcode.php for more detail */
    $printer -> setBarcodeHeight(80);
    $printer->setBarcodeTextPosition(Printer::BARCODE_TEXT_BELOW);
    $printer -> barcode("9876");
    $printer -> feed();
    $printer -> cut();
    /* Graphics - this demo will not work on some non-Epson printers */
    try {
        $logo = EscposImage::load("resources/escpos-php.png", false);
        $imgModes = array(
            Printer::IMG_DEFAULT,
            Printer::IMG_DOUBLE_WIDTH,
            Printer::IMG_DOUBLE_HEIGHT,
            Printer::IMG_DOUBLE_WIDTH | Printer::IMG_DOUBLE_HEIGHT
        );
        foreach ($imgModes as $mode) {
            $printer -> graphics($logo, $mode);
        }
    } catch (Exception $e) {
        /* Images not supported on your PHP, or image file not found */
        $printer -> text($e -> getMessage() . "\n");
    }
    $printer -> cut();
    /* Bit image */
    try {
        $logo = EscposImage::load("resources/escpos-php.png", false);
        $imgModes = array(
            Printer::IMG_DEFAULT,
            Printer::IMG_DOUBLE_WIDTH,
            Printer::IMG_DOUBLE_HEIGHT,
            Printer::IMG_DOUBLE_WIDTH | Printer::IMG_DOUBLE_HEIGHT
        );
        foreach ($imgModes as $mode) {
            $printer -> bitImage($logo, $mode);
        }
    } catch (Exception $e) {
        /* Images not supported on your PHP, or image file not found */
        $printer -> text($e -> getMessage() . "\n");
    }
    $printer -> cut();
    /* QR Code - see also the more in-depth demo at qr-code.php */
    $testStr = "Testing 123";
    $models = array(
        Printer::QR_MODEL_1 => "QR Model 1",
        Printer::QR_MODEL_2 => "QR Model 2 (default)",
        Printer::QR_MICRO => "Micro QR code\n(not supported on all printers)");
    foreach ($models as $model => $name) {
        $printer -> qrCode($testStr, Printer::QR_ECLEVEL_L, 3, $model);
        $printer -> text("$name\n");
        $printer -> feed();
    }
    $printer -> cut();
    /* Pulse */
    $printer -> pulse();
    /* Always close the printer! On some PrintConnectors, no actual
     * data is sent until the printer is closed. */
    $printer -> close();
}

function callback_printer_info($info_printer){
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    try {
         $printer ->initialize();
    $printer -> close();     
    } catch (Exception $e) {
       echo "string";
    }
}

function tesprinter($info_printer){
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize();
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> setEmphasis(false);
    $printer -> text("PRINT OK\n");
    try {
        $printer -> selectPrintMode(49);
    } catch (Exception $e) {
        $printer -> setEmphasis(true);
    }
    $printer -> text("PRINT OK\n");
    $printer -> selectPrintMode();
    for($j=0;$j<10;$j++){
        for($i=0;$i<10;$i++){
            $printer -> text($i);
        }
    }

    $printer -> feed(3);
    $printer -> cut();
    $printer -> close();     
}

// function get_date_indo($date = NULL){
//     $hari = array ( 1 =>    'Senin',
//                 'Selasa',
//                 'Rabu',
//                 'Kamis',
//                 'Jumat',
//                 'Sabtu',
//                 'Minggu'
//             );
            
//     $bulan = array (1 =>   'Januari',
//                 'Februari',
//                 'Maret',
//                 'April',
//                 'Mei',
//                 'Juni',
//                 'Juli',
//                 'Agustus',
//                 'September',
//                 'Oktober',
//                 'November',
//                 'Desember'
//             );

//     if(!$date){
//         $date = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
//         $date2 = $date->format('d M Y H:i:s'); 
//     }else{
//         $date = new DateTime($date);
//     }
//     $day = $date->format('d'); 
//     $month = $date->format('m'); 
//     $year = $date->format('Y');
//     $year = $date->format('Y');
//     $num_day = $date->format('N'); 
//     $new_date = array(
//         "day" => $date->format('d'),
//         "day_name" => $hari[$num_day],
//         "month" => $date->format('m'),
//         "month_name" => $bulan[$date->format('n')],
//         "year" => $date->format('Y'),
//         "time" => $date->format('H:i:s'),
//     );
//     return $new_date;
// }

function send_printer_order($info_data,$order_menu, $info_printer, $type = NULL){
    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y');    
    $time = $now->format('H:i:s'); 
    $new_date = get_date_indo(); 
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    if($info_data['sequence'] != 1){
        $printer -> setTextSize(2,2);
        $printer -> text("TAMBAHAN\n");
    }else{
        $printer -> setTextSize(2, 2);
        $printer -> text("DAFTAR PESANAN\n");
    }
    $printer -> setTextSize(1, 1);
    if($type == "ready"){
        $printer -> text("(Ready)\n");
    }else if($type == "order"){
        $printer -> text("(Order)\n");
    }
    $printer -> text("-------------------------------\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    $printer -> setTextSize(2, 2);
    if($info_data['order_type']=="dinein" ||$info_data['order_type']=="Dine In"){
        $printer -> text("No Meja : ".$info_data['order_name']."\n"); 
    }else{
        $printer -> text("A/N : ".$info_data['order_name']."\n"); 
    } 
    $printer -> feed();
    //$printer -> text("Jam Order : ".$now."\n"); 
    $printer -> setTextSize(1, 1);
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    $printer -> text("Waiters   :".substr($info_data['user_login_name'],0,16)."\n");
    $printer -> text("Tgl  : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
    $printer -> text("Jam  : ".$new_date['time']."\n");
    $printer ->feed();
    for ($i=0; $i<count($order_menu); $i++) {
        $printer -> setJustification($printer::JUSTIFY_CENTER); 
        $printer -> setTextSize(1, 2);
        $printer -> text($order_menu[$i]['qty']." ".$order_menu[$i]['name']);
        $printer -> feed();
        if(isset($order_menu[$i]['option'])){
            if($order_menu[$i]['option']){
                if(count($order_menu[$i]['option']) >0){
                    for ($om=0; $om <count($order_menu[$i]['option']) ; $om++) { 
                        $printer -> setTextSize(1, 1);
                        if($order_menu[$i]['option'][$om]['option_menu_name'] != '' && $order_menu[$i]['option'][$om]['option_menu_list_name'] !=''){
                            $printer -> text("(".$order_menu[$i]['option'][$om]['option_menu_name']." : ".$order_menu[$i]['option'][$om]['option_menu_list_name'].")\n" );
                        }
                    }
                }
            }
        }
        $printer -> feed();
        $printer -> setTextSize(1, 1);
        if(isset($order_menu[$i]['data_sidedish'])){
            if($order_menu[$i]['data_sidedish']){
                 $printer -> text("Sidedish\n");
                foreach ($order_menu[$i]['data_sidedish'] as $key => $sidedish) {
                    $printer -> text("-".$sidedish['quantity']." ".$sidedish['sidedish_name']."\n" );
                }
            }
        }
        $printer -> setTextSize(1, 1);
        $printer -> setJustification($printer::JUSTIFY_LEFT); 
        if($info_data['order_type'] == "Dinein" || $info_data['order_type'] == "dinein"){
            if(isset($order_menu[$i]['is_takeaway'])){
                if($order_menu[$i]['is_takeaway'] == "true"){
                    $printer -> text("Type :Dinein-Takeaway");
                }else{
                    $printer -> text("Type :Dinein");
                }
            }else{
                $printer -> text("Type :-");    
            }
        }else{
            $printer -> text("Type : ".$info_data['order_type']);
        }
        $printer -> feed();
        try {
            $printer -> selectPrintMode(49);
        } catch (Exception $e) {
            $printer -> setEmphasis(true);
        }
        $printer -> text("Note : ".$order_menu[$i]['note']);
        $printer -> setEmphasis(false);
        $printer -> selectPrintMode();
        $printer -> feed(2);
    }
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> cut();
    $printer -> close();

}

function send_printer_order2($info_data,$order_menu, $info_printer){
    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y');    
    $time = $now->format('H:i:s'); 
    $new_date = get_date_indo();
    if($info_data['order_type']=="dinein" ||$info_data['order_type']=="Dine In"){
        echo "No Meja : ".$info_data['order_name']."\n"; 
    }else{
        echo "A/N : ".$info_data['order_name']."\n"; 
    }

    for ($i=0; $i<count($order_menu); $i++) {
        echo $order_menu[$i]['qty']." ".$order_menu[$i]['name'];
    }
 
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> text("DAFTAR PESANAN\n");
    $printer -> text("-------------------------------\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    $printer -> setTextSize(2, 2);
    if($info_data['order_type']=="dinein" ||$info_data['order_type']=="Dine In"){
        $printer -> text("No Meja : ".$info_data['order_name']."\n"); 
    }else{
        $printer -> text("A/N : ".$info_data['order_name']."\n"); 
    } 
    $printer -> feed();
    //$printer -> text("Jam Order : ".$now."\n"); 
    for ($i=0; $i<count($order_menu); $i++) {
        $printer -> setTextSize(2, 2);
        $printer -> text($order_menu[$i]['qty']." ".$order_menu[$i]['name']);
        $printer -> feed();
        $printer -> setTextSize(1, 1);
        if($info_data['order_type'] == "Dinein"){
            if($order_menu[$i]['is_takeaway'] == "true"){
                $printer -> text("Type :Takeaway");
            }else{
                $printer -> text("Type :Dinein");
            }
        }else{
            $printer -> text("Type : ".$info_data['order_type']);
        }
        $printer -> feed();
        $printer -> text("Tgl    : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
        $printer -> text("Jam    : ".$new_date['time']."\n");
        $printer -> feed();
        try {
            $printer -> selectPrintMode(49);
        } catch (Exception $e) {
            $printer -> setEmphasis(true);
        }
        $printer -> text("Note : ".$order_menu[$i]['note']);
        $printer -> setEmphasis(false);
        $printer -> selectPrintMode();
        $printer -> feed();
    }
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text("-------------------------------\n");
    $printer -> feed(4);
    $printer -> cut();
    $printer -> close();

}

function send_printer_void($info_data,$order_menu, $info_printer){
    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y');    
    $time = $now->format('H:i:s'); 
    $new_date = get_date_indo();     

    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    //$printer = printerConnection("SHARED","smb://DESKTOP-GM82O3U/kasir");
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(3, 3);
    $printer -> text("VOID\n");
    $printer -> setTextSize(1, 1);
    $printer -> text("-------------------------------\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    $printer -> setTextSize(2, 2);
    if($info_data['void_type']=="dinein"){
        $printer -> text("No Meja : ".$info_data['void_name']."\n"); 
    }else{
        $printer -> text("A/N : ".$info_data['void_name']."\n"); 
    }
    $printer -> setTextSize(1, 1);
    $printer -> text("Nama Kasir : ".$info_data['name']."\n");
    $printer -> text("Tgl    : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
    $printer -> text("Jam    : ".$new_date['time']."\n"); 
    $printer -> feed();
    //item
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 2);
    $printer -> text($order_menu['qty']." ".$order_menu['name']);
    $printer -> feed();
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    $printer -> setTextSize(1, 1);
    $printer -> text("Alasan : ".$order_menu['reason']);
    $printer -> feed();
    
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text("-------------------------------\n");
    $printer -> cut();
    $printer -> close();

 }

function send_printer_payment($info_data,$order_menu, $info_printer, $info_payment,$outlet){    

    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y');    
    $time = $now->format('H:i:s'); 
    $new_date = get_date_indo();   
    
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> text($outlet->name."\n");
    $printer -> text($outlet->address."\n");
    $printer -> text($outlet->phone."\n");
    $printer -> feed();
    $printer -> text("DETAIL PEMBAYARAN\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> text("Nota   : ".$info_data['bill_no']."\n");
    $printer -> text("Kasir  : ".$info_data['name']."\n");
    //$printer -> text("No     : ".$info_data['order_id']."\n");\
    $printer -> text("Tgl    : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
    $printer -> text("Jam    : ".$new_date['time']."\n");
    if($info_data['is_delivery']==1 || $info_data['is_take_away']==1 || $info_data['is_fastcasual']|| $info_data['customer_name']){
        $printer -> text("Nama   : ".$info_data['customer_name']."\n");
    }else{
        $printer -> text("Meja   : ".$info_data['table_name']."\n");

    }
    $printer -> text("Telp   : ".$info_data['customer_phone']."\n");
    
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    //$printer -> text("Jam Order : ".$now."\n"); 
    for ($i=0; $i<count($order_menu); $i++) {
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        $printer -> text($order_menu[$i]['name']."\n");
        $str_order = $order_menu[$i]['qty']." x ".number_format(($order_menu[$i]['price']/$order_menu[$i]['qty']),0,",",".");
        $price = number_format($order_menu[$i]['price'],0,",",".");
        $string = insert_space($str_order,$price);
        $printer -> text($string."\n");
        if(isset($order_menu[$i]['sidedish'])){
            if($order_menu[$i]['sidedish']){
                for ($j=0; $j <count($order_menu[$i]['sidedish']) ; $j++) {
                    $printer -> text($order_menu[$i]['sidedish'][$j]['sidedish_name']."\n");
                    $str_order = $order_menu[$i]['sidedish'][$j]['quantity']." x ".number_format(($order_menu[$i]['sidedish'][$j]['sidedish_price']),0,",",".");
                    $price = number_format($order_menu[$i]['sidedish'][$j]['sidedish_price'] * $order_menu[$i]['sidedish'][$j]['quantity'],0,",",".");
                    $string = insert_space($str_order,$price);
                    $printer -> text($string."\n");
                }
            }
        }

    }
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $string = insert_space("SUBTOTAL",number_format($info_payment['subtotal'],0,",","."));
    $printer -> text($string."\n");

    if($info_payment['fee']!=0){
        $string = insert_space("ONGKIR",number_format($info_payment['fee'],0,",","."));
        $printer -> text($string."\n");
    }

    $string = insert_space("SERVICE",number_format($info_payment['tax_service'],0,",","."));
    $printer -> text($string."\n");
    $string = insert_space("PPN",number_format($info_payment['tax_ppn'],0,",","."));
    $printer -> text($string."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    $local_total = $info_payment['subtotal'] + $info_payment['tax_service'] + $info_payment['tax_ppn'] + $info_payment['fee'];
    $string = insert_space("TOTAL",number_format($local_total,0,",","."));
    $printer -> text($string."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $promo_voucher_status=0;

    if($info_payment['dp'] != 0){
        $string = insert_space("DP",number_format($info_payment['dp'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }
    if($info_payment['debit']['charge']!=0){
        $string = insert_space("DEBIT CHARGE",number_format($info_payment['debit']['charge'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }
    if($info_payment['credit']['charge']!=0){
        $string = insert_space("CREDIT CHARGE",number_format($info_payment['credit']['charge'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }
    if($info_payment['promo']!=0){
        $string = insert_space("PROMO",number_format($info_payment['promo'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }

    if($info_payment['member']!=0){
        $string = insert_space("MEMBER",number_format($info_payment['member'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }

    if($info_payment['voucher']['amount']!=0){
        $string = insert_space("VOUCHER",number_format($info_payment['voucher']['amount'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }
    if($info_payment['bill_adjustment'] != 0){
        $string = insert_space("Pembulatan ",number_format($info_payment['bill_adjustment'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }

    if($promo_voucher_status ==1){
        $printer -> text(str_repeat('-', 32)."\n");
    }
    ///////////////////////////////////////////////////
    
    $string = insert_space("GRAND TOTAL",number_format($info_payment['total'],0,",","."));
    $printer -> text($string."\n");
    if($info_payment['cash']['amount']!=0){
        $string = insert_space("CASH",number_format($info_payment['cash']['amount'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['debit']['total']!=0){
        $string = insert_space("DEBIT",number_format($info_payment['debit']['total'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['credit']['total']!=0){
        $string = insert_space("CREDIT",number_format($info_payment['credit']['total'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['e_payment']['total']!=0){
        $string = insert_space($info_payment['e_payment']['name'],number_format($info_payment['e_payment']['total'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['compliment']['amount']!=0){
        $string = insert_space("COMPLIMENT",number_format($info_payment['compliment']['amount'],0,",","."));
        $printer -> text($string."\n");
    }

    $string = insert_space("Kembalian",number_format($info_payment['cashback'],0,",","."));
    $printer -> text($string."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text($outlet->footer."\n");
    $printer -> cut();
    $printer -> pulse();
    $printer -> close();
}

function send_printer_payment_spv($info_data,$order_menu, $info_printer, $info_payment,$outlet){    
    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y');    
    $time = $now->format('H:i:s'); 
    $new_date = get_date_indo($info_data['payment_date']);
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */

    $printer -> setJustification($printer::JUSTIFY_RIGHT);
    $printer -> setTextSize(3, 3);
    $printer -> text("REPRINT"."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> text($outlet->name."\n");
    $printer -> text($outlet->address."\n");
    $printer -> text($outlet->phone."\n");
    $printer -> feed();
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> setTextSize(1, 1);
    $printer -> text("DETAIL PEMBAYARAN\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
  
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> text("Nota   : ".$info_data['bill_no']."\n");
    $printer -> text("Kasir  : ".$info_data['name']."\n");
    //$printer -> text("No     : ".$info_data['order_id']."\n");\
    $printer -> text("Tgl    : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
    $printer -> text("Jam    : ".$new_date['time']."\n");
    if($info_data['is_delivery']==1 || $info_data['is_take_away']==1 || $info_data['is_fastcasual'] == 1 || $info_data['customer_name']){
        $printer -> text("Nama   : ".$info_data['customer_name']."\n");
    }else{
        $printer -> text("Meja   : ".$info_data['table_name']."\n");

    }
    $printer -> text("Telp   : ".$info_data['customer_phone']."\n");
    
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> text(str_repeat('-', 32)."\n");
    /////////////////////////////////////////////////
    $subtotal_spv =0;
    for ($i=0; $i<count($order_menu); $i++) {
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        $printer -> text($order_menu[$i]['menu_name']."\n");
        $str_order = $order_menu[$i]['bill_menu_qty']." x ".number_format(($order_menu[$i]['bill_menu_price']/$order_menu[$i]['bill_menu_qty']),0,",",".");
        $price = number_format($order_menu[$i]['bill_menu_price'],0,",",".");
        $string = insert_space($str_order,$price);
        $printer -> text($string."\n");
        $subtotal_spv += $order_menu[$i]['bill_menu_price'];
    }
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $string = insert_space("SUBTOTAL",number_format($subtotal_spv,0,",","."));
    $printer -> text($string."\n");
    $status_pemisah = 1;
    $status_dp = 0;
    $total_local = $subtotal_spv;
    for($i=0;$i<count($info_payment['payment_info']);$i++){

        //di set 2 karena secara defualt , tax(1) dan service(2) sudah diisi walau nilai nya kosong,
        if($i == 2 && $status_pemisah == 1){
            $printer -> text(str_repeat('-', 32)."\n");
            $string = insert_space("TOTAL",number_format($total_local,0,",","."));
            $printer -> text($string."\n");
            $printer -> text(str_repeat('-', 32)."\n");
            if($status_dp == 0){
                if($info_payment['dp'] != 0){
                    $string = insert_space("DP",number_format($info_payment['dp'],0,",","."));
                    $printer -> text($string."\n");
                    $status_dp = 1;
                }
            }
            $status_pemisah = 0; //pemisah hanya 1x
        }

        if($i < 2){
            $total_local += $info_payment['payment_info'][$i]['total'];
        }
        
        $string = insert_space($info_payment['payment_info'][$i]['name'],number_format($info_payment['payment_info'][$i]['total'],0,",","."));
        $printer -> text($string."\n");
    }

    if($i == 2){
        $printer -> text(str_repeat('-', 32)."\n");
        $string = insert_space("TOTAL",number_format($total_local,0,",","."));
        $printer -> text($string."\n");
        $printer -> text(str_repeat('-', 32)."\n");
        if($status_dp == 0){
            if($info_payment['dp'] != 0){
                $string = insert_space("DP",number_format($info_payment['dp'],0,",","."));
                $printer -> text($string."\n");
                $status_dp = 1;
            }
        }
    }
    if($info_payment['adjustment'] != 0){
        $string = insert_space("Pembulatan",number_format($info_payment['adjustment'],0,",","."));
        $printer -> text($string."\n");
    }
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $string = insert_space("GRAND TOTAL",number_format($info_payment['total_must_paid'],0,",","."));
    $printer -> text($string."\n");
    for($i=0;$i<count($info_payment['payment_method']);$i++){
        $string = insert_space($info_payment['payment_method'][$i]['name'],number_format($info_payment['payment_method'][$i]['total'],0,",","."));
        $printer -> text($string."\n");
    }
    ///////////////////////////////////////////////////
    $string = insert_space("Kembalian",number_format($info_payment['cashback'],0,",","."));
    $printer -> text($string."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text($outlet->footer."\n");
    $printer -> cut();
    $printer -> close();
}

function send_printer_refund($info_data,$order_menu, $info_printer, $info_payment,$outlet){    
    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y');    
    $time = $now->format('H:i:s'); 
    $refund_date = get_date_indo($info_data['refund_created_at']);
    $new_date = get_date_indo($info_data['payment_date']);
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */

    $printer -> setJustification($printer::JUSTIFY_RIGHT);
    $printer -> setTextSize(3, 3);
    $printer -> text("MENUREFUND"."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> text($outlet->name."\n");
    $printer -> text($outlet->address."\n");
    $printer -> text($outlet->phone."\n");
    $printer -> feed();
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> setTextSize(1, 1);
    $printer -> text("REFUND MENU\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
  
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> text("Nota       : ".$info_data['receipt_number']."\n");
    $printer -> text("Kasir      : ".$info_data['name']."\n");
    //$printer -> text("No     : ".$info_data['order_id']."\n");\
    $printer -> text("Tgl        : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
    $printer -> text("Jam        : ".$new_date['time']."\n");
    $printer -> text("Tgl Refund : ".$refund_date['day']." ".$refund_date['month_name']." ".$refund_date['year']." "."\n");
    $printer -> text("Jam Refund : ".$refund_date['time']."\n");
    if($info_data['is_delivery']==1 || $info_data['is_take_away']==1 || $info_data['is_fastcasual'] == 1 || $info_data['customer_name']){
        $printer -> text("Nama       : ".$info_data['customer_name']."\n");
    }else{
        $printer -> text("Meja       : ".$info_data['table_name']."\n");
    }
    
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> text(str_repeat('-', 32)."\n");
    /////////////////////////////////////////////////
    $subtotal_spv =0;
    for ($i=0; $i<count($order_menu); $i++) {
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        $printer -> text($order_menu[$i]['menu_name']."\n");
        $str_order = $order_menu[$i]['quantity']." x ".number_format(($order_menu[$i]['price']/$order_menu[$i]['quantity']),0,",",".");
        $price = number_format($order_menu[$i]['price'],0,",",".");
        $string = insert_space($str_order,$price);
        $printer -> text($string."\n");
        $subtotal_spv += $order_menu[$i]['price'];
    }
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $string = insert_space("SUBTOTAL",number_format($subtotal_spv,0,",","."));
    $printer -> text($string."\n");
    ///////////////////////////////////////////////////

    if($info_payment['tax_amount'] != 0){
        $info_tax = json_decode($info_payment['tax_info']);
        $string = insert_space("SERVICE",number_format($info_tax->tax_service,0,",","."));
        $printer -> text($string."\n");
        $string = insert_space("PPN",number_format($info_tax->tax_ppn,0,",","."));
        $printer -> text($string."\n");
        // $string = insert_space("TOTAL",number_format($info_payment['tax_amount'],0,",","."));
        // $printer -> text($string."\n");
    }
    if($info_payment['total_promo_refund'] !=0){
        $string = insert_space("PROMO",number_format($info_payment['total_promo_refund'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['adjustment'] != 0){
        $string = insert_space("Pembulatan",number_format($info_payment['adjustment'],0,",","."));
        $printer -> text($string."\n");
    }

    $string = insert_space("GRAND TOTAL",number_format($subtotal_spv + $info_payment['tax_amount'] -$info_payment['total_promo_refund'],0,",","."));
    $printer -> text($string."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text($outlet->footer."\n");
    $printer -> cut();
    $printer -> close();
}


function send_printer_after_refund($info_data,$order_menu, $info_printer, $info_payment,$outlet, $title){    
    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y');    
    $time = $now->format('H:i:s'); 
    $refund_date = get_date_indo($info_data['refund_created_at']);
    $new_date = get_date_indo($info_data['payment_date']);
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */

    $printer -> setJustification($printer::JUSTIFY_RIGHT);
    $printer -> setTextSize(3, 3);
    $printer -> text($title."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> text($outlet->name."\n");
    $printer -> text($outlet->address."\n");
    $printer -> text($outlet->phone."\n");
    $printer -> feed();
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> setTextSize(1, 1);
    $printer -> text("REFUND BILL\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
  
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> text("Nota       : ".$info_data['receipt_number']."\n");
    $printer -> text("Kasir      : ".$info_data['name']."\n");
    //$printer -> text("No     : ".$info_data['order_id']."\n");\
    $printer -> text("Tgl        : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
    $printer -> text("Jam        : ".$new_date['time']."\n");
    $printer -> text("Tgl Refund : ".$refund_date['day']." ".$refund_date['month_name']." ".$refund_date['year']." "."\n");
    $printer -> text("Jam Refund : ".$refund_date['time']."\n");
    if($info_data['is_delivery']==1 || $info_data['is_take_away']==1 || $info_data['is_fastcasual'] == 1 || $info_data['customer_name']){
        $printer -> text("Nama       : ".$info_data['customer_name']."\n");
    }else{
        $printer -> text("Meja       : ".$info_data['table_name']."\n");
    }
    
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> text(str_repeat('-', 32)."\n");
    /////////////////////////////////////////////////
    $subtotal_spv =0;
    for ($i=0; $i<count($order_menu); $i++) {
        $total_refund_menu = 0;
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        $printer -> text($order_menu[$i]['menu_name']."\n");
        $total_refund_menu = $order_menu[$i]['new_quantity'] * $order_menu[$i]['one_price'];
        $str_order = $order_menu[$i]['new_quantity']." x ".number_format(($order_menu[$i]['one_price']),0,",",".");
        $price = number_format($total_refund_menu,0,",",".");
        $string = insert_space($str_order,$price);
        $printer -> text($string."\n");
        $subtotal_spv += $total_refund_menu;
    }
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $string = insert_space("SUBTOTAL",number_format($subtotal_spv,0,",","."));
    $printer -> text($string."\n");
    ///////////////////////////////////////////////////

    $new_tax_service = 0;
    $new_tax_ppn = 0;

    if($info_payment['tax_amount'] != 0){
        $info_tax = json_decode($info_payment['tax_info']);
        $new_tax_service = $info_payment['old_bill_tax_service'] - $info_tax->tax_service;
        if($new_tax_service > 0){
            $string = insert_space("SERVICE",number_format($new_tax_service,0,",","."));
            $printer -> text($string."\n");
        }
        $new_tax_ppn = $info_payment['old_bill_tax_ppn'] - $info_tax->tax_ppn;
        if($new_tax_ppn > 0){
            $string = insert_space("PPN",number_format($new_tax_ppn,0,",","."));
            $printer -> text($string."\n");
        }

        // $string = insert_space("TOTAL",number_format($info_payment['tax_amount'],0,",","."));
        // $printer -> text($string."\n");
    }
    $pengurang = 0;
    $status_pemisah = 1;

    if($info_payment['total_promo'] !=0){
        $pengurang +=$info_payment['total_promo'];
        $string = insert_space("PROMO",number_format($info_payment['total_promo'],0,",","."));
        $printer -> text($string."\n");

    } 
    if($info_payment['total_member'] !=0){
        $pengurang +=$info_payment['total_member'];
        $string = insert_space("MEMBER",number_format($info_payment['total_member'],0,",","."));
        $printer -> text($string."\n");

    } 

    // for($i=2;$i<count($info_payment['payment_info']);$i++){

    //     //di set 2 karena secara defualt , tax(1) dan service(2) sudah diisi walau nilai nya kosong,
    //     if($i == 2 && $status_pemisah == 1){
    //         $printer -> text(str_repeat('-', 32)."\n");
    //         $status_pemisah = 0; //pemisah hanya 1x
    //     }
    // }

    // if($info_payment['adjustment'] != 0){
    //     $string = insert_space("Adjustment",number_format($info_payment['adjustment'],0,",","."));
    //     $printer -> text($string."\n");
    // }
    $string = insert_space("GRAND TOTAL",number_format($subtotal_spv+$new_tax_ppn+$new_tax_service - $pengurang,0,",","."));
    $printer -> text($string."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text($outlet->footer."\n");
    $printer -> cut();
    $printer -> close();
}

function send_printer_open_close($info_printer, $info_open_close,$outlet){
    $open = $info_open_close['open_at'];
    $open = new DateTime($open);
    $date_open = $open->format('d M Y');
    $time_open = $open->format('H:i:s');

    $close = $info_open_close['close_at'];
    $close = new DateTime($close);
    $date_close = $close->format('d M Y');
    $time_close = $close->format('H:i:s');       
    
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_RIGHT); 
    $printer -> setTextSize(3, 3);
    $printer -> text($info_open_close['sequence']."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> setTextSize(1, 1);
    $printer -> text($outlet->name."\n");
    $printer -> text($outlet->address."\n");
    $printer -> text($outlet->phone."\n");
    $printer -> feed();
    $printer -> setTextSize(1, 1);
    $printer -> text("OPEN CLOSE"."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    ///////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    $printer -> text("WAKTU OPEN    : ".$date_open."\n");
    $printer -> text("JAM OPEN      : ".$time_open."\n");
    $printer -> text("WAKTU CLOSE   : ".$date_close."\n");
    $printer -> text("JAM CLOSE     : ".$time_close."\n");
    $printer -> text("OPEN BY       : ".substr($info_open_close['open_by'],0,16)."\n"); 
    $printer -> text("CLOSE BY      : ".substr($info_open_close['close_by'],0,16)."\n"); 
    $printer -> text("TOT TRANSAKSI : ".$info_open_close['total_transaction']."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    ////////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> text("DETAIL TRANSAKSI"."\n"); 
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> text("DINEIN"."\n");
    $printer -> text("     TOT TRANSAKSI : ".number_format($info_open_close['dinein']['qty'],0,",",".")."\n"); 
    $printer -> text("     TOT PELANGGAN : ".number_format($info_open_close['dinein']['customer_qty'],0,",",".")."\n"); 
    $printer -> text("     RATA-RATA     : ".number_format($info_open_close['dinein']['average'],0,",",".")."\n"); 

    $printer -> text("TAKEAWAY"."\n");
    $printer -> text("     TOT TRANSAKSI : ".number_format($info_open_close['take_away']['qty'],0,",",".")."\n"); 
    $printer -> text("     TOT PELANGGAN : ".number_format($info_open_close['take_away']['customer_qty'],0,",",".")."\n");  
    $printer -> text("     RATA-RATA     : ".number_format($info_open_close['take_away']['average'],0,",",".")."\n");

    $printer -> text("DELIVERY"."\n");
    $printer -> text("     TOT TRANSAKSI : ".number_format($info_open_close['delivery']['qty'],0,",",".")."\n"); 
    $printer -> text("     TOT PELANGGAN : ".number_format($info_open_close['delivery']['customer_qty'],0,",",".")."\n"); 
    $printer -> text("     RATA-RATA     : ".number_format($info_open_close['delivery']['average'],0,",",".")."\n");

    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    ///////////////////////////////////////////

    $all_driver_online_price = 0;
    if($info_open_close['driver_online']){
        foreach ($info_open_close['driver_online'] as $key => $value) {
            $all_driver_online_price += $value->total_price;
        }
    } 


    ///////////////////////////////////////////
    $printer -> text("OMSET         : ".number_format($info_open_close['total_income'],0,",",".")."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    ///////////////////////////////////////////
    // echo $all_driver_online_price;
    $printer -> text("SALDO AWAL    : ".number_format($info_open_close['begin_balance'],0,",",".")."\n"); 
    $printer -> text("MODAL         : ".number_format($info_open_close['pettycash']['income'],0,",",".")."\n");  
    $printer -> text("CASH          : ".number_format($info_open_close['final_total_cash'])."\n"); 
    $printer -> text("TOTAL         : ".number_format(($info_open_close['begin_balance']+$info_open_close['final_total_cash']+$info_open_close['pettycash']['income']),0,",",".")."\n"); 
    $total_incomes = $info_open_close['begin_balance']+$info_open_close['final_total_cash']+$info_open_close['pettycash']['income']; 

    ////////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    $printer -> text("PPN           : ".number_format($info_open_close['total_tax_ppn'],0,",",".")."\n");     
    $printer -> text("SERVICE       : ".number_format($info_open_close['total_tax_service'],0,",",".")."\n"); 
    $printer -> text("TOTAL         : ".number_format($info_open_close['total_tax'],0,",",".")."\n"); 
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT);     
    

    ////////////////////////////////////////////////////
    $printer -> text("REFUND        : ".number_format($info_open_close['total_refund'],0,",",".")."\n");
    $printer -> text("KAS KECIL     : ".number_format($info_open_close['pettycash']['outcome'],0,",",".")."\n");
    $printer -> text("DEBIT         : ".number_format($info_open_close['total_debit'],0,",",".")."\n"); 
    $printer -> text("CREDIT        : ".number_format($info_open_close['total_credit'],0,",",".")."\n"); 
    $printer -> text("E PAYMENT     : ".number_format($info_open_close['total_e_payment'],0,",",".")."\n"); 
    $printer -> text("VOUCHER       : ".number_format($info_open_close['total_voucher'],0,",",".")."\n"); 
    $printer -> text("PROMO         : ".number_format($info_open_close['total_promo'],0,",",".")."\n"); 
    $printer -> text("MEMBER        : ".number_format($info_open_close['total_member'],0,",",".")."\n"); 
    $total_driver_online = 0;
    if($info_open_close['driver_online']){
        foreach ($info_open_close['driver_online'] as $key => $value) {
            $string_name = substr(strip_tags($value->name),0,14);
            $length_string = strlen($string_name);
            if(14-$length_string >0){
                $length_space =14-$length_string;
            }else{
                $length_space = 0;
            }
            // echo $value->total_price;
            $printer -> text($string_name.str_repeat(' ', $length_space).": ".number_format($value->total_price,0,",",".")."\n"); 
            if($value->is_percentage ==1){
                $total_driver_online += $value->total_price * $value->value/ 100;
            }
        }
    }
    $jumlah_pengurang = $info_open_close['pettycash']['outcome']+$info_open_close['total_debit'] +$info_open_close['total_credit'] +$info_open_close['total_e_payment'] + $info_open_close['total_voucher'] +$info_open_close['total_compliment'] + $all_driver_online_price +$info_open_close['total_refund'] + $info_open_close['total_promo'];
    $printer -> text("COMPLIMENT    : ".number_format($info_open_close['total_compliment'],0,",",".")."\n"); 
    // $printer -> text("TOTAL         : ".number_format($jumlah_pengurang,0,",",".")."\n"); 
    $total_outcomes = $info_open_close['pettycash']['outcome']+$info_open_close['total_debit']+$info_open_close['total_credit']+$info_open_close['total_compliment'] + $info_open_close['total_e_payment'];
    $total_outcomes_2 =  $info_open_close['pettycash']['outcome'];
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 

    ////////////////////////////////////////////////////
    // echo $total_driver_online;
    $total = $total_incomes - $total_outcomes_2;
    $printer -> text("CASH ON HAND  : ".number_format($info_open_close['cash_on_hand'],0,",",".")."\n");
    $printer -> text("GRAND TOTAL   : ".number_format($total,0,",",".")."\n"); 
    $printer -> text("SELISIH       : ".number_format(($info_open_close['cash_on_hand']- $total),0,",",".")."\n"); 
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $net_omset = $info_open_close['total_income'] - $info_open_close['total_compliment'] - $total_driver_online;
    $printer -> text("NET OMSET     : ".number_format($net_omset,0,",",".")."\n");
    $printer -> feed();

    $string = insert_space("   SPV    ","  KASIR   ");
    $printer -> text($string."\n");
    $printer ->feed(3);
    $string = insert_space("(--------)","(--------)");
    $printer -> text($string."\n");
    $printer -> cut();
    $printer -> close();

}

function send_printer_open_close_new($info_printer, $info_open_close,$outlet){

    $open = $info_open_close['open_at'];
    $open = new DateTime($open);
    $date_open = $open->format('d M Y');
    $time_open = $open->format('H:i:s');

    $close = $info_open_close['close_at'];
    $close = new DateTime($close);
    $date_close = $close->format('d M Y');
    $time_close = $close->format('H:i:s');       
    
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_RIGHT); 
    $printer -> setTextSize(3, 3);
    $printer -> text($info_open_close['sequence']."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> setTextSize(1, 1);
    $printer -> text($outlet->name."\n");
    $printer -> text($outlet->address."\n");
    $printer -> text($outlet->phone."\n");
    $printer -> feed();
    $printer -> setTextSize(1, 1);
    $printer -> text("OPEN CLOSE"."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    ///////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    $printer -> text("WAKTU OPEN    : ".$date_open."\n");
    $printer -> text("JAM OPEN      : ".$time_open."\n");
    $printer -> text("WAKTU CLOSE   : ".$date_close."\n");
    $printer -> text("JAM CLOSE     : ".$time_close."\n");
    $printer -> text("OPEN BY       : ".substr($info_open_close['open_by'],0,16)."\n"); 
    $printer -> text("CLOSE BY      : ".substr($info_open_close['close_by'],0,16)."\n"); 
    $printer -> text("TOT TRANSAKSI : ".$info_open_close['total_transaction']."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    ////////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> text("DETAIL TRANSAKSI"."\n"); 
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> text("DINEIN"."\n");
    $printer -> text("     TOT TRANSAKSI : ".number_format($info_open_close['dinein']['qty'],0,",",".")."\n"); 
    $printer -> text("     TOT PELANGGAN : ".number_format($info_open_close['dinein']['customer_qty'],0,",",".")."\n"); 
    $printer -> text("     RATA-RATA     : ".number_format($info_open_close['dinein']['average'],0,",",".")."\n"); 

    $printer -> text("TAKEAWAY"."\n");
    $printer -> text("     TOT TRANSAKSI : ".number_format($info_open_close['take_away']['qty'],0,",",".")."\n"); 
    $printer -> text("     TOT PELANGGAN : ".number_format($info_open_close['take_away']['customer_qty'],0,",",".")."\n");  
    $printer -> text("     RATA-RATA     : ".number_format($info_open_close['take_away']['average'],0,",",".")."\n");

    $printer -> text("DELIVERY"."\n");
    $printer -> text("     TOT TRANSAKSI : ".number_format($info_open_close['delivery']['qty'],0,",",".")."\n"); 
    $printer -> text("     TOT PELANGGAN : ".number_format($info_open_close['delivery']['customer_qty'],0,",",".")."\n"); 
    $printer -> text("     RATA-RATA     : ".number_format($info_open_close['delivery']['average'],0,",",".")."\n");

    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    ///////////////////////////////////////////
    $printer -> text("OMSET         : ".number_format($info_open_close['total_income'],0,",",".")."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    ///////////////////////////////////////////
    // echo $all_driver_online_price;
    $printer -> text("SALDO AWAL    : ".number_format($info_open_close['begin_balance'],0,",",".")."\n"); 
    $printer -> text("MODAL         : ".number_format($info_open_close['pettycash']['income'],0,",",".")."\n");  
    $printer -> text("CASH          : ".number_format($info_open_close['all_cash']['after_tax'])."\n"); 
    $printer -> text("TOTAL CASH   (+)".number_format($info_open_close['current_cash'])."\n"); 
    ////////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 

    $printer -> text("DEBIT         : ".number_format($info_open_close['all_debit']['after_tax'],0,",",".")."\n"); 
    $printer -> text("CREDIT        : ".number_format($info_open_close['all_credit']['after_tax'],0,",",".")."\n"); 
    // $printer -> text("E PAYMENT     : ".number_format($info_open_close['total_e_payment'],0,",",".")."\n"); 
    $total_driver_online = 0;
    if($info_open_close['driver_online']){
        foreach ($info_open_close['driver_online'] as $key => $value) {
            $string_name = substr(strip_tags($value->name),0,14);
            $length_string = strlen($string_name);
            if(14-$length_string >0){
                $length_space =14-$length_string;
            }else{
                $length_space = 0;
            }
            // echo $value->total_price;
            // if($value->total_price >0){
            //     $printer -> text($string_name.str_repeat(' ', $length_space).": ".number_format($value->total_price,0,",",".")."\n"); 
            // }
            if($value->total_all >0){
                $printer -> text($string_name.str_repeat(' ', $length_space).": ".number_format($value->total_all,0,",",".")."\n"); 
            }
        }
    }

    if($info_open_close['e_payment_list']){
        foreach ($info_open_close['e_payment_list'] as $key => $value) {
            $string_name = substr(strip_tags($value->e_payment_name),0,14);
            $length_string = strlen($string_name);
            if(14-$length_string >0){
                $length_space =14-$length_string;
            }else{
                $length_space = 0;
            }
            // if($value->total_price >0){
            //     $printer -> text($string_name.str_repeat(' ', $length_space).": ".number_format($value->total_price,0,",",".")."\n"); 
            // }
            if($value->total_amount >0){
                $printer -> text($string_name.str_repeat(' ', $length_space).": ".number_format($value->total_amount,0,",",".")."\n"); 
            }
        }
    }

    $printer -> text("TOTAL NONCASH(+)".number_format($info_open_close['total_non_cash'],0,",",".")."\n"); 
    
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    ////////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> text("KAS KECIL     : ".number_format($info_open_close['pettycash']['outcome'],0,",",".")."\n");
    $printer -> text("REFUND        : ".number_format($info_open_close['total_refund'],0,",",".")."\n");
    $printer -> text("TOTAL         : ".number_format($info_open_close['total_refund'] + $info_open_close['pettycash']['outcome'],0,",",".")."\n");
    ////////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    if($info_open_close['dp_reservation_in']['total'] >0){

        $printer -> setTextSize(1, 1);
        $printer -> setJustification($printer::JUSTIFY_CENTER); 
        $printer -> text("DP IN"."\n"); 
        $printer -> text(str_repeat('-', 32)."\n");

        $printer -> setJustification($printer::JUSTIFY_LEFT);
        if($info_open_close['dp_reservation_in']['cash'] > 0){
            $printer -> text("DP CASH       : ".number_format($info_open_close['dp_reservation_in']['cash'],0,",",".")."\n");
        }
        if($info_open_close['dp_reservation_in']['debit'] > 0){
            $printer -> text("DP DEBIT      : ".number_format($info_open_close['dp_reservation_in']['debit'],0,",",".")."\n");
        }
        if($info_open_close['dp_reservation_in']['credit'] > 0){
            $printer -> text("DP CREDIT     : ".number_format($info_open_close['dp_reservation_in']['credit'],0,",",".")."\n");
        }
        $printer -> text("TOTAL         : ".number_format($info_open_close['dp_reservation_in']['total'],0,",",".")."\n");
        ////////////////////////////////////////////////////
        $printer -> setJustification($printer::JUSTIFY_CENTER); 
        $printer -> text(str_repeat('-', 32)."\n");
    }
    if($info_open_close['dp_reservation_out']['total'] >0){

        $printer -> setTextSize(1, 1);
        $printer -> setJustification($printer::JUSTIFY_CENTER); 
        $printer -> text("DP OUT"."\n"); 
        $printer -> text(str_repeat('-', 32)."\n");

        $printer -> setJustification($printer::JUSTIFY_LEFT);
        if($info_open_close['dp_reservation_out']['cash'] > 0){
            $printer -> text("DP CASH       : ".number_format($info_open_close['dp_reservation_out']['cash'],0,",",".")."\n");
        }
        if($info_open_close['dp_reservation_out']['debit'] > 0){
            $printer -> text("DP DEBIT      : ".number_format($info_open_close['dp_reservation_out']['debit'],0,",",".")."\n");
        }
        if($info_open_close['dp_reservation_out']['credit'] > 0){
            $printer -> text("DP CREDIT     : ".number_format($info_open_close['dp_reservation_out']['credit'],0,",",".")."\n");
        }
        $printer -> text("TOTAL         : ".number_format($info_open_close['dp_reservation_out']['total'],0,",",".")."\n");
        ////////////////////////////////////////////////////
        $printer -> setJustification($printer::JUSTIFY_CENTER); 
        $printer -> text(str_repeat('-', 32)."\n");
    }

    if($info_open_close['dp_order'] != 0){
        $printer -> setJustification($printer::JUSTIFY_LEFT);     
        $printer -> text("DP OUT        :".number_format($info_open_close['dp_order'],0,",",".")."\n");
        $printer -> setJustification($printer::JUSTIFY_CENTER); 
        $printer -> text(str_repeat('-', 32)."\n");
    }

    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    if(isset($info_open_close['total_adjustment'])){
        if($info_open_close['total_adjustment'] != 0){
            $printer -> text("Pembulatan   (+) ".number_format($info_open_close['total_adjustment'],0,",",".")."\n");
            $printer -> setJustification($printer::JUSTIFY_CENTER); 
            $printer -> text(str_repeat('-', 32)."\n");
            $printer -> setJustification($printer::JUSTIFY_LEFT);     
        }
    }

    ////////////////////////////////////////////////////
    $printer -> text("VOUCHER       : ".number_format($info_open_close['total_voucher'],0,",",".")."\n"); 
    $printer -> text("MEMBER        : ".number_format($info_open_close['total_member'],0,",",".")."\n"); 
    $printer -> text("PROMO         : ".number_format($info_open_close['total_promo'],0,",",".")."\n"); 
    $printer -> text("COMPLIMENT    : ".number_format($info_open_close['total_compliment'],0,",",".")."\n"); 
    $printer -> text("TOTAL         : ".number_format($info_open_close['total_potongan'],0,",",".")."\n"); 
    // $printer -> setJustification($printer::JUSTIFY_CENTER); 
    // $printer -> text(str_repeat('-', 32)."\n");
    // $printer -> setJustification($printer::JUSTIFY_LEFT); 


    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    $printer -> text("PPN           : ".number_format($info_open_close['total_tax_ppn'],0,",",".")."\n");     
    $printer -> text("SERVICE       : ".number_format($info_open_close['total_tax_service'],0,",",".")."\n"); 
    $printer -> text("TOTAL         : ".number_format($info_open_close['total_tax'],0,",",".")."\n"); 
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT);  


    ////////////////////////////////////////////////////
    // echo $total_driver_online;
   
    $printer -> text("GRAND TOTAL   : ".number_format($info_open_close['finalGrandTotal'],0,",",".")."\n"); 
    if(isset($outlet->use_cashonhand)){
        if($outlet->use_cashonhand == 1){
            $printer -> text("CASH ON HAND  : ".number_format($info_open_close['cash_on_hand'],0,",",".")."\n");
            $printer -> text("SELISIH       : ".number_format(($info_open_close['cash_on_hand']- $info_open_close['finalGrandTotal']),0,",",".")."\n"); 
        }
    }
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> feed();
    
    ////////////////////////////////////////////////////
    if($info_open_close['array_department']){
        $printer -> setTextSize(1, 1);
        $printer -> setJustification($printer::JUSTIFY_CENTER); 
        $printer -> text("ITEM GROUPS SALES"."\n"); 
        $printer -> text(str_repeat('-', 32)."\n");

        foreach ($info_open_close['array_department'] as $key => $value) {
            $string_name = substr(strip_tags($value['department_name']),0,14);
            $length_string = strlen($string_name);
            if(14-$length_string >0){
                $length_space =14-$length_string;
            }else{
                $length_space = 0;
            }
            // if($value->total_price >0){
            //     $printer -> text($string_name.str_repeat(' ', $length_space).": ".number_format($value->total_price,0,",",".")."\n"); 
            // }
            // if($value['all_qty'] >0){
                // $printer -> text($string_name.str_repeat(' ', $length_space)."(".$value['all_qty'].") ".number_format($value['total'],0,",",".")."\n"); 
                $left_str = $string_name.str_repeat(' ', $length_space)."(".$value['all_qty'].")";
                $price = number_format($value['total'],0,",",".");
                $string = insert_space($left_str,$price);
                $printer -> text($string."\n");
            // }
        }
        $printer -> text(str_repeat('-', 32)."\n");
    }
    

    $string = insert_space("   SPV    ","  KASIR   ");
    $printer -> text($string."\n");
    $printer ->feed(3);
    $string = insert_space("(--------)","(--------)");
    $printer -> text($string."\n");
    $printer -> cut();
    $printer -> close();
}



function print_paper_work($info_data,$order_menu, $info_printer, $info_payment,$outlet){
    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y');    
    $time = $now->format('H:i:s');    
    $new_date = get_date_indo();
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> text("Surat Jalan\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> text("Nota       : ".$info_data['bill_no']."\n");
    $printer -> text("Kasir      : ".$info_data['name']."\n");
    // $printer -> text("No         : ".$info_data['order_id']."\n");
    $printer -> text("Tgl        : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
    $printer -> text("Jam        : ".$new_date['time']."\n");
    $printer -> text("Nama       : ".$info_data['customer_name']."\n");
    $printer -> text("Telp       : ".$info_data['customer_phone']."\n");
    $printer -> text("Nama Driver: ".$info_data['driver_name']."\n");
    $printer -> text("Alamat     : ".$info_data['address']."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    //$printer -> text("Jam Order : ".$now."\n"); 
    for ($i=0; $i<count($order_menu); $i++) {
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        $printer -> text($order_menu[$i]['name']."\n");
        $str_order = $order_menu[$i]['qty']." x ".number_format(($order_menu[$i]['price']/$order_menu[$i]['qty']),0,",",".");
        $price = number_format($order_menu[$i]['price'],0,",",".");
        $string = insert_space($str_order,$price);
        $printer -> text($string."\n");
    }
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $string = insert_space("SUBTOTAL",number_format($info_payment['subtotal'],0,",","."));
    $printer -> text($string."\n");

    if($info_payment['fee']!=0){
        $string = insert_space("ONGKIR",number_format($info_payment['fee'],0,",","."));
        $printer -> text($string."\n");
    }

    $string = insert_space("PPN",number_format($info_payment['tax_ppn'],0,",","."));
    $printer -> text($string."\n");
    $string = insert_space("SERVICE",number_format($info_payment['tax_service'],0,",","."));
    $printer -> text($string."\n");
    $local_total = $info_payment['subtotal'] + $info_payment['tax_service'] + $info_payment['tax_ppn'] + $info_payment['fee'];
    $string = insert_space("TOTAL",number_format($local_total,0,",","."));
    $printer -> text($string."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $promo_voucher_status=0;

    if($info_payment['debit']['charge']!=0){
        $string = insert_space("DEBIT CHARGE",number_format($info_payment['debit']['charge'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }
    if($info_payment['credit']['charge']!=0){
        $string = insert_space("CREDIT CHARGE",number_format($info_payment['credit']['charge'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }
    if($info_payment['promo']!=0){
        $string = insert_space("PROMO",number_format($info_payment['promo'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }

    if($info_payment['member']!=0){
        $string = insert_space("MEMBER",number_format($info_payment['member'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }

    if($info_payment['voucher']['amount']!=0){
        $string = insert_space("VOUCHER",number_format($info_payment['voucher']['amount'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }

    if($info_payment['bill_adjustment'] != 0){
        $string = insert_space("Pembulatan ",number_format($info_payment['bill_adjustment'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }
    if($promo_voucher_status ==1){
        $printer -> text(str_repeat('-', 32)."\n");
    }
    ///////////////////////////////////////////////////

    $string = insert_space("GRAND TOTAL",number_format($info_payment['total'],0,",","."));
    $printer -> text($string."\n");
    if($info_payment['cash']['amount']!=0){
        $string = insert_space("CASH",number_format($info_payment['cash']['amount'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['debit']['total']!=0){
        $string = insert_space("DEBIT",number_format($info_payment['debit']['total'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['credit']['total']!=0){
        $string = insert_space("CREDIT",number_format($info_payment['credit']['total'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['compliment']['amount']!=0){
        $string = insert_space("COMPLIMENT",number_format($info_payment['compliment']['amount'],0,",","."));
        $printer -> text($string."\n");
    }

    $string = insert_space("Kembalian",number_format($info_payment['cashback'],0,",","."));
    $printer -> text($string."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> text(" Customer ");
    $printer -> feed(3);
    $printer -> text("(--------)"."\n");
    $printer -> feed(3);
    $printer -> cut();
    $printer -> close();
}

function send_printer_payment_only($info_data,$order_menu, $info_printer, $info_payment,$outlet){   

    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y H:i:s');
    // $date = $now->format('d M Y');    
    // $time = $now->format('H:i:s'); 

    $new_date = get_date_indo();   
    
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> text($outlet->name."\n");
    $printer -> text($outlet->address."\n");
    $printer -> text($outlet->phone."\n");
    $printer -> feed();
    $printer -> text($outlet->header_bill."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> text("DETAIL PEMBAYARAN\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> text("B|     "."Nota   : ".$info_data['bill_no']."\n");
    $printer -> text("I|     "."Kasir  : ".substr($info_data['name'],0,16)."\n");
    // $printer -> text("L|     "."No     : ".$info_data['order_id']."\n");
    $printer -> text("L|     "."Tgl    : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
    $printer -> text("L|     "."Jam    : ".$new_date['time']."\n");
    if($info_data['is_delivery']==1 || $info_data['is_take_away']==1 || $info_data['is_fastcasual'] == 1 || $info_data['customer_name']){
        $printer -> text(" |     "."Nama   : ".$info_data['customer_name']."\n");
    }else{
        $printer -> text(" |     "."Meja   : ".$info_data['table_name']."\n");

    }
    $printer -> text("S|     "."Telp   : ".$info_data['customer_phone']."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> text("E|     ".str_repeat('-', 25)."\n");
    ///////////////////////////////////////////////////
    
    $row =7;

    for ($i=0; $i<count($order_menu); $i++) {
        
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        insert_watermark($printer,$row);
        $row++;
        $printer -> text($order_menu[$i]['name']."\n");
        $str_order = $order_menu[$i]['qty']." x ".number_format(($order_menu[$i]['price']/$order_menu[$i]['qty']),0,",",".");
        $price = number_format($order_menu[$i]['price'],0,",",".");
        $string = insert_space_temp($str_order,$price);
        insert_watermark($printer,$row);
        $row++;
        $printer -> text($string."\n");
        if(isset($order_menu[$i]['sidedish'])){
            if($order_menu[$i]['sidedish']){
                for ($j=0; $j <count($order_menu[$i]['sidedish']) ; $j++) { 
                    $row++;
                    insert_watermark($printer,$row);
                    $printer -> text($order_menu[$i]['sidedish'][$j]['sidedish_name']."\n");
                    $str_order = $order_menu[$i]['sidedish'][$j]['quantity']." x ".number_format(($order_menu[$i]['sidedish'][$j]['sidedish_price']),0,",",".");
                    $price = number_format($order_menu[$i]['sidedish'][$j]['sidedish_price'] * $order_menu[$i]['sidedish'][$j]['quantity'],0,",",".");
                    $string = insert_space_temp($str_order,$price);
                    $row++;
                    insert_watermark($printer,$row);
                    $printer -> text($string."\n");
                }
            }
        }

    }
    insert_separator_temp($printer,$row);
    $row++;

    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    insert_watermark($printer,$row);
    $row++;
    $string = insert_space_temp("SUBTOTAL",number_format($info_payment['subtotal'],0,",","."));
    $printer -> text($string."\n");
    insert_watermark($printer,$row);
    if($info_payment['fee']!=0){
        $row++;
        $string = insert_space_temp("ONGKIR",number_format($info_payment['fee'],0,",","."));
        $printer -> text($string."\n");
        insert_watermark($printer,$row);
    }
    $row++;
    $string = insert_space_temp("SERVICE",number_format($info_payment['tax_service'],0,",","."));
    $printer -> text($string."\n");
    insert_watermark($printer,$row);
    $row++;
    $string = insert_space_temp("PPN",number_format($info_payment['tax_ppn'],0,",","."));
    $printer -> text($string."\n");
    insert_separator_temp($printer,$row);
    $row++;
    insert_watermark($printer,$row);
    $local_total = $info_payment['subtotal'] + $info_payment['tax_service'] + $info_payment['tax_ppn']+ $info_payment['fee'];
    $string = insert_space_temp("TOTAL",number_format($local_total,0,",","."));
    $printer -> text($string."\n");
    $row++;
    insert_separator_temp($printer,$row);
    $row++;
    $promo_voucher_status=0;
    if($info_payment['dp']!=0){
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("DP",number_format($info_payment['dp'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }
    if($info_payment['debit']['charge']!=0){
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("DEBIT CHARGE",number_format($info_payment['debit']['charge'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }
    if($info_payment['credit']['charge']!=0){
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("CREDIT CHARGE",number_format($info_payment['credit']['charge'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }
    ///////////////////////////////////////////////////
    if($info_payment['promo']!=0){
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("PROMO",number_format($info_payment['promo'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }

    if($info_payment['member']!=0){
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("MEMBER",number_format($info_payment['member'],0,",","."));
        $printer -> text($string."\n");
        $promo_voucher_status=1;
    }

    if($info_payment['voucher']['amount']!=0){
        $promo_voucher_status=1;
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("VOUCHER",number_format($info_payment['voucher']['amount'],0,",","."));
        $printer -> text($string."\n");
    }
    ///////////////////////////////////////////////////
    if($info_payment['bill_adjustment'] != 0){
        $promo_voucher_status=1;
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("Pembulatan ",number_format($info_payment['bill_adjustment'],0,",","."));
        $printer -> text($string."\n");
    }
    if($promo_voucher_status ==1){
        insert_separator_temp($printer,$row);
        $row++;
    }
    insert_watermark($printer,$row);
    $row++;
    $string = insert_space_temp("GRAND TOTAL",number_format($info_payment['total'],0,",","."));
    $printer -> text($string."\n");
    if($info_payment['cash']['amount']!=0){
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("CASH",number_format($info_payment['cash']['amount'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['debit']['total']!=0){
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("DEBIT",number_format($info_payment['debit']['total'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['credit']['total']!=0){
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("CREDIT",number_format($info_payment['credit']['total'],0,",","."));
        $printer -> text($string."\n");
    }

    if($info_payment['compliment']['amount']!=0){
        insert_watermark($printer,$row);
        $row++;
        $string = insert_space_temp("COMPLIMENT",number_format($info_payment['compliment']['amount'],0,",","."));
        $printer -> text($string."\n");
    }
    insert_watermark($printer,$row);
    $row++;
    $string = insert_space_temp("Harus Dibayar",number_format($info_payment['total'],0,",","."));
    $printer -> text($string."\n");
    insert_separator_temp($printer,$row);
    $row++;
    ///////////////////////////////////////////////////
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> text($outlet->header_bill."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> text($outlet->footer."\n");
    $printer -> cut();
    $printer -> close();
}

function send_printer_order_only($info_data,$order_menu, $info_printer){   

    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y');    
    $time = $now->format('H:i:s');    
    $new_date = get_date_indo();
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 2);
    $printer -> text(str_repeat('-', 32)."\n");
    if($info_data['sequence'] != 1){
        $printer -> setTextSize(2, 2);
        $printer -> text("TAMBAHAN\n");
    }else{
        $printer -> setTextSize(2, 2);
        $printer -> text("Checker Menu\n");
    }
    $printer -> setTextSize(1, 2);
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    // $printer -> setJustification($printer::JUSTIFY_LEFT);
    // $printer -> text("Nota       : ".$info_data['bill_no']."\n");
    // $printer -> text("Kasir      : ".$info_data['name']."\n");
    // // $printer -> text("No         : ".$info_data['order_id']."\n");
    // $printer -> text("Tgl        : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
    // $printer -> text("Jam        : ".$new_date['time']."\n");
    // if($info_data['is_take_away'] == 1 || $info_data['is_delivery'] ==1){
    //     $printer -> text("Nama       : ".$info_data['customer_name']."\n");     
    // }else{
    //     $printer -> text("Nama       : ".$info_data['table_name']."\n");  
    // }
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer -> setTextSize(1, 1);
    $printer -> text("Waiters   :".substr($info_data['user_login_name'],0,16)."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> setTextSize(1, 2);
    $printer -> text($info_data['order_name']."\n");
    $printer -> setTextSize(1, 2);
    $printer -> text($new_date['time']."\n");
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    //$printer -> text("Jam Order : ".$now."\n");
    $total_price =0;
    for($i=0;$i<count($order_menu);$i++){
        $printer -> setTextSize(1, 2);
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        if(isset($order_menu[$i]['is_takeaway'])){
            if($order_menu[$i]['is_takeaway']=="true"){
                $type= "(Dinein-Takeaway) :";
            }else{
                $type= "(Dinein) :";
            }
        }else{
            $type= "(-) :";
        }

        // $addon ="";
        // if($order_menu[$i]['sequence'] != 1){
        //     $addon = "(*addon)";
        // }

        $printer -> text($type."\n");
        $printer -> text($order_menu[$i]['qty']." x ".$order_menu[$i]['name']."\n");
        $printer -> setTextSize(1, 1);
        try {
            $printer -> selectPrintMode(49);
        } catch (Exception $e) {
            $printer -> setEmphasis(true);
        }
        $printer -> text("Note : ".$order_menu[$i]['note']."\n");
        $printer -> setEmphasis(false);
        $printer -> selectPrintMode();
        $printer -> feed();
        $printer -> text(str_repeat('-', 32)."\n");
    }
    $printer -> setTextSize(1, 2);
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    ///////////////////////////////////////////////////
    $printer -> cut();
    $printer -> close();
}

function print_bank($info_printer, $data_debit, $data_credit){    
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> text("Detail Bank"."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    ///////////////////////////////////////////
    if($data_debit){
        $printer -> setJustification($printer::JUSTIFY_CENTER); 
        $printer -> setTextSize(1, 1);
        $printer -> text("DEBIT"."\n");
        $printer ->feed();
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        $string  = columnify("BANK", "TOTAL", "CHARGE", 10, 10, 10,1);
        $b = explode("\n", $string);
        for($i=0;$i<count($b)-1;$i++){
            $printer ->text($b[$i]."\n");
        }
        $t1=0;
        foreach ($data_debit as $key => $value) {
            $t1++;
            $credit = $value->total_bank_amount - $value->total_amount;
            $string  = columnify($value->bank_name, number_format($value->total_amount,0,",","."), number_format($credit,0,",","."), 10, 10, 10,1);
            $b = explode("\n", $string);
            for($i=0;$i<count($b)-1;$i++){
                $printer ->text($b[$i]."\n");
            }
        }    
        
        $printer -> text(str_repeat('-', 32)."\n");
        
    }
    // else{
    //     $printer -> setJustification($printer::JUSTIFY_CENTER); 
    //     $printer ->text("Debit Kosong"."\n"); 

    //     $printer -> text(str_repeat('-', 32)."\n");
    // }

    if($data_credit){
        $printer -> setJustification($printer::JUSTIFY_CENTER); 
        $printer -> text("CREDIT"."\n");
        $printer ->feed();
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        $string  = columnify("BANK", "TOTAL", "CHARGE", 10, 10, 10,1);
        $b = explode("\n", $string);
        for($i=0;$i<count($b)-1;$i++){
            $printer ->text($b[$i]."\n");
        }
        
        $t1=0;
        foreach ($data_credit as $key => $value) {
            $t1++;
            $credit = $value->total_bank_amount - $value->total_amount;
            $string  = columnify($value->bank_name, number_format($value->total_amount,0,",","."), number_format($credit,0,",","."), 10, 10, 10,1);
            $b = explode("\n", $string);
            for($i=0;$i<count($b)-1;$i++){
                $printer ->text($b[$i]."\n");
            }
        }    
        $printer -> text(str_repeat('-', 32)."\n");
    }
    // else{
    //     $printer -> setJustification($printer::JUSTIFY_CENTER); 
    //     $printer ->text("Credit Kosong"."\n"); 

    //     $printer -> text(str_repeat('-', 32)."\n");
    // }

    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> cut();
    $printer -> close();
}

function print_e_payment($info_printer, $data){    
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> text("Detail E Payment"."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text(str_repeat('-', 32)."\n");
        $printer ->feed();
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        $string  = columnify("Metode", "TOTAL","", 15, 15,0,1);
        $b = explode("\n", $string);
        for($i=0;$i<count($b)-1;$i++){
            $printer ->text($b[$i]."\n");
        }
        $t1=0;
        foreach ($data as $key => $value) {
            $t1++;
            $string  = columnify($value->e_payment_name, number_format($value->total_amount,0,",","."), "", 15, 15, 0,1);
            $b = explode("\n", $string);
            for($i=0;$i<count($b)-1;$i++){
                $printer ->text($b[$i]."\n");
            }
        }    
        
        $printer -> text(str_repeat('-', 32)."\n");
        
    

    $printer -> setJustification($printer::JUSTIFY_CENTER);
    $printer -> cut();
    $printer -> close();
}

function print_bill($info_printer, $cabang, $bill, $bill_barang = null, $bill_jasa = null, $nama = null)
{
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 

    $printer->initialize();
    $printer->setJustification($printer::JUSTIFY_CENTER);
    $printer->setTextSize(1, 2);
    $printer->text(wordwrap("SANGKAN HURIP", 30, "\n", true)."\n");
    $printer->setTextSize(1, 1);
    $printer->text(wordwrap($cabang->name, 30, "\n", true)."\n");
    $printer->text(wordwrap($cabang->address, 30, "\n", true)."\n");
    $printer->text(wordwrap("No.Telepon : ".$cabang->phone, 30, "\n", true)."\n");
    $printer->text(wordwrap("Whatsapp   : ".$cabang->whatsapp, 30, "\n", true)."\n");
    $printer->text(str_repeat('-', 32)."\n");

    $printer ->setTextSize(1, 2);
    $printer->selectPrintMode($printer::MODE_DOUBLE_HEIGHT); 
    $printer->setJustification($printer::JUSTIFY_CENTER);
    $printer->text("BILL\n");
        
    $printer->initialize();
    $printer->text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT);

    $printer->text("No Bill    : ".wordwrap($bill->kode_bill, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Waktu      : ".date('d-m-Y H:i:s')."\n");
    $printer->text("Nama       : ".wordwrap($bill->nama_pelanggan, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Plat       : ".wordwrap($bill->plat, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Montir     : ".wordwrap($bill->nama_montir, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text(str_repeat('-', 32)."\n");
        
    $printer->initialize(); 
     
    if(!empty($bill_barang)){
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        foreach($bill_barang as $data){
            $printer->text(buatBaris3Kolom($data->nama_produk, $data->qty ,number_format($data->harga)));
        }
    }

    if(!empty($bill_jasa)){
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        foreach($bill_jasa as $data){
            $printer->text(buatBaris3Kolom($data->nama_produk, $data->qty ,number_format($data->harga)));
        }
    }
    
    $printer->text(str_repeat(' ', 13).str_repeat('-', 19)."\n");

    $grand_total = $bill->total;
    $printer->text(str_repeat(' ', 8).str_pad("Harga Jual :", 9, " ", STR_PAD_LEFT));
    $printer->text(str_pad(number_format($bill->total), 12, " ", STR_PAD_LEFT)."\n");
    if(!empty(intval($bill->diskon))){
        $grand_total = intval($grand_total) - intval($bill->diskon);
        $printer->text(str_repeat(' ', 11).str_pad("Diskon :", 9, " ", STR_PAD_LEFT));
        $printer->text(str_pad(number_format($bill->diskon), 12, " ", STR_PAD_LEFT)."\n");
    }
    if(!empty(intval($bill->tukar_point))){
        $grand_total = intval($grand_total) - intval($bill->tukar_point);
        $printer->text(str_repeat(' ', 7).str_pad("Tukar Point :", 9, " ", STR_PAD_LEFT));
        $printer->text(str_pad(number_format($bill->tukar_point), 12, " ", STR_PAD_LEFT)."\n");
    }

    $printer->text(str_repeat(' ', 13).str_repeat('-', 19)."\n");
    $printer->text(str_repeat(' ', 11).str_pad("Total :", 9, " ", STR_PAD_LEFT));
    $printer->text(str_pad(number_format($grand_total), 12, " ", STR_PAD_LEFT)."\n");
    if(!empty(intval($bill->total_bayar))){
        $printer->text(str_repeat(' ', 11).str_pad("Tunai :", 9, " ", STR_PAD_LEFT));
        $printer->text(str_pad(number_format($bill->total_bayar), 12, " ", STR_PAD_LEFT)."\n");
    }

    if(!empty(intval($bill->total_debit))){
        $printer->text(str_repeat(' ', 11).str_pad("Debit :", 9, " ", STR_PAD_LEFT));
        $printer->text(str_pad(number_format($bill->total_debit), 12, " ", STR_PAD_LEFT)."\n");
    }

    if(!empty(intval($bill->total_credit))){
        $printer->text(str_repeat(' ', 11).str_pad("Credit :", 9, " ", STR_PAD_LEFT));
        $printer->text(str_pad(number_format($bill->total_credit), 12, " ", STR_PAD_LEFT)."\n");
    }

    $printer->text(str_repeat(' ', 11).str_pad("Kembali :", 9, " ", STR_PAD_LEFT));
    $printer->text(str_pad(number_format($bill->kembali), 12, " ", STR_PAD_LEFT)."\n");
    
    $printer->initialize();
    $printer->text(str_repeat('-', 32)."\n");
    $printer->setJustification($printer::JUSTIFY_CENTER);
    $printer->text("TERIMAKASIH \n");
    
    $printer ->feed(3);
    $printer ->cut();
    $printer ->pulse();
    $printer ->close();
}

function print_sementara($info_printer, $cabang, $order, $order_barang = null, $order_jasa = null)
{
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 

    $printer->initialize();
    $printer->setJustification($printer::JUSTIFY_CENTER);
    $printer->setTextSize(1, 2);
    $printer->text(wordwrap("SANGKAN HURIP", 30, "\n", true)."\n");
    $printer->setTextSize(1, 1);
    $printer->text(wordwrap($cabang->name, 30, "\n", true)."\n");
    $printer->text(wordwrap($cabang->address, 30, "\n", true)."\n");
    $printer->text(wordwrap("No.Telepon : ".$cabang->phone, 30, "\n", true)."\n");
    $printer->text(wordwrap("Whatsapp   : ".$cabang->whatsapp, 30, "\n", true)."\n");
    $printer->text(str_repeat('-', 32)."\n");

    $printer ->setTextSize(1, 2);
    $printer->selectPrintMode($printer::MODE_DOUBLE_HEIGHT); 
    $printer->setJustification($printer::JUSTIFY_CENTER);
    $printer->text("BILL SEMENTARA\n");
        
    $printer->initialize();
    $printer->text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT);

    $printer->text("No Order   : ".wordwrap($order->kode_order, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Waktu      : ".date('d-m-Y H:i:s')."\n");
    $printer->text("Nama       : ".wordwrap($order->nama_pelanggan, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Plat       : ".wordwrap($order->plat, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Montir     : ".wordwrap($order->nama_montir, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text(str_repeat('-', 32)."\n");
        
    $printer->initialize(); 
    
    if(!empty($order_barang)){
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        foreach($order_barang as $data){
            $printer->text(buatBaris3Kolom($data->nama_produk, $data->qty ,number_format($data->harga)));
        }
    }

    if(!empty($order_jasa)){
        $printer -> setJustification($printer::JUSTIFY_LEFT);
        foreach($order_jasa as $data){
            $printer->text(buatBaris3Kolom($data->nama_produk, $data->qty ,number_format($data->harga)));
        }
    }
    
    $printer->text(str_repeat(' ', 13).str_repeat('-', 19)."\n");
    $printer->text(str_repeat(' ', 11).str_pad("Total :", 9, " ", STR_PAD_LEFT));
    $printer->text(str_pad(number_format($order->total), 12, " ", STR_PAD_LEFT)."\n");
    
    $printer->initialize();
    $printer->text(str_repeat('-', 32)."\n");
    $printer->setJustification($printer::JUSTIFY_CENTER);
    $printer->text("TERIMAKASIH \n");
    
    $printer ->feed(3);
    $printer ->cut();
    $printer ->pulse();
    $printer ->close();
}

function print_struk($info_printer,$data){
    $now = new DateTime(null, new DateTimeZone('Asia/Jakarta'));
    $date = $now->format('d M Y');    
    $time = $now->format('H:i:s'); 
    $new_date = get_date_indo();
 
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setTextSize(1, 1);
    $printer -> text("DAFTAR PESANAN\n");
    $printer -> text("-------------------------------\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT); 
    $printer -> setTextSize(2, 2);
    $printer -> feed();
    //$printer -> text("Jam Order : ".$now."\n"); 

    for ($i=0; $i<count($data); $i++) {
        $printer -> setTextSize(2, 2);
        $printer -> text($data[$i]->jumlah." ".$data[$i]->barang_name);
        $printer -> feed();
        $printer -> setTextSize(1, 1);
        $printer -> feed();
        $printer -> text("Tgl    : ".$new_date['day']." ".$new_date['month_name']." ".$new_date['year']." "."\n");
        $printer -> text("Jam    : ".$new_date['time']."\n");
        $printer -> feed();
        try {
            $printer -> selectPrintMode(49);
        } catch (Exception $e) {
            $printer -> setEmphasis(true);
        }
        $printer -> setEmphasis(false);
        $printer -> selectPrintMode();
        $printer -> feed();
    }
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> text("-------------------------------\n");
    $printer -> feed(4);
    $printer -> cut();
    $printer -> close();

}

function print_close_kasir($info_printer, $cabang, $oc, $kc)
{
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 

    $printer->initialize();
    $printer->setJustification($printer::JUSTIFY_CENTER);
    $printer->setTextSize(1, 2);
    $printer->text(wordwrap("SANGKAN HURIP", 30, "\n", true)."\n");
    $printer->setTextSize(1, 1);
    $printer->text(wordwrap($cabang->name, 30, "\n", true)."\n");
    $printer->text(wordwrap($cabang->address, 30, "\n", true)."\n");
    $printer->text(wordwrap("No.Telepon : ".$cabang->phone, 30, "\n", true)."\n");
    $printer->text(wordwrap("Whatsapp   : ".$cabang->whatsapp, 30, "\n", true)."\n");
    $printer->text(str_repeat('-', 32)."\n");

    $printer ->setTextSize(1, 2);
    $printer->selectPrintMode($printer::MODE_DOUBLE_HEIGHT); 
    $printer->setJustification($printer::JUSTIFY_CENTER);
    $printer->text("Close Kasir\n");
        
    $printer->initialize();
    $printer->text(str_repeat('-', 32)."\n");
    $printer -> setJustification($printer::JUSTIFY_LEFT);

    $printer->text("Kode Close : ".wordwrap($oc->kode_open_close, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Open By    : ".wordwrap($oc->first_name, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Open At    : ".date('d-m-Y H:i:s', strtotime($oc->created_at))."\n");
    $printer->text("Close By   : ".wordwrap($oc->first_name, 19, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Close At   : ".date('d-m-Y H:i:s', strtotime($oc->updated_at))."\n");
    $printer->text(str_repeat('-', 32)."\n");
        
    $printer->initialize(); 
     
    $printer->text("Begin Balance : ".wordwrap(number_format($oc->begin_balance), 16, "\n".str_repeat(' ', 16), true)."\n\n");
    $printer->text("Rekap Pembayaran\n");
    $printer->text("Cash          : ".wordwrap(number_format($oc->total_cash), 16, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Debit         : ".wordwrap(number_format($oc->total_debit), 16, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Credit        : ".wordwrap(number_format($oc->total_kredit), 16, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Total         : ".wordwrap(number_format($oc->total_omset), 16, "\n".str_repeat(' ', 13), true)."\n\n");

    $printer->text("Rekap Omset\n");
    $printer->text("Jasa          : ".wordwrap(number_format($oc->total_jasa), 16, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Barang        : ".wordwrap(number_format($oc->total_barang), 16, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Total         : ".wordwrap(number_format($oc->total_omset), 16, "\n".str_repeat(' ', 13), true)."\n\n");

    $printer->text("Kas Kecil\n");
    $printer->text("Pemasukan     : ".wordwrap(number_format($kc["kas_kecil_pemasukan"]), 16, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Pengeluaran   : ".wordwrap(number_format($kc["kas_kecil_pengeluaran"]), 16, "\n".str_repeat(' ', 13), true)."\n\n");

    $total_kas_kecil = $kc["kas_kecil_pemasukan"] - $kc["kas_kecil_pengeluaran"];
    $nett = $oc->total_omset + $total_kas_kecil;

    $selisih = $oc->selisih;

    $printer->text("Nett          : ".wordwrap(number_format($nett), 16, "\n".str_repeat(' ', 13), true)."\n\n");

    $printer->text("Cash On Hand  : ".wordwrap(number_format($oc->cash_on_hand), 16, "\n".str_repeat(' ', 13), true)."\n");
    $printer->text("Selisih       : ".wordwrap(number_format($selisih), 16, "\n".str_repeat(' ', 13), true)."\n\n");
    
    $printer->initialize();
    $printer->text(str_repeat('-', 32)."\n");
    $printer->setJustification($printer::JUSTIFY_CENTER);
    // $printer->text("TERIMAKASIH \n");
    
    $printer ->feed(4);
    $printer ->cut();
    $printer ->pulse();
    $printer ->close();
}

function insert_space($left,$right){
    $str_left = strlen($left);
    $str_right = strlen($right);
    $space = 32 - ($str_left + $str_right);
    $space_add ="";

    $new_string = $left.str_repeat(' ', $space).$right;
    return $new_string;
}

function insert_space_temp($left,$right){
    $str_left = strlen($left);
    $str_right = strlen($right);
    $space = 25 - ($str_left + $str_right);
    $space_add ="";

    $new_string = $left.str_repeat(' ', $space).$right;
    return $new_string;
}

function insert_watermark($printer,$row){
    $string = array(
        "B|     ",
        "I|     ",
        "L|     ",
        "L|     ",
        " |     ",
        "S|     ",
        "E|     ",
        "M|     ",
        "E|     ",
        "N|     ",
        "T|     ",
        "A|     ",
        "R|     ",
        "A|     ",
        " |     ",
    );

    //Looping
    if($row >14){
        $row = $row % 15;
    }
    $printer -> setJustification($printer::JUSTIFY_LEFT);
    $printer ->setFont(0);
    $printer ->text($string[$row]);
    $printer ->setFont(1);
}

function insert_separator_temp($printer,$row){
    insert_watermark($printer,$row);
    $printer -> setJustification($printer::JUSTIFY_CENTER); 
    $printer -> setFont(0);
    $printer -> text(str_repeat('-', 25)."\n");
}

function columnify($col1, $leftCol, $rightCol ,$colwidth,$leftWidth, $rightWidth, $space)
{
    $leftWrapped = wordwrap($leftCol, $leftWidth, "\n", true);
    $rightWrapped = wordwrap($rightCol, $rightWidth, "\n", true);
    $colwrapped = wordwrap($col1, $colwidth, "\n", true);

    $leftLines = explode("\n", $leftWrapped);
    $rightLines = explode("\n", $rightWrapped);
    $colLines = explode("\n", $colwrapped);
    $allLines = array();
    for ($i = 0; $i < max(count($leftLines), count($rightLines)); $i ++) {
        $colPart = str_pad(isset($colLines[$i]) ? $colLines[$i] : "", $colwidth, " ");
        $leftPart = str_pad(isset($leftLines[$i]) ? $leftLines[$i] : "", $leftWidth, " ");
        $rightPart = str_pad(isset($rightLines[$i]) ? $rightLines[$i] : "", $rightWidth, " ");
        $allLines[] = $colPart.str_repeat(" ", $space) .$leftPart . str_repeat(" ", $space) . $rightPart;
    }
    return implode($allLines, "\n") . "\n";
}

function print_antrian($info_printer, $puskesmas, $nomor = null, $sisa = null)
{
    $printer = printerConnection($info_printer->printer_output,$info_printer->alias);
    $printer ->initialize(); 
    /* Text */
    $printer -> setJustification($printer::JUSTIFY_RIGHT); 
    $printer -> setTextSize(1, 2);
    // $printer -> text($info_open_close['sequence']."\n");
    $printer -> setJustification($printer::JUSTIFY_CENTER);
    // $printer -> setTextSize(1, 1);
    $printer -> text("NOMOR ANTRIAN PASIEN\n");
    $printer -> text(strtoupper($puskesmas)."\n\n");

    $printer -> setTextSize(3, 4);
    $printer -> text($nomor."\n");
    if(!empty($sisa)){
        $printer -> text("\n");
        $printer -> setTextSize(1, 1);
        $printer -> text("Menunggu ".$sisa." Antrian"."\n");
    }

    $printer ->feed(1);
    $printer ->cut();
    $printer ->close();

}

function buatBaris3Kolom($kolom1, $kolom2, $kolom3) 
{
    $lebar_kolom_1 = 17;
    $lebar_kolom_2 = 3;
    $lebar_kolom_3 = 10;

    $kolom1 = wordwrap($kolom1, $lebar_kolom_1, "\n", true);
    $kolom2 = wordwrap($kolom2, $lebar_kolom_2, "\n", true);
    $kolom3 = wordwrap($kolom3, $lebar_kolom_3, "\n", true);

    $kolom1Array = explode("\n", $kolom1);
    $kolom2Array = explode("\n", $kolom2);
    $kolom3Array = explode("\n", $kolom3);

    $jmlBarisTerbanyak = max(count($kolom1Array), count($kolom2Array), count($kolom3Array));

    $hasilBaris = array();

    for ($i = 0; $i < $jmlBarisTerbanyak; $i++) {

        $hasilKolom1 = str_pad((isset($kolom1Array[$i]) ? $kolom1Array[$i] : ""), $lebar_kolom_1, " ");
        $hasilKolom2 = str_pad((isset($kolom2Array[$i]) ? $kolom2Array[$i] : ""), $lebar_kolom_2, " ");

        $hasilKolom3 = str_pad((isset($kolom3Array[$i]) ? $kolom3Array[$i] : ""), $lebar_kolom_3, " ", STR_PAD_LEFT);

        $hasilBaris[] = $hasilKolom1 . " " . $hasilKolom2 . " " . $hasilKolom3;
    }

    return implode($hasilBaris, "\n");
}