$(function(){
    /*可以使用下面的两个语句来实现loading动画的显示和隐藏*/
    $("#sk-three-bounce").show();
    $(document).ready(function () {
        setTimeout(function () {
            $("#sk-three-bounce").hide();
        }, 200);
        // $("#sk-three-bounce").hide();
    });
    $('.anran-btn').click(function() {
        const str = 'anran-title-' + $(this).attr('id').split('-')[1]
        const element = document.getElementById(str).parentNode.parentNode.parentNode.parentNode;
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
    })
    $('.anran-back-top').click(function() {
        const element = document.getElementById("quanju");
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
    })
});
