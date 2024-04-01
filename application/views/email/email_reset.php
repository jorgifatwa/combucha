<!DOCTYPE html>
<html lang="en">
    <head>
		<title>Email</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body>
		<div style="width:700px;display: block;padding:30px 20px;background:#f0eff4;box-sizing: border-box;">
			<div style="background:#fff;width:100%;display: block;padding:15px 20px;box-sizing: border-box;border-bottom: 7px solid #3269c6;">
				<div style="width:100%;display: block;padding:0 15px 15px;border-bottom: 1px solid #3269c6;box-sizing: border-box;">
					<img src="<?php echo base_url()?>/assets/img/logo2.png" style="width:80px;">
				</div>
				<div style="width: 100%;display: block;padding:30px 15px;box-sizing: border-box;">
					<p style="color:#999;">Dear <?php echo $users->first_name?>,</p>
					<p style="color: #999;">Your Account Was Reset, details as follows</p>
					<div style="display: table;width:80%;">
						<table style="width: 100%;border-collapse: collapse;border:0;">
							<tr>
								<td style="border-top:0;border-left:0;border-right:1px solid #ccc;border-bottom:1px solid #ccc;padding:10px 0;">
									<p style="font-size: 12px;font-weight: bold;margin:0 0 3px;">Email</p>
									<p style="font-size: 14px;color: #999;margin:0"><?php echo $users->email?></p>
								</td>
								<!-- <td style="border-top:0;border-left:0;border-right:1px solid #ccc;border-bottom:1px solid #ccc;padding:10px;">
									<p style="font-size: 12px;font-weight: bold;margin:0 0 3px;">Password</p>
									<p style="font-size: 14px;color: #999;margin:0"><?php echo $password?></p>
								</td> -->
								<td style="border-top:0;border-left:0;border-right:0;border-bottom:1px solid #ccc;padding:10px;">
									<?php
										if(isset($change_data['pin'])){
											?>
											<p style="font-size: 12px;font-weight: bold;margin:0 0 3px;">PIN</p>
											<p style="font-size: 14px;color: #999;margin:0"><?php echo $change_data['pin']?></p>
									<?php
										}
										if(isset($change_data['password'])){
											?>
											<p style="font-size: 12px;font-weight: bold;margin:0 0 3px;">Password</p>
											<p style="font-size: 14px;color: #999;margin:0"><?php echo $change_data['password']?></p>
										
									<?php
										}
									?>
								</td>
							</tr>
						</table>
					</div>
					<p style="color: #999;">Please aknowledge using admin system</p>
				</div>
			</div>
		</div>
	</body>
</html>