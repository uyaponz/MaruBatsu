$(document).ready(function() {

    // ○×の画像
    var $img_maru = $("#img-maru").clone().removeAttr("id");
    var $img_batsu = $("#img-batsu").clone().removeAttr("id");

    var cnt = 0; // ○×選択総数

    var myTurn = window.turn; // 先攻or後攻
    $("#title").text($("#title").text() + "（" + ((myTurn == 0) ? "先攻" : "後攻") + "）")
    var prevStatus = JSON.parse($.ajax({ url: "/get", async: false }).responseText);

    // ○×を回転させる処理
    function rotateMaruBatsu($obj) {
        $obj
        .css("rotationCounter", 0)
        .animate(
            { rotationCounter:1 },
            {
                duration: 1000,
                step: function(now) {
                    $(this)
                    .css("opacity", now)
                    .css("transform", "scale(" + (now * 2 - 1) + "," + 1 + ")");
                },
                complete: function() {
                    // 勝ち負け判定処理
                    checkWinner();
                }
            }
        );
    }

    // 全部のマスのイベントを解除する
    function removeBoxEvent() {
        for (var k=1; k<=9; ++k) {
            $("#box" + k).off();
        }
    }

    // 全部のマスにイベントを割り当てる
    function setBoxEvent() {
        for (var i=1; i<=9; ++i) {
            (function(i) {
                $("#box" + i).on("click rivalClick", function(e) {
                    if (cnt % 2 == myTurn || e["type"] == "rivalClick") {
                        removeBoxEvent(); // クリックされたらイベント解除しておく
                        if ($(this).attr("checkmark") != undefined) {
                            alert("すでに選択済みです！");
                            setBoxEvent();
                        } else {
                            cnt += 1;
                            if (cnt % 2 == 0) {
                                $(this).attr("checkmark", "×");
                                var $appendImage = $img_batsu.clone();
                                rotateMaruBatsu($appendImage);
                                $(this).append($appendImage);
                            } else {
                                $(this).attr("checkmark", "○");
                                var $appendImage = $img_maru.clone();
                                rotateMaruBatsu($appendImage);
                                $(this).append($appendImage);
                            }
                            var x = ((i - 1) / 3) | 0;
                            var y = (i - 1) % 3;
                            $.ajax({ url: "/put/" + x + "/" + y + "/1", async: false });
                            prevStatus[i - 1] = 1;
                        }
                    }
                });
            })(i);
        }
    }

    // そろっているかどうかの判定処理
    //
    // 勝ち負け・・・随時
    // 引き分け・・・cnt == 9 のとき
    //
    // 1 2 3
    // 4 5 6
    // 7 8 9
    //
    // - - -  | | |      ／  ＼
    // - - -  | | |    ／      ＼
    // - - -  | | |  ／          ＼
    function getWinner() {
        // ヨコ
        for (var j=1; j<=7; j+=3) {
            if ($("#box" + j).attr("checkmark") != undefined &&
                $("#box" + j).attr("checkmark") == $("#box" + (j + 1)).attr("checkmark") &&
                $("#box" + j).attr("checkmark") == $("#box" + (j + 2)).attr("checkmark"))
            {
                return $("#box" + j).attr("checkmark");
            }
        }

        // タテ
        for (var j=1; j<=3; j+=1) {
            if ($("#box" + j).attr("checkmark") != undefined &&
                $("#box" + j).attr("checkmark") == $("#box" + (j + 3)).attr("checkmark") &&
                $("#box" + j).attr("checkmark") == $("#box" + (j + 6)).attr("checkmark"))
            {
                return $("#box" + j).attr("checkmark");
            }
        }

        // ナナメ（／）
        if ($("#box3").attr("checkmark") != undefined &&
            $("#box3").attr("checkmark") == $("#box5").attr("checkmark") &&
            $("#box3").attr("checkmark") == $("#box7").attr("checkmark"))
        {
            return $("#box3").attr("checkmark");
        }

        // ナナメ（＼）
        if ($("#box1").attr("checkmark") != undefined &&
            $("#box1").attr("checkmark") == $("#box5").attr("checkmark") &&
            $("#box1").attr("checkmark") == $("#box9").attr("checkmark"))
        {
            return $("#box3").attr("checkmark");
        }

        // 引き分け表示
        // 勝敗が決まっていない かつ すべてのマスに○×配置済み
        if (cnt == 9) {
            return "draw";
        }

        return null;
    }

    // 勝者チェック
    function checkWinner() {
        var result = getWinner();
        if (result == "draw") {
            alert("引き分け。。。");
            removeBoxEvent();
        } else if (result != null) {
            alert(result + "の勝ち！");
            removeBoxEvent();
        } else {
            setBoxEvent();
        }
    }

    // クリアボタンでリロードする
    $("#clear").on("click", function() {
        $.ajax({ url: "/reset", async: false });
        location.reload();
    });

    // マスにイベント割り当て
    setBoxEvent();

    // ポーリング
    setInterval(function() {
        var status = JSON.parse($.ajax({ url: "/get", async: false }).responseText);
        for (var i=0; i<9; i++) {
            if (status[i] !== prevStatus[i]) {
                if ($("#box" + (i + 1)).attr("checkmark") == undefined) {
                    $("#box" + (i + 1)).trigger("rivalClick");
                }
                break;
            }
        }
        prevStatus = status;
    }, 1000);

});
