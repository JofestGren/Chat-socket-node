window.onload = () => {
    const socket = io()
    const form = document.querySelector('form')
    const inputVal = document.getElementById('m')
    const messagesFiled = document.getElementById('messages')

    form.addEventListener('submit', (event) => {
        event.preventDefault()
        socket.emit('chat message', inputVal.value)
        inputVal.value = ''
        return false
    })

    socket.on('chat message', (msg) => messagesFiled.insertAdjacentHTML('afterbegin', `<li>${msg}</li>`))

}