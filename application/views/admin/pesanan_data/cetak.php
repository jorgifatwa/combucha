<style>
    table {
        border-collapse: collapse;
        width: 90%;
        margin: 0 auto;
    }

    th, td {
        border: 1px solid black;
        padding: 8px;
    }

    th {
        background-color: #f2f2f2;
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }
</style>
<center>
    <h1>Transaksi Penjualan</h1>
</center>
<table>
    <thead>
        <tr>
            <th style="background-color: #f2f2f2;">Tanggal Pesanan</th>
            <th style="background-color: #f2f2f2;">Produk</th>
            <th style="background-color: #f2f2f2;">Jumlah</th>
            <th style="background-color: #f2f2f2;">Sub Total</th>
        </tr>
    </thead>
    <tbody>
        <?php $total = 0; ?>
        <?php foreach ($data_pesanan as $order): ?>
            <?php 
                $subtotal = $order->jumlah * $order->harga_jual;
                $total += $subtotal;
            ?>
            <tr>
                <td><?php echo $order->created_at; ?></td>
                <td><?php echo $order->nama_produk; ?></td>
                <td><?php echo $order->jumlah; ?></td>
                <td><?php echo "Rp. ".number_format($subtotal); ?></td>
            </tr>
        <?php endforeach; ?>
        <tr>
            <td colspan="3">Total</td>
            <td><?php echo "Rp.".number_format($total) ?></td>
        </tr>
    </tbody>
</table>
