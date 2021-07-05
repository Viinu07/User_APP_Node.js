$('#add_user').submit(function (event) {
  alert('Data added successfuly');
});

$('#login_user').submit(function (event) {
  console.log(event);
  window.localStorage.setItem('token', 'null');
});

$('#update_user').submit(function (event) {
  event.preventDefault();
  var unindexed_array = $(this).serializeArray();
  var data = {};
  $.map(unindexed_array, function (x, y) {
    data[x['name']] = x['value'];
  });
  var request = {
    url: `http://localhost:3000/api/users/${data.id}`,
    method: 'PUT',
    data: data,
  };

  $.ajax(request).done(function (response) {
    alert('Data updated successfully');
  });
});

if (window.location.pathname == '/') {
  $onDelete = $('.table tbody td a.delete');
  $onDelete.click(function () {
    var id = $(this).attr('data-id');

    var request = {
      url: `http://localhost:3000/api/users/${id}`,
      method: 'DELETE',
    };
    if (confirm('Do you want to delete this record?')) {
      $.ajax(request).done(function (response) {
        alert('Data deleted successfully');
        location.reload();
      });
    }
  });
}

window.onload = () => {
  console.log('enter');
  var token = window.localStorage.getItem('token');

  if (token) {
    $.ajaxSetup({
      headers: {
        authorization: token,
      },
    });
  }
};
