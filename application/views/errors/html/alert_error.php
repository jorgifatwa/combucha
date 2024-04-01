<?php if(!empty($this->session->flashdata('message'))){?>
  <input type="hidden" name="display_alert_message" id="display_alert_message" value="<?php print_r($this->session->flashdata('message'));?>">
<?php }?>

<?php if(!empty($this->session->flashdata('message_error'))){?>
  <input type="hidden" name="display_alert_message_error" id="display_alert_message_error" value="<?php print_r($this->session->flashdata('message_error'));?>">
<?php }?>

<?php if(validation_errors()){?>
  <input type="hidden" name="display_alert_validation_errors" id="display_alert_validation_errors" value="<?php print_r(validation_errors());?>">
<?php }?>

<?php if(!empty($_GET['status'])){
  if($_GET['status']=='true'){?>
    <input type="hidden" name="display_alert_message_get_true" id="display_alert_message_get_true" value="<?php echo $_GET['message']?>">
  <?php }else{?>
    <input type="hidden" name="display_alert_message_get_false" id="display_alert_message_get_false" value="<?php echo $_GET['message']?>">
  <?php } ?>
<?php }?>