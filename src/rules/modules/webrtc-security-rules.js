const webrtcSecurityRules = [
  {
    id: 'webrtc-ip-leakage',
    name: 'WebRTC IP Address Leakage',
    severity: 'Medium',
    description: 'WebRTC connection may leak local IP address',
    recommendation: 'Configure RTCPeerConnection to prevent local IP address leakage. Use { "iceServers": [] } or enable privacy features.',
    patterns: [
      { key: 'rtc-peer-connection', pattern: 'new\\s+RTCPeerConnection\\s*\\(\\s*\\{[^}]*\\}' },
      { key: 'rtc-no-ice-servers', pattern: 'new\\s+RTCPeerConnection\\s*\\(\\s*\\{\\s*\\}\\s*\\)' }
    ]
  },
  {
    id: 'webrtc-signaling-security',
    name: 'WebRTC Signaling Channel Security',
    severity: 'High',
    description: 'Potential security issues with WebRTC signaling channel',
    recommendation: 'Secure WebRTC signaling channels with authentication and encryption. Validate all signaling messages.',
    patterns: [
      { key: 'webrtc-signaling', pattern: 'RTCPeerConnection|webSocket|socket\\.emit|signal' },
      { key: 'webrtc-message', pattern: 'onmessage|onicecandidate|onsignalingstatechange' }
    ]
  },
  {
    id: 'webrtc-media-security',
    name: 'WebRTC Media Stream Security',
    severity: 'High',
    description: 'Potential security issues with WebRTC media streams',
    recommendation: 'Ensure proper DTLS-SRTP configuration for media encryption. Validate media stream permissions.',
    patterns: [
      { key: 'webrtc-getusermedia', pattern: 'getUserMedia|mediaDevices\\.getUserMedia' },
      { key: 'webrtc-constraints', pattern: 'audio:\\s*true|video:\\s*true' }
    ]
  },
  {
    id: 'webrtc-authentication',
    name: 'WebRTC Connection Authentication',
    severity: 'High',
    description: 'Missing authentication for WebRTC connections',
    recommendation: 'Implement proper authentication before establishing WebRTC connections. Validate peer identity.',
    patterns: [
      { key: 'webrtc-direct-connection', pattern: 'new\\s+RTCPeerConnection\\s*\\(\\s*\\{' },
      { key: 'webrtc-no-auth', pattern: 'RTCPeerConnection.*without.*auth' }
    ]
  },
  {
    id: 'webrtc-data-channel-security',
    name: 'WebRTC Data Channel Security',
    severity: 'Medium',
    description: 'Potential security issues with WebRTC data channels',
    recommendation: 'Secure WebRTC data channels. Validate and sanitize data transferred through data channels.',
    patterns: [
      { key: 'webrtc-data-channel', pattern: 'createDataChannel\\s*\\(' },
      { key: 'webrtc-data-transfer', pattern: 'dc\\.send|channel\\.send' }
    ]
  },
  {
    id: 'webrtc-ice-candidate-security',
    name: 'WebRTC ICE Candidate Security',
    severity: 'Medium',
    description: 'Potential security issues with ICE candidate handling',
    recommendation: 'Validate ICE candidates before setting them. Prevent unauthorized candidate manipulation.',
    patterns: [
      { key: 'webrtc-ice-candidate', pattern: 'onicecandidate|addIceCandidate' },
      { key: 'webrtc-candidate-set', pattern: 'setRemoteDescription' }
    ]
  }
];

module.exports = webrtcSecurityRules;