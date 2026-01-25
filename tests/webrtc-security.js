// WebRTC Security 漏洞示例文件

// 示例 1: 不安全的 WebRTC 连接
export function webrtcSecurityExample1() {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  });
  
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendCandidate(event.candidate);
    }
  };
}

// 示例 2: 泄露本地 IP 地址
export function webrtcSecurityExample2() {
  const peerConnection = new RTCPeerConnection();
  
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      // 危险：泄露本地 IP 地址
      console.log('Local IP:', event.candidate.address);
      sendToServer(event.candidate);
    }
  };
}

// 示例 3: 缺少身份验证
export function webrtcSecurityExample3() {
  const peerConnection = new RTCPeerConnection();
  
  peerConnection.ontrack = (event) => {
    // 危险：接受任意远程流，没有验证
    const remoteStream = event.streams[0];
    document.getElementById('remoteVideo').srcObject = remoteStream;
  };
}

// 示例 4: WebRTC 数据通道注入
export function webrtcSecurityExample4() {
  const peerConnection = new RTCPeerConnection();
  const dataChannel = peerConnection.createDataChannel('chat');
  
  dataChannel.onmessage = (event) => {
    // 危险：直接执行接收到的数据
    eval(event.data);
  };
}

// 示例 5: WebRTC 中间人攻击
export function webrtcSecurityExample5() {
  const peerConnection = new RTCPeerConnection();
  
  peerConnection.setRemoteDescription(remoteDescription);
  
  peerConnection.createAnswer()
    .then(answer => peerConnection.setLocalDescription(answer))
    .then(() => {
      // 危险：没有验证远程描述
      sendAnswer(peerConnection.localDescription);
    });
}

// 示例 6: WebRTC 媒体流劫持
export function webrtcSecurityExample6() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      const peerConnection = new RTCPeerConnection();
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      
      // 危险：没有用户同意就发送媒体流
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendCandidate(event.candidate);
        }
      };
    });
}

// 示例 7: WebRTC 屏幕共享泄露
export function webrtcSecurityExample7() {
  navigator.mediaDevices.getDisplayMedia({ video: true })
    .then(stream => {
      const peerConnection = new RTCPeerConnection();
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      
      // 危险：共享屏幕内容
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendCandidate(event.candidate);
        }
      };
    });
}

// 示例 8: WebRTC 数据泄露
export function webrtcSecurityExample8() {
  const peerConnection = new RTCPeerConnection();
  const dataChannel = peerConnection.createDataChannel('data');
  
  dataChannel.onopen = () => {
    // 危险：发送敏感数据
    dataChannel.send(JSON.stringify({
      cookies: document.cookie,
      localStorage: localStorage,
      sessionStorage: sessionStorage
    }));
  };
}

// 示例 9: WebRTC DoS 攻击
export function webrtcSecurityExample9() {
  function createPeerConnection() {
    const peerConnection = new RTCPeerConnection();
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendCandidate(event.candidate);
      }
    };
    
    return peerConnection;
  }
  
  // 危险：创建大量连接导致 DoS
  for (let i = 0; i < 1000; i++) {
    createPeerConnection();
  }
}

// 示例 10: WebRTC 指纹识别
export function webrtcSecurityExample10() {
  const peerConnection = new RTCPeerConnection();
  
  peerConnection.createDataChannel('test');
  
  peerConnection.createOffer()
    .then(offer => peerConnection.setLocalDescription(offer))
    .then(() => {
      // 危险：泄露设备指纹
      const fingerprint = peerConnection.localDescription.sdp;
      sendFingerprint(fingerprint);
    });
}
