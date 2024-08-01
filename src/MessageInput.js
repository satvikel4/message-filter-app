import React, { useState } from 'react';
import axios from 'axios';

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const [warning, setWarning] = useState('');

    const handleSendMessage = async () => {
        try {
            const response = await axios.post('http://localhost:5000/analyze', { text: message });
            const { attributeScores } = response.data;
            const toxicity = attributeScores.TOXICITY.summaryScore.value;
            const threat = attributeScores.THREAT.summaryScore.value;

            if (toxicity > 0.7 || threat > 0.7) {
                setWarning('This message contains sensitive content.');
            } else {
                setWarning('');
                // Send the message to the chat or server
                console.log('Message sent:', message);
            }
        } catch (error) {
            console.error('Error analyzing message:', error);
            setWarning('Error processing message.');
        }
    };

    return (
        <div>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here"
            />
            <button onClick={handleSendMessage}>Send</button>
            {warning && <p style={{ color: 'red' }}>{warning}</p>}
        </div>
    );
};

export default MessageInput;
