
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const w = 10;
const h = 10;
ctx.fillStyle = "blue";

let userx = 100;
let usery = 100;
let uniqueid = new Date().getTime()

let users = {id: {x: userx, y: usery}}

const socketRoute = document.getElementById("ws-route").value;
const socket = new WebSocket(socketRoute.replace("http", "ws"));

renderUsers = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.keys(users).forEach((id) => {
        const {x, y} = users[id];
        ctx.fillRect(x, y, w, h);
    })
}

socket.onopen = (e) => {
    socket.send(`${uniqueid} ${userx} ${usery}`);
    renderUsers();
}

socket.onmessage = (e) => {
    const updated = e.data.split(' ');
    const id = updated[0];
    const x = parseInt(updated[1]);
    const y = parseInt(updated[2]);
    users[id] = {x, y};
    renderUsers();
}

document.addEventListener("keydown", function(e) {
    switch (e.key) {
        case "ArrowUp":
            usery -= h;
            break
        case "ArrowDown":
            usery += h;
            break
        case "ArrowLeft":
            userx -= w;
            break
        case "ArrowRight":
            userx += w;
            break
        case "w":
            usery -= h;
            break
        case "s":
            usery += h;
            break
        case "a":
            userx -= w;
            break
        case "d":
            userx += w;
            break 
    }
    socket.send(`${uniqueid}, ${userx}, ${usery}`);
    renderUsers();
})
