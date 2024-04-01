define([
    "jQuery",
    "bootstrap",
    "datatables",
    "datatablesBootstrap",
    "jqvalidate",
    "jqueryqueue",
    "select2",
], function(
    $,
    jQuery,
    bootstrap,
    datatables,
    datatablesBootstrap,
    jqvalidate,
    jqueryqueue,
    select2
) {
    return {
        init: function() {
            var counter,
                totalget,
                totalinsert,
                totalfailinsert,
                totalfailget,
                totalsuccessinsert,
                totalsuccessget,
                totalall;
            App.initFunc();
            App.initEvent();
            App.clickSyncDownload();
            App.clickSyncUpload();
            //App.addProgressBar()
            App.buttonDetail();
            console.log("loaded");
            $(".loading").hide();
        },
        initEvent: function() {
            App.counter = 0;
            $('#location_id').select2({
                width: "100%",
                placeholder: "Pilih Lokasi",
            });
        },
        buttonDetail: function() {
            $("#btn-detail").on("click", function() {
                $("#container_detail").toggle();
            });
        },
        countProgressBar: function() {
            var now = parseInt($("#progress_value").val());
            if (now == App.counter) {
                $("#progress_value").val(0);
                now = 0;
            }
            $("#progress_value").val(now + 1);
            App.addProgressBar(now + 1);
        },
        resetprogressBar: function() {
            var elem = document.getElementById("progress_bar");
            elem.style.width = 0;
            $("#progress_text").text("Wait To Sync");
        },
        addProgressBar: function(counter) {
            var elem = document.getElementById("progress_bar");
            width = (counter / App.counter) * 100;
            var id = setInterval(frame, 1);

            function frame() {
                if (width >= 100) {
                    elem.style.width = 100 + "%";
                    $("#progress_text").text(100 + "% Complete");
                    clearInterval(id);
                    $("#modal_progress_bar").modal("hide");
                    $("body div").removeClass("page-overlay");
                    var Success =
                        parseInt(App.totalsuccessinsert) + parseInt(App.totalsuccessget);
                    var Failed =
                        parseInt(App.totalfailinsert) + parseInt(App.totalfailget);
                    $("#p-success").text(": " + Success);
                    $("#p-fail").text(": " + Failed);
                    $("#container_detail").toggle();

                    $("#modal_progress").modal("show");
                } else {
                    elem.style.width = width + "%";
                    $("#progress_text").text(width.toFixed(2) + "% Complete");
                }
            }
        },
        clickSyncDownload: function() {
            $("#btn-sync").on("click", function() {
                console.log('masuk');
                App.counter = 0;
                $("#progress_value").val(0);
                App.resetprogressBar();
                location_id = $("#location_id").val();  
                if (location_id != "" && location_id != null) {
                    $("#container_detail").empty();
                    App.totalsuccessinsert = 0;
                    App.totalfailinsert = 0;
                    App.totalsuccessget = 0;
                    App.totalfailget = 0;
                    $.ajax({
                            method: "GET",
                            url: App.cloudUrl + "/api/location/locations",
                            data: { location_id: $("#location_id").val() },
                        })
                        .done(function(jqXHR) {
                            if (jqXHR.status == true) {
                                data = jqXHR.data[0];
                                $("#location_id").val(data.id);
                                if (!data.id || data.id == 0) {
                                    App.alert("Location Unregistered");
                                } else {
                                    html = '<div class="page-overlay"></div>';
                                    $("body").append(html);
                                    App.sync();
                                    //$('#modal_progress').modal('show');
                                    $("#modal_progress_bar").modal("show");
                                }
                            } else {
                                App.alert("Invalid Location or Cloud Address");
                            }
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            App.alert(errorThrown);
                        });
                } else {
                    App.alert("Location is Empty");
                }
            });
        },

        clickSyncUpload: function() {
            $("#btn-sync-upload").on("click", function() {
                App.counter = 0;
                $("#progress_value").val(0);
                App.resetprogressBar();
                $("#btn-sync-upload").attr("disabled", true);
                location_id = $("#location_id").val();
                if (location_id != "" && location_id != null) {
                    $("#container_detail").empty();
                    App.totalsuccessinsert = 0;
                    App.totalfailinsert = 0;
                    App.totalsuccessget = 0;
                    App.totalfailget = 0;
                    $.ajaxQueue({
                            method: "GET",
                            url: App.baseUrl + "api/location/locations",
                            data: { location_id: $("#location_id").val() },
                        })
                        .done(function(jqXHR) {
                            $("#btn-sync-upload").attr("disabled", false);
                            if (jqXHR.status == true) {
                                data = jqXHR.data[0];
                                html = '<div class="page-overlay"></div>';
                                $("body").append(html);
                                App.syncUpload();
                                $("#modal_progress_bar").modal("show");
                            } else {
                                $("#btn-sync-upload").attr("disabled", false);
                                App.alert("Invalid Location");
                            }
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            App.alert(errorThrown);
                            $("#btn-sync-upload").attr("disabled", false);
                        });
                } else {
                    App.alert("Location is Empty");
                    $("#btn-sync-upload").attr("disabled", false);
                }
            });
        },
        sync: function() {
            App.syncMaterial();

            App.syncStandarParameter();

            App.syncSite();

            App.syncPit();

            App.syncSeam();

            App.syncBlok();

            App.syncDisposal();

            App.syncKategori();

            App.syncBrand();

            App.syncModel();

            App.syncUnit();

            App.syncTransferUnit();

            App.insertHistory_sync(1);
            //

            /*
             */
        },

        getSyncData: function(url_get, url_insert, data = null, object_string) {
            $.ajaxQueue({
                    method: "GET",
                    url: url_get,
                    data: data,
                })
                .done(function(jqXHR) {
                    if (jqXHR.status == true) {
                        $("#container_detail").append(
                            "<p class='marbot-0 p-success'>Success Get data " +
                            object_string +
                            " From Server</p>"
                        );
                        App.totalsuccessget++;
                        var now = parseInt($("#progress_value").val());
                        $("#progress_value").val(now + 1);
                        App.counter = now + 1;
                        //console.log($('#progress_value').val())
                        App.insertSyncData(url_insert, jqXHR.data, object_string);
                    } else {
                        //$('#container_detail').append("<p class='marbot-0 p-failed'>Data "+object_string+" From Server return Empty</p>");
                    }
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    //App.alert(errorThrown);
                    App.totalfailget++;
                    $("#container_detail").append(
                        "<p class='marbot-0 p-failed'>Error To Get data " +
                        object_string +
                        " From Server, " +
                        errorThrown +
                        "</p>"
                    );
                });
        },

        insertSyncData: function(url, data, object_string) {
            $.ajaxQueue({
                    method: "POST",
                    url: url,
                    data: { batch_data: data },
                })
                .done(function(jqXHR) {
                    if (jqXHR.status == true) {
                        App.totalsuccessinsert++;
                        $("#container_detail").append(
                            "<p class='marbot-0 p-success'>Success Sync " +
                            object_string +
                            " into Database</p>"
                        );
                    } else {
                        $("#container_detail").append(
                            "<p class='marbot-0 p-failed'>Failed Sync " +
                            object_string +
                            " into Database</p>"
                        );
                        //App.alert(jqXHR.message)
                    }
                    var now = parseInt($("#progress_value").val());
                    if (now == App.counter) {
                        $("#progress_value").val(0);
                        now = 0;
                    }
                    $("#progress_value").val(now + 1);
                    App.addProgressBar(now + 1);
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    App.totalfailinsert++;
                    $("#container_detail").append(
                        "<p class='marbot-0 p-failed'>Error To Insert data " +
                        object_string +
                        " to Server, " +
                        errorThrown +
                        "</p>"
                    );
                    var now = parseInt($("#progress_value").val());
                    if (now == App.counter) {
                        $("#progress_value").val(0);
                        now = 0;
                    }
                    $("#progress_value").val(now + 1);
                    App.addProgressBar(now + 1);
                    //App.alert(errorThrown);
                });
        },

        Sycn_local: function(data, url) {
            $
                .ajaxQueue({
                    method: "POST",
                    url: url,
                    data: { data: data },
                })
                .done(function(jqXHR) {})
                .fail(function(jqXHR, textStatus, errorThrown) {});
        },

        // getSyncDataUpload: function(
        //     url_get,
        //     url_insert,
        //     data = null,
        //     object_string,
        //     url_confirm_sync = null
        // ) {
        //     $
        //         .ajaxQueue({
        //             method: "GET",
        //             url: url_get,
        //             data: data,
        //         })
        //         .done(function(jqXHR) {
        //             if (jqXHR.status == true) {
        //                 $("#container_detail").append(
        //                     "<p class='marbot-0 p-success'>Success Get data " +
        //                     object_string +
        //                     " From Server</p>"
        //                 );
        //                 App.totalsuccessget++;
        //                 var now = parseInt($("#progress_value").val());
        //                 $("#progress_value").val(now + 1);
        //                 App.counter = now + 1;
        //                 App.insertSyncDataUpload(
        //                     url_insert,
        //                     jqXHR.data,
        //                     object_string,
        //                     data.outlet_id,
        //                     url_confirm_sync
        //                 );
        //             } else {
        //                 //$('#container_detail').append("<p class='marbot-0 p-failed'>Data "+object_string+" From Server return Empty</p>");
        //             }
        //         })
        //         .fail(function(jqXHR, textStatus, errorThrown) {
        //             App.totalfailget++;
        //             $("#container_detail").append(
        //                 "<p class='marbot-0 p-failed'>Error To Get data " +
        //                 object_string +
        //                 " From Server, " +
        //                 errorThrown +
        //                 "</p>"
        //             );
        //         });
        // },

        insertSyncDataUpload: function(
            url,
            data,
            object_string,
            location_id,
            url_confirm_sync = null
            ) {
            $
                .ajaxQueue({
                    method: "POST",
                    url: url,
                    data: {
                        batch_data: data,
                        location_id: $("#location_id").val(),
                    },
                })
                .done(function(jqXHR) {
                    console.log("konfirm", url);
                    if (url_confirm_sync != null) {
                        App.Sycn_local(jqXHR.data, url_confirm_sync);
                    }
                    if (jqXHR.status == true) {
                        var now = parseInt($("#progress_value").val());
                        $("#container_detail").append(
                            "<p class='marbot-0 p-success'>Success Sync " +
                            object_string +
                            " into Database</p>"
                        );
                        App.totalsuccessinsert++;
                    } else {
                        $("#container_detail").append(
                            "<p class='marbot-0 p-failed'>Failed Sync " +
                            object_string +
                            " into Database</p>"
                        );
                        //App.alert(jqXHR.message)
                    }
                    if (now == App.counter) {
                        $("#progress_value").val(0);
                        now = 0;
                    }
                    $("#progress_value").val(now + 1);
                    App.addProgressBar(now + 1);
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    $("#container_detail").append(
                        "<p class='marbot-0 p-failed'>Error To Insert data " +
                        object_string +
                        " to Server, " +
                        errorThrown +
                        "</p>"
                    );
                    App.totalfailinsert++;
                    var now = parseInt($("#progress_value").val());
                    if (now == App.counter) {
                        $("#progress_value").val(0);
                        now = 0;
                    }
                    $("#progress_value").val(now + 1);
                    App.addProgressBar(now + 1);
                    //App.alert(errorThrown);
                });
        },
        // config sync download
        syncMaterial: function() {
            url_get = App.cloudUrl + "api/material/json_materials";
            url_insert = App.baseUrl + "api/material/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Material";
            App.getSyncData(url_get, url_insert, data, object_string);
        },
        syncStandarParameter: function() {
            url_get = App.cloudUrl + "api/standar_parameter/json_standar_parameters";
            url_insert = App.baseUrl + "api/standar_parameter/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Standar Parameter";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        syncSite: function() {
            url_get = App.cloudUrl + "api/location/json_locations";
            url_insert = App.baseUrl + "api/location/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Site";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        syncPit: function() {
            url_get = App.cloudUrl + "api/pit/json_pits";
            url_insert = App.baseUrl + "api/pit/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Pit";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        syncSeam: function() {
            url_get = App.cloudUrl + "api/seam/json_seams";
            url_insert = App.baseUrl + "api/seam/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Seam";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        syncBlok: function() {
            url_get = App.cloudUrl + "api/blok/json_bloks";
            url_insert = App.baseUrl + "api/blok/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Blok";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        syncDisposal: function() {
            url_get = App.cloudUrl + "api/disposal/json_disposals";
            url_insert = App.baseUrl + "api/disposal/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Disposal";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        syncKategori: function() {
            url_get = App.cloudUrl + "api/unit_category/json_unit_categories";
            url_insert = App.baseUrl + "api/unit_category/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Unit Kategori";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        syncBrand: function() {
            url_get = App.cloudUrl + "api/unit_brand/json_unit_brands";
            url_insert = App.baseUrl + "api/unit_brand/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Unit Brand";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        syncModel: function() {
            url_get = App.cloudUrl + "api/unit_model/json_unit_models";
            url_insert = App.baseUrl + "api/unit_model/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Unit Model";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        syncUnit: function() {
            url_get = App.cloudUrl + "api/unit/json_units";
            url_insert = App.baseUrl + "api/unit/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Unit";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        syncTransferUnit: function() {
            url_get = App.cloudUrl + "api/unit_transfer/json_unit_transfers";
            url_insert = App.baseUrl + "api/unit_transfer/create_batch";
            data = { location_id: $("#location_id").val() };
            object_string = "Unit Transfer";
            App.getSyncData(url_get, url_insert, data, object_string);
        },

        //end of sync download

        //start of sync upload

        syncUpload: function() {
            App.syncObActual();
            App.syncCoalActual();
            App.syncCoalInventory();
            App.insertHistory_sync(2);
        },

        //sync material to server
        syncObActual: function() {
            var url_get = App.baseUrl + "api/ob_actual/new_syncOb_Actual";
            var url_insert = App.cloudUrl + "api/ob_actual/sync_data";
            var url_confirm_sync = App.baseUrl + "api/ob_actual/new_set_sync";
            var data = {
                location_id: $("#location_id").val(),
                has_sync: 0,
                do_update: 1,
            };
            var object_string = "OB Actual";
            $
                .ajaxQueue({
                    method: "GET",
                    url: url_get,
                    data: data,
                })
                .done(function(jqXHR) {
                    var now = parseInt($("#progress_value").val());
                    $("#progress_value").val(now + 1);
                    App.counter = now + 1;
                    if (jqXHR.status == true) {
                        $("#container_detail").append(
                            "<p class='marbot-0 p-success'>Success Get data " +
                            object_string +
                            " From Server</p>"
                        );
                        App.totalsuccessget++;
                        console.log('insert', url_insert);
                        console.log('insert', url_confirm_sync);
                        App.insertSyncDataUpload(
                            url_insert,
                            jqXHR.data,
                            object_string,
                            data.location_id,
                            url_confirm_sync
                        );
                    } else {
                        App.countProgressBar();
                    }
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    App.totalfailget++;
                    $("#container_detail").append(
                        "<p class='marbot-0 p-failed'>Error To Get data " +
                        object_string +
                        " From Server, " +
                        errorThrown +
                        "</p>"
                    );
                });
        },

        syncCoalInventory: function() {
            var url_get = App.baseUrl + "api/coal_inventory/new_syncCoal_inventory";
            var url_insert = App.cloudUrl + "api/coal_inventory/sync_data";
            var url_confirm_sync = App.baseUrl + "api/coal_inventory/new_set_sync";
            var data = {
                location_id: $("#location_id").val(),
                has_sync: 0,
                do_update: 1,
            };
            var object_string = "Coal Inventory";
            $
                .ajaxQueue({
                    method: "GET",
                    url: url_get,
                    data: data,
                })
                .done(function(jqXHR) {
                    var now = parseInt($("#progress_value").val());
                    $("#progress_value").val(now + 1);
                    App.counter = now + 1;
                    if (jqXHR.status == true) {
                        $("#container_detail").append(
                            "<p class='marbot-0 p-success'>Success Get data " +
                            object_string +
                            " From Server</p>"
                        );
                        App.totalsuccessget++;
                        console.log('insert', url_insert);
                        console.log('insert', url_confirm_sync);
                        App.insertSyncDataUpload(
                            url_insert,
                            jqXHR.data,
                            object_string,
                            data.location_id,
                            url_confirm_sync
                        );
                    } else {
                        App.countProgressBar();
                    }
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    App.totalfailget++;
                    $("#container_detail").append(
                        "<p class='marbot-0 p-failed'>Error To Get data " +
                        object_string +
                        " From Server, " +
                        errorThrown +
                        "</p>"
                    );
                });
        },

        syncCoalActual: function() {
            var url_get = App.baseUrl + "api/coal_actual/new_syncCoal_actual";
            var url_insert = App.cloudUrl + "api/coal_actual/sync_data";
            var url_confirm_sync = App.baseUrl + "api/coal_actual/new_set_sync";
            var data = {
                location_id: $("#location_id").val(),
                has_sync: 0,
                do_update: 1,
            };
            var object_string = "Coal Actual";
            $
                .ajaxQueue({
                    method: "GET",
                    url: url_get,
                    data: data,
                })
                .done(function(jqXHR) {
                    var now = parseInt($("#progress_value").val());
                    $("#progress_value").val(now + 1);
                    App.counter = now + 1;
                    if (jqXHR.status == true) {
                        $("#container_detail").append(
                            "<p class='marbot-0 p-success'>Success Get data " +
                            object_string +
                            " From Server</p>"
                        );
                        App.totalsuccessget++;
                        console.log('insert', url_insert);
                        console.log('insert', url_confirm_sync);
                        App.insertSyncDataUpload(
                            url_insert,
                            jqXHR.data,
                            object_string,
                            data.location_id,
                            url_confirm_sync
                        );
                    } else {
                        App.countProgressBar();
                    }
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    App.totalfailget++;
                    $("#container_detail").append(
                        "<p class='marbot-0 p-failed'>Error To Get data " +
                        object_string +
                        " From Server, " +
                        errorThrown +
                        "</p>"
                    );
                });
        },

        //end of sync upload

        insertHistory_sync: function(type) {
            //$('#container_detail').append("<p class='marbot-0'>Sync Voucher into Database</p>")
            $
                .ajaxQueue({
                    method: "POST",
                    url: App.baseUrl + "api/history_sync/create",
                    data: { type: type },
                })
                .done(function(jqXHR) {
                    var now = parseInt($("#progress_value").val());
                    if (jqXHR.status == true) {
                        App.totalall++;
                        data = jqXHR.data;
                        if (data.sync_type == 1) {
                            $("#status_text_download").text(data.sync_date);
                        } else {
                            $("#progress_value").val(now + 1);
                            App.addProgressBar(now + 1);
                            $("#status_text_upload").text(data.sync_date);
                        }
                    } else {
                        App.alert(jqXHR.message);
                    }
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    App.alert(errorThrown);
                });
        },
    };
});
