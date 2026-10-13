import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import './Messages.css';

export default function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [partners, setPartners] = useState([]);
  const [partnerProfiles, setPartnerProfiles] = useState({});
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    loadPartners();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    const toId = searchParams.get('to');
    if (toId && !partners.includes(Number(toId))) {
      setPartners((prev) => {
        const id = Number(toId);
        return prev.includes(id) ? prev : [id, ...prev];
      });
      loadProfile(Number(toId));
      setActivePartner(Number(toId));
    }
  }, [searchParams, partners]);

  useEffect(() => {
    if (activePartner) {
      loadConversation(activePartner);
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => loadConversation(activePartner), 5000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activePartner]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadPartners = async () => {
    try {
      const res = await API.get('/messages/partners');
      const ids = res.data || [];
      setPartners(ids);

      for (const id of ids) {
        await loadProfile(id);
      }

      const toId = searchParams.get('to');
      if (toId) {
        const id = Number(toId);
        if (!ids.includes(id)) {
          setPartners((prev) => [id, ...prev]);
          await loadProfile(id);
        }
        setActivePartner(id);
      } else if (ids.length > 0) {
        setActivePartner(ids[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (id) => {
    if (partnerProfiles[id]) return;
    try {
      const res = await API.get(`/users/${id}/profile`);
      setPartnerProfiles((prev) => ({ ...prev, [id]: res.data }));
    } catch {}
  };

  const loadConversation = async (partnerId) => {
    try {
      const res = await API.get(`/messages/conversation/${partnerId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartner) return;
    setSending(true);
    try {
      await API.post('/messages', {
        receiverId: activePartner,
        content: newMessage.trim(),
      });
      setNewMessage('');
      loadConversation(activePartner);
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="page-wrapper"><LoadingSpinner /></div>;

  const activeProfile = partnerProfiles[activePartner];

  return (
    <div className="page-wrapper" style={{ paddingBottom: 0 }}>
      <div className="container-wide" style={{ maxWidth: '100%', padding: 0, height: '100%' }}>
        <div className="messages-page">
          {/* Sidebar */}
          <div className="messages-sidebar">
            <div className="messages-sidebar-header">
              <MessageCircle size={18} /> Messages
            </div>
            <div className="messages-sidebar-list">
              {partners.length === 0 ? (
                <div style={{ padding: 'var(--sp-6)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>
                  No conversations yet
                </div>
              ) : (
                partners.map((id) => {
                  const p = partnerProfiles[id];
                  return (
                    <div
                      key={id}
                      className={`conv-item ${activePartner === id ? 'active' : ''}`}
                      onClick={() => setActivePartner(id)}
                    >
                      <div className="conv-avatar">
                        {p?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="conv-info">
                        <div className="conv-name">{p?.name || `User #${id}`}</div>
                        <div className="conv-preview">{p?.role || ''}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="messages-chat">
            {activePartner ? (
              <>
                <div className="messages-chat-header">
                  <div className="conv-avatar" style={{ width: 36, height: 36 }}>
                    {activeProfile?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="messages-chat-name">{activeProfile?.name || 'Loading...'}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                      {activeProfile?.role || ''}
                    </div>
                  </div>
                </div>
                <div className="messages-chat-body">
                  {messages.length === 0 ? (
                    <div className="messages-empty">
                      <MessageCircle size={40} />
                      <p>No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div key={m.id} className={`chat-bubble ${m.sender?.id === user.id ? 'sent' : 'received'}`}>
                        <div>{m.content}</div>
                        <div className="chat-bubble-time">
                          {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form className="messages-chat-input" onSubmit={sendMessage}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <button type="submit" className="btn btn-primary" disabled={sending || !newMessage.trim()}>
                    <Send size={16} />
                  </button>
                </form>
              </>
            ) : (
              <div className="messages-empty">
                <MessageCircle size={48} />
                <h3 style={{ color: 'var(--text-primary)' }}>Your Messages</h3>
                <p>Select a conversation or start a new one from a project page</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
