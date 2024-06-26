import { useEffect, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Alert from '@mui/joy/Alert';

function App() {
    const [notifications, setNotifications] = useState([]);
    const handleWebsocket = () => {
        const newSocket = new WebSocket("ws://localhost:8000/ws");
        newSocket.onopen = () => console.log('Websocket Connected');
        newSocket.onclose = () => console.log('Websocket Disconnected');
        newSocket.onerror = (err) => console.log('Websocket Error');
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
        <CssVarsProvider>
            <CssBaseline />
            <Sheet sx={{
                width: '80%',
                mx: 'auto', // margin left & right
                my: 4, // margin top & bottom
                py: 3, // padding top & bottom
                px: 2, // padding left & right
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 'sm',
                boxShadow: 'md',
            }}
            variant='outlined'>
                <Typography level="h1" component="h1">Twitter Notifications</Typography>
                { notifications.map(n => {
                        return (
                            <>
                                {   n.type === "like" ?
                                    <Alert variant='outlined'><strong>You</strong> liked <strong>@{n.username}'s</strong> Tweet</Alert>
                                    :
                                    <Alert variant='outlined'><strong>You</strong> were followed by <strong>@{n.username}</strong></Alert>
                                }
                            </>
                        );
                    }
                    )
                }
            </Sheet>
        </CssVarsProvider>
    );
}

export default App;
