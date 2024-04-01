define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr"
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    jqvalidate,
    toastr
    ) {
    return {
        table:null,
        init: function () {
            App.initFunc();
            App.initTable();
            App.initValidation();
            App.initConfirm();
            App.initEvent();
            $(".loadingpage").hide();
        },
        initEvent : function(){

            function formatIDR(number) {
                var formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
                // Remove trailing ",00" if present
                return formatted.replace(",00", "");
            }
            
            $('#search-input').on('input', function() {
                var searchText = $(this).val().toLowerCase();
                $('.card').each(function() {
                    var productName = $(this).find('.card-title').text().toLowerCase();
                    if (productName.indexOf(searchText) === -1) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
            });

            $('.add-to-cart').on('click', function (e) {
                e.preventDefault();
                var productId = $(this).data('id');
                var productName = $(this).data('name');
                var productPrice = $(this).data('price');

                addToCart(productId, productName, productPrice)
            })

            function handleAddToCart() {
                $('#data-produk').on('click', '.add-to-cart', function(e) {
                    e.preventDefault();
                    var productId = $(this).data('id');
                    var productName = $(this).data('name');
                    var productPrice = $(this).data('price');
                    // var image = $(this).data('image');
                    
                    // Your add-to-cart logic here
                    addToCart(productId, productName, productPrice)
                    // console.log('Product added to cart:', id, name, price, image);
                });
            }

            $('#search-form').on('submit', function(e){
                e.preventDefault(); // Prevent form from submitting normally
                
                var formData = $(this).serialize(); // Serialize form data

                
                // Send AJAX request
                $.ajax({
                    type: 'POST',
                    url: $(this).attr('action'),
                    data: formData,
                    success: function(response) {
                        var data = JSON.parse(response);
                        var html = "";
                        for (let index = 0; index < data.length; index++) {
                            html += `<div class="col-md-4">
                                        <div class="card" style="width: 18rem; height: 28rem;">
                                          <img src="${App.baseUrl}uploads/produk/${data[index].gambar}" class="card-img-top" alt="${data[index].nama}">
                                          <div class="card-body">
                                            <div class="row">
                                              <div class="col-md-12">
                                                <h5 class="card-title">${data[index].nama}</h5>
                                                <p class="card-text text-secondary">${data[index].keterangan}</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="card-footer">
                                            <div class="row">
                                              <div class="col-md-4">
                                                <p>${formatIDR(data[index].harga)}</p>
                                              </div>
                                              <div class="col-md-8 text-right">
                                                <a href="#" class="btn btn-primary add-to-cart" data-id="${data[index].id}" data-name="${data[index].nama}" data-price="${data[index].harga}" data-image="${data[index].gambar}">Tambah</a>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>`;
                        } 
                        $('#data-produk').html(html);
                        handleAddToCart();
                    }
                });
                
            });

            $(document).on("change", ".quantity", function() {
                updateCart();
            });

            // Event listener for remove from cart button
            $(document).on("click", ".btn-remove", function() {
                var productId = $(this).data("id");
                removeFromCart(productId);
            });

            // Event listener for clear cart button
            $("#clear-cart").click(function() {
                clearCart();
            });

            // Function to add product to cart
            function addToCart(productId, productName, productPrice) {
                var existingItem = $("#cart-items tr[data-id='" + productId + "']");
                if (existingItem.length > 0) {
                    // If item exists, increment quantity
                    var quantityInput = existingItem.find(".quantity");
                    var quantity = parseInt(quantityInput.val());
                    quantityInput.val(quantity + 1);
                } else {
                    // If item does not exist, add new item to cart
                    var formattedPrice = formatIDR(productPrice); // Format price to IDR currency format
                    var cartItemHtml = "<tr class='cart-item' data-id='" + productId + "'>" +
                                            "<td class='name'>" + productName + "</td>" +
                                            "<td class='price'>" + formattedPrice + "</td>" +
                                            "<td><input type='number' class='form-control quantity' value='1' min='1'></td>" +
                                            "<td><button class='btn btn-sm btn-danger btn-remove' data-id='" + productId + "'>Remove</button></td>" +
                                        "</tr>";
                    $("#cart-items").append(cartItemHtml);
                }

                // Update subtotal and total
                updateCart();
            }


            // Function to update cart subtotal and total
            function updateCart() {
                var subtotal = 0;
                $("#cart-items tr").each(function() {
                    var price = parseFloat($(this).find(".price").text().replace("Rp", "").replace(/\./g, "").replace(",", "."));
                    var quantity = parseInt($(this).find(".quantity").val());
                    subtotal += price * quantity;
                });

                var formattedSubtotal = formatIDR(subtotal);
                $("#subtotal").text(formattedSubtotal);

                // For now, total is the same as subtotal
                $("#total").text(formattedSubtotal);
            }


            // Function to remove product from cart
            function removeFromCart(productId) {
                $("#cart-items tr[data-id='" + productId + "']").remove();
            }

            // Function to clear the cart
            function clearCart() {
                $("#cart-items").empty();
            }
            
        },
        initTable : function(){
            App.table = $('#table').DataTable({
                "language": {
                    "search": "Cari",
                    "lengthMenu": "Lihat _MENU_ data",
                    "zeroRecords": "Tidak ada data yang cocok ditemukan",
                    "info": "Menampilkan _START_ hingga _END_ dari _TOTAL_ data",
                    "infoEmpty": "Tidak ada data di dalam tabel",
                    "infoFiltered": "(cari dari _MAX_ total catatan)",
                    "loadingRecords": "Loading...",
                    "processing": "Processing...",
                    "paginate": {
                        "first":      "Pertama",
                        "last":       "Terakhir",
                        "next":       "Selanjutnya",
                        "previous":   "Sebelumnya"
                    },
                },
                "order": [[ 0, "asc" ]], //agar kolom id default di order secara desc
                "processing": true,
                "serverSide": true,
                "ajax":{
                    "url": App.baseUrl+"kategori_produk/dataList",
                    "dataType": "json",
                    "type": "POST",
                },
                "columns": [
                    { "data": "nama" },
                    { "data": "description" },
                    { "data": "action" ,"orderable": false}
                ]
            });
        },
        initValidation : function(){
            if($("#form").length > 0){
                $("#save-btn").removeAttr("disabled");
                $("#form").validate({
                    rules: {
                        name: {
                            required: true
                        },
                    },
                    messages: {
                        name: {
                            required: "Nama Harus Diisi"
                        },
                    },
                    debug:true,

                    errorPlacement: function(error, element) {
                        var name = element.attr('name');
                        var errorSelector = '.form-control-feedback[for="' + name + '"]';
                        var $element = $(errorSelector);
                        if ($element.length) {
                            $(errorSelector).html(error.html());
                        } else {
                            if ( element.prop( "type" ) === "select-one" ) {
                                error.appendTo(element.parent());
                            }else if ( element.prop( "type" ) === "select-multiple" ) {
                                error.appendTo(element.parent());
                            }else if ( element.prop( "type" ) === "checkbox" ) {
                                error.insertBefore( element.next( "label" ) );
                            }else if ( element.prop( "type" ) === "radio" ) {
                                error.insertBefore( element.parent().parent().parent());
                            }else if ( element.parent().attr('class') === "input-group" ) {
                                error.appendTo(element.parent().parent());
                            }else{
                                error.insertAfter(element);
                            }
                        }
                    },
                    submitHandler : function(form) {
                        form.submit();
                    }
                });
            }
        },
        initConfirm :function(){
            $('#table tbody').on( 'click', '.delete', function () {
                var url = $(this).attr("url");
                console.log(url);
                App.confirm("Apakah anda yakin untuk mengubah ini?",function(){
                   $.ajax({
                      method: "GET",
                      url: url
                    }).done(function( msg ) {
                        var data = JSON.parse(msg);
                        if (data.status == false) {
                            toastr.error(data.msg);
                        } else {
                            toastr.success(data.msg);
                            App.table.ajax.reload(null, true);
                        }
                    });
                })
            });
        }
	}
});
