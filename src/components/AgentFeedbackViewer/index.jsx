// components/AgentFeedbackViewer.jsx
import React from 'react';
import useAgentSocket from '../../hooks/useAgentSocket';

export default function AgentFeedbackViewer() {
    const { feedbackList } = useAgentSocket();
    return (
        <div className="agent-feedback-container">
            <h4>Agent Feedback</h4>
            <ul>
                {feedbackList.map((fb, i) => (
                    <li key={i} className='feedback-item'>
                        <strong>{fb.agentId} : </strong> {fb.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}