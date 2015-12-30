(function($){
  var current_url;
  function authenticate() {
    current_url = document.URL;
    window.location = "https://instagram.com/oauth/authorize/?client_id=0aebae4494a44f47a29f33de378a31e3&redirect_uri=http://localhost:8000/success&response_type=token";
  }

  $(document).ready(function(){
    $('.login').click(function(){
      authenticate();
    });
  });
})(jQuery);