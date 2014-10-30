$(document).ready(function() {

    // ○×の画像
    var $img_maru = $("#img-maru").clone().removeAttr("id");
    var $img_batsu = $("#img-batsu").clone().removeAttr("id");

    var cnt = 0; // ○×選択総数

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
                    $(this).css("rotationCounter", 0);
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
        }
    }

    // クリアボタンでリロードする
    $("#clear").on("click", function() {
        location.reload();
    });

    for (var i=1; i<=9; ++i) {
        (function(i) {
            $("#box" + i).on("click", function() {
                if ($(this).attr("checkmark") != undefined) {
                    alert("すでに選択済みです！");
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
                }

                // 勝ち負け判定処理
                checkWinner();
            });
        })(i);
    }

});
