import { useEffect, useState } from 'react';

function App() {
    const [notifications, setNotifications] = useState([]);
    const handleWebsocket = () => {
        const newSocket = new WebSocket("ws://localhost:8000/ws");
        newSocket.onopen = () => console.log('WS Connected');
        newSocket.onclose = () => console.log('WS Disconnected');
        newSocket.onerror = (err) => console.log('WS Error');
        newSocket.onmessage = (e) => {
            let data = JSON.parse(e.data);
            console.log("WS Receives: ", data);
            setNotifications((prevState) => [...prevState, data]);
        }
    }

    useEffect(() => {
        handleWebsocket();
    }, []);
    return (
        <div className="App">
            <h1>Twitter Notifications</h1>
            { notifications.map(n => <div>{ JSON.stringify(n) }</div>) }
        </div>
    );
}

export default App;
