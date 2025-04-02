// components/AgentFeedbackViewer.jsx
import React from 'react';
import useAgentSocket from '../../hook/useAgentSocket';

export default function AgentFeedbackViewer() {
    const { feedbackList } = useAgentSocket();
    console.log("feedbackList", feedbackList)
    return (
        <div className="agent-feedback-container">
            <h4>Agent Feedback</h4>
            <ul>
                {feedbackList.map((fb, i) => (
                    <li key={i}>
                        <strong>{fb.agentId}:</strong> {fb.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}