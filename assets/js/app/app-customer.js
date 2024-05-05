define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "toastr",
    "select2"
    ], function (
    $,
    bootstrap,
    datatables,
    datatablesBootstrap,
    jqvalidate,
    toastr,
    select2
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
        initTable : function(){
            $('#pilih_pelanggan').select2({
                placeholder: 'Masukkan Nama atau Pilih Nama kamu',
                allowClear: true,
                tags: true
            });
  
            // Menambahkan event listener untuk menangkap saat opsi baru dipilih
            $('#pilih_pelanggan').on('select2:select', function (e) {
                var data = e.params.data;
  
                // Jika data yang dipilih adalah data baru (bukan yang ada dalam opsi)
                if (data.hasOwnProperty('id') && data.id === data.text) {
                    // Kirim data baru ke server untuk disimpan
                    console.log('baru', data.text)
                    console.log('baru id', data.id)
                    // $.post('save_data.php', { newData: data.text }, function(response) {
                    //     alert(response); // Tampilkan pesan balasan dari server
                    // });
                }
            });
          $('.btn-checkout').click(function (){
            $('.food_section').addClass('d-none');
            $('.book_section').removeClass('d-none');
          })
  
          $('#lihat-keranjang').click(function (event){
            event.preventDefault(); // Mencegah aksi default
            if ($('#shopping-cart').hasClass('d-none')) {
                $('.text-keranjang').text('Minimize Keranjang');
                $('#shopping-cart').removeClass('d-none');
            } else {
                $('.text-keranjang').text('Lihat Keranjang');
                $('#shopping-cart').addClass('d-none');
            }
          })
  
          $(".add-to-cart").click(function(event){
              event.preventDefault(); // Mencegah aksi default
              var badgeElement = $('.badge');
              // Memeriksa apakah elemen span dengan kelas "badge" kosong atau berisi angka
              var currentValue = parseInt(badgeElement.text().trim());
              if (isNaN(currentValue)) {
                  // Jika kosong, maka atur nilai 1
                  badgeElement.text('1');
              } else {
                  // Jika sudah berisi angka, tambahkan 1 ke nilai yang ada
                  badgeElement.text(currentValue + 1);
              }
  
              var productId = $(this).data('id');
              var productName = $(this).data('name');
              var productPrice = $(this).data('price');
      
              addToCart(productId, productName, productPrice)
          });
  
          function formatIDR(number) {
                  var formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
                  // Remove trailing ",00" if present
                  return formatted.replace(",00", "");
              } 
  
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
                                              "<td class='name'><input type='hidden' name='id_produk[]' value='"+productId+"'><input type='hidden' name='nama[]' value='"+productName+"'>" + productName + "</td>" +
                                              "<td class='price'>" + formattedPrice + "</td>" +
                                              "<td><input type='number' class='form-control quantity' name='quantity[]' value='1' min='1'></td>" +
                                              "<td><button class='btn btn-sm btn-danger btn-remove' data-id='" + productId + "'>Remove</button></td>" +
                                          "</tr>";
  
                      $("#cart-items").append(cartItemHtml);
                  }
  
                  // Update subtotal and total
                  updateCart();
              }
  
              $(document).on("click", ".btn-remove", function(event) {
                  event.preventDefault(); // Prevent default action
  
                  // Get quantity
                  var quantity = parseInt($(this).closest(".cart-item").find(".quantity").val());
                  console.log('quantity:', quantity);
  
                  // Check if quantity is a valid number
                  if (isNaN(quantity)) {
                      console.log("Quantity is not a valid number");
                      return; // Exit the function if quantity is not valid
                  }
  
                  // Calculate total
                  var total = quantity;
  
                  // Log total
                  console.log('total:', total);
  
                  // Update badge
                  var badgeElement = $('.badge');
                  var currentValue = parseInt(badgeElement.text().trim());
                  badgeElement.text(currentValue - total);
  
                  // Get product ID and remove from cart
                  var productId = $(this).data("id");
                  removeFromCart(productId);
              });
  
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
                  $("#total_pembayaran").val(formattedSubtotal);
  
                  // For now, total is the same as subtotal
                  $("#total").text(formattedSubtotal);
              }
  
  
              // Function to remove product from cart
              function removeFromCart(productId) {
                  $("#cart-items tr[data-id='" + productId + "']").remove();
                  updateCart();
              }
  
              // Function to clear the cart
              function clearCart() {
                  $("#cart-items").empty();
                  $('.badge').text('');
                  updateCart();
              }
  
              // Event listener for clear cart button
              $("#clear-cart").click(function() {
                  clearCart();
              });
  
              $('.btn-bayar').click(function () {
                var nama = $('#selectBox').val();
                $('#nama_pelanggan').val(nama);
                var form = $('#shopping-cart').serialize();
  
                
              })           
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
