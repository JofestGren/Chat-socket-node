window.onload = () => {
    const socket = io()
    const loginForm = document.getElementById('logInForm')

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const fromChildren = Array.from(loginForm.children)

        const login = {}

        let inputLogin

        fromChildren.forEach(element => {
            if (element.name == 'userName') {
                login.userName = element.value
                inputLogin = element
            }
            if (element.name == 'userPassword') {
                login.userPassword = element.value
            }
        })
        socket.emit('login', login)
        socket.on('login', (msg) => inputLogin.insertAdjacentHTML('beforebegin', `<span>${msg}</span>`))
    })
}