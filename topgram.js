(function($){

  var id = [];
  var i = 0;
  var top = [];

  $(".generate").on("click", function(){
    user = $(".username").val();
    $(".best9").empty();
    console.log(user);
    
    i = 0;
    top = [];

    getID(user);
  });

  function getID(user){
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      url: "https://api.instagram.com/v1/users/search?q=" + user + "&access_token=" + access_token,
      cache: true,
      success: function(data) {
        userid = data.data[0].id;
        getInstagram();
      }
    });
  }

  function getInstagram() {
    url = "https://api.instagram.com/v1/users/" + userid + "/media/recent/?access_token=" + access_token;

    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: true,
      url: url,
      success: function(data) {
        _.each(data.data, function(d){
          createdDate = new Date(Number(d.created_time) * 1000);
          createdYear = createdDate.getFullYear();

          if (createdYear == 2015) {
            top.push(d);
          }
        });
        i++;
        
        createdDate = new Date(Number(data.data[data.data.length - 1].created_time) * 1000);
        createdYear = createdDate.getFullYear();
        if (data.pagination.next_url) {
          getMore(data.pagination.next_url);
        }
      }
    });
  }

  var containerW = $("body").width();
  var imgW = containerW / 3;
  var imgX = 0;
  var imgY = 0;
  function findTop() {
    top = _.sortBy(top, function(d){
      return d.likes.count;
    });
    top.reverse();
    top = top.slice(0,9);

    _.each(top, function(t, i){
      var c = document.getElementById("thingy");
      var ctx = c.getContext("2d");
      ctx.canvas.width = containerW;
      ctx.canvas.height = containerW;

      var img = new Image();
      img.onload = function() {
        if ((i%3) === 0 && i !== 0) {
          imgY += imgW;
          imgX = 0;
        }
        console.log(imgX, imgY);
        ctx.drawImage(img, imgX, imgY, imgW, imgW);
      };
      img.src = t.images.standard_resolution.url;
      imgX += imgW;
    });
  }

  var newResults;
  function getMore(nextpage) {
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: true,
      url: nextpage,
      success: function(data) {
        _.each(data.data, function(d){
          createdDate = new Date(Number(d.created_time) * 1000);
          createdYear = createdDate.getFullYear();

          // if (createdYear == 2015) {
            top.push(d);
          // }
        });
        i++;
        console.log("Page " + i);
        
        createdDate = new Date(Number(data.data[data.data.length - 1].created_time) * 1000);
        createdYear = createdDate.getFullYear();
        if (data.pagination.next_url) {
          getMore(data.pagination.next_url);
        } else {
          findTop();
          return;
        }
      }
    });
  }

})(jQuery);