export const inviteSocket = (socket) => {
  // lăng nghe sự kiện từ client
  socket.on('FE_USER_INVITE_TO_BOARD', (invitation) => {
    // Khi có người dùng khác mời vào board thì sẽ bắn sự kiện này tơi tất cả người dùng đang online
    socket.broadcast.emit('BE_USER_INVITE_TO_BOARD', invitation)
  })
}