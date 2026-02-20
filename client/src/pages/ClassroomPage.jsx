import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../api/config';
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    ScreenShare,
    ScreenShareOff,
    Hand,
    Smile,
    MessageSquare,
    Send,
} from 'lucide-react';

const ClassroomPage = () => {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') === 'host' ? 'host' : 'guest';

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const cameraTrackRef = useRef(null);
    const answerAppliedRef = useRef(false);
    const remoteCandidateCursor = useRef(0);
    const chatCursorRef = useRef(0);

    const [status, setStatus] = useState('Initializing classroom...');
    const [micEnabled, setMicEnabled] = useState(true);
    const [camEnabled, setCamEnabled] = useState(true);
    const [connected, setConnected] = useState(false);
    const [sharingScreen, setSharingScreen] = useState(false);
    const [handRaised, setHandRaised] = useState(false);
    const [reaction, setReaction] = useState('');
    const [chatOpen, setChatOpen] = useState(true);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [participantStates, setParticipantStates] = useState([]);

    const replaceVideoTrack = async (track) => {
        const peer = peerRef.current;
        if (!peer) return;
        const sender = peer.getSenders().find((s) => s.track && s.track.kind === 'video');
        if (sender) await sender.replaceTrack(track);
    };

    const publishState = async (override = {}) => {
        try {
            await api.post(`/classroom/${roomId}/state`, {
                role,
                micEnabled,
                camEnabled,
                handRaised,
                sharingScreen,
                reaction,
                ...override,
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const setup = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStreamRef.current = stream;
                cameraTrackRef.current = stream.getVideoTracks()[0] || null;
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;

                const peer = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
                });
                peerRef.current = peer;

                stream.getTracks().forEach((track) => peer.addTrack(track, stream));

                peer.ontrack = (event) => {
                    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
                    setConnected(true);
                    setStatus('Connected');
                };

                peer.onicecandidate = async (event) => {
                    if (!event.candidate) return;
                    await api.post(`/classroom/${roomId}/candidate`, { role, candidate: event.candidate });
                };

                if (role === 'host') {
                    setStatus('Creating room offer...');
                    const offer = await peer.createOffer();
                    await peer.setLocalDescription(offer);
                    await api.post(`/classroom/${roomId}/offer`, { offer });
                } else {
                    setStatus('Waiting for host offer...');
                }

                const poll = async () => {
                    if (!isMounted || !peerRef.current) return;

                    if (role === 'guest' && !peer.remoteDescription) {
                        const { data } = await api.get(`/classroom/${roomId}/offer`);
                        if (data.offer) {
                            await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
                            const answer = await peer.createAnswer();
                            await peer.setLocalDescription(answer);
                            await api.post(`/classroom/${roomId}/answer`, { answer });
                            setStatus('Joining room...');
                        }
                    }

                    if (role === 'host' && !answerAppliedRef.current) {
                        const { data } = await api.get(`/classroom/${roomId}/answer`);
                        if (data.answer) {
                            await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
                            answerAppliedRef.current = true;
                            setStatus('Host connected. Waiting for media...');
                        }
                    }

                    const { data: candidateData } = await api.get(`/classroom/${roomId}/candidates`, {
                        params: { role, after: remoteCandidateCursor.current },
                    });
                    for (const candidate of candidateData.candidates || []) {
                        try {
                            await peer.addIceCandidate(new RTCIceCandidate(candidate));
                        } catch {
                            // ignore race condition
                        }
                    }
                    remoteCandidateCursor.current = candidateData.nextCursor || remoteCandidateCursor.current;

                    const { data: chatData } = await api.get(`/classroom/${roomId}/chat`, {
                        params: { after: chatCursorRef.current },
                    });
                    if ((chatData.messages || []).length > 0) {
                        setMessages((prev) => [...prev, ...chatData.messages]);
                    }
                    chatCursorRef.current = chatData.nextCursor || chatCursorRef.current;

                    const { data: stateData } = await api.get(`/classroom/${roomId}/state`);
                    setParticipantStates(stateData.states || []);
                };

                const interval = setInterval(() => {
                    poll().catch((err) => console.error(err));
                    publishState().catch((err) => console.error(err));
                }, 1200);

                return () => clearInterval(interval);
            } catch (error) {
                console.error(error);
                setStatus('Failed to initialize classroom. Check camera and microphone permissions.');
            }
        };

        let cleanupPoll;
        setup().then((cleanup) => {
            cleanupPoll = cleanup;
        });

        return () => {
            isMounted = false;
            if (cleanupPoll) cleanupPoll();
            if (peerRef.current) peerRef.current.close();
            if (localStreamRef.current) localStreamRef.current.getTracks().forEach((track) => track.stop());
        };
    }, [roomId, role]);

    const toggleMic = () => {
        const stream = localStreamRef.current;
        if (!stream) return;
        const nextState = !micEnabled;
        stream.getAudioTracks().forEach((track) => { track.enabled = nextState; });
        setMicEnabled(nextState);
        publishState({ micEnabled: nextState });
    };

    const toggleCam = () => {
        const stream = localStreamRef.current;
        if (!stream) return;
        const nextState = !camEnabled;
        stream.getVideoTracks().forEach((track) => { track.enabled = nextState; });
        setCamEnabled(nextState);
        publishState({ camEnabled: nextState });
    };

    const toggleScreenShare = async () => {
        try {
            if (!sharingScreen) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
                const screenTrack = screenStream.getVideoTracks()[0];
                await replaceVideoTrack(screenTrack);
                if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
                setSharingScreen(true);
                publishState({ sharingScreen: true });

                screenTrack.onended = async () => {
                    const camTrack = cameraTrackRef.current;
                    if (camTrack) {
                        await replaceVideoTrack(camTrack);
                        if (localStreamRef.current && localVideoRef.current) {
                            localVideoRef.current.srcObject = localStreamRef.current;
                        }
                    }
                    setSharingScreen(false);
                    publishState({ sharingScreen: false });
                };
            } else {
                const camTrack = cameraTrackRef.current;
                if (camTrack) {
                    await replaceVideoTrack(camTrack);
                    if (localStreamRef.current && localVideoRef.current) {
                        localVideoRef.current.srcObject = localStreamRef.current;
                    }
                }
                setSharingScreen(false);
                publishState({ sharingScreen: false });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleHand = () => {
        const next = !handRaised;
        setHandRaised(next);
        publishState({ handRaised: next });
    };

    const sendReaction = (emoji) => {
        setReaction(emoji);
        publishState({ reaction: emoji });
        setTimeout(() => {
            setReaction('');
            publishState({ reaction: '' });
        }, 3000);
    };

    const sendMessage = async () => {
        const text = chatInput.trim();
        if (!text) return;
        try {
            await api.post(`/classroom/${roomId}/chat`, { role, text });
            setChatInput('');
        } catch (error) {
            console.error(error);
        }
    };

    const leaveRoom = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-5">
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Live Classroom</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">Room: {roomId} • Role: {role}</p>
                    <p className={`text-sm mt-2 ${connected ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>{status}</p>
                </div>

                <div className="grid xl:grid-cols-3 gap-4">
                    <div className="xl:col-span-2 grid lg:grid-cols-2 gap-4">
                        <VideoPanel title="Your Camera" videoRef={localVideoRef} muted />
                        <VideoPanel title="Remote Camera" videoRef={remoteVideoRef} />
                    </div>

                    <section className="glass-card rounded-2xl p-3 h-[34rem] flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center"><MessageSquare className="w-4 h-4 mr-1.5" />Chat</p>
                            <button onClick={() => setChatOpen((v) => !v)} className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-600">{chatOpen ? 'Hide' : 'Show'}</button>
                        </div>

                        {chatOpen && (
                            <>
                                <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 p-2 overflow-y-auto bg-white dark:bg-slate-900/40">
                                    {messages.length === 0 ? (
                                        <p className="text-xs text-slate-500">No messages yet.</p>
                                    ) : (
                                        messages.map((msg, idx) => (
                                            <div key={`${msg.ts}-${idx}`} className="mb-2">
                                                <p className="text-[11px] text-slate-500">{msg.role} • {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <p className="text-sm text-slate-800 dark:text-slate-200">{msg.text}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-2 flex gap-2">
                                    <input
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                                        placeholder="Type a message"
                                    />
                                    <button onClick={sendMessage} className="btn-primary px-3 rounded-lg"><Send className="w-4 h-4" /></button>
                                </div>
                            </>
                        )}

                        <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 p-2">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Participants</p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                                {participantStates.map((ps) => (
                                    <div key={`${ps.role}-${ps.userId}`} className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                                        <span>{ps.role} #{ps.userId}</span>
                                        <span>{ps.handRaised ? '✋ ' : ''}{ps.sharingScreen ? '🖥️ ' : ''}{ps.reaction || ''}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-6 glass-card rounded-2xl p-4 flex items-center gap-3 flex-wrap">
                    <ControlButton onClick={toggleMic} icon={micEnabled ? Mic : MicOff} label={micEnabled ? 'Mute' : 'Unmute'} />
                    <ControlButton onClick={toggleCam} icon={camEnabled ? Video : VideoOff} label={camEnabled ? 'Camera Off' : 'Camera On'} />
                    <ControlButton onClick={toggleScreenShare} icon={sharingScreen ? ScreenShareOff : ScreenShare} label={sharingScreen ? 'Stop Share' : 'Share Screen'} />
                    <ControlButton onClick={toggleHand} icon={Hand} label={handRaised ? 'Lower Hand' : 'Raise Hand'} />
                    <ControlButton onClick={() => sendReaction('👍')} icon={Smile} label="React" />
                    <button onClick={leaveRoom} className="ml-auto px-4 py-2 rounded-xl bg-red-500 text-white inline-flex items-center hover:bg-red-600">
                        <PhoneOff className="w-4 h-4 mr-2" />
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
};

const VideoPanel = ({ title, videoRef, muted = false }) => (
    <section className="glass-card rounded-2xl p-3">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{title}</p>
        <div className="aspect-video rounded-xl overflow-hidden bg-slate-950">
            <video ref={videoRef} autoPlay playsInline muted={muted} className="w-full h-full object-cover" />
        </div>
    </section>
);

const ControlButton = ({ onClick, icon: Icon, label }) => (
    <button onClick={onClick} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 inline-flex items-center">
        <Icon className="w-4 h-4 mr-2" />
        {label}
    </button>
);

export default ClassroomPage;
