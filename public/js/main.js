$('#newCommentModal').on('shown.bs.modal', function () {
    $('#content').trigger('focus')
  });
  $('#editCommentModal').on('shown.bs.modal', function () {
    $('#content').trigger('focus')
  });
$('#newCommentModal').modal('show');
$('#editCommentModal').modal('show');
