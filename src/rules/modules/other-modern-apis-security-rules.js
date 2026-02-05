const otherModernApisSecurityRules = [
  // 设备API安全规则
  {
    id: 'sensor-api-security',
    name: 'Device Sensor API Security',
    severity: 'Medium',
    description: 'Potential security issues with device sensor APIs',
    recommendation: 'Request sensor permissions appropriately. Protect against sensor-based fingerprinting attacks.',
    patterns: [
      { key: 'accelerometer-api', pattern: 'new\\s+Accelerometer\\s*\\(' },
      { key: 'gyroscope-api', pattern: 'new\\s+Gyroscope\\s*\\(' },
      { key: 'magnetometer-api', pattern: 'new\\s+Magnetometer\\s*\\(' },
      { key: 'ambient-light-api', pattern: 'AmbientLightSensor' }
    ]
  },
  {
    id: 'gamepad-api-security',
    name: 'Gamepad API Security',
    severity: 'Low',
    description: 'Potential security issues with Gamepad API',
    recommendation: 'Validate gamepad input to prevent injection attacks. Be aware of potential fingerprinting.',
    patterns: [
      { key: 'gamepad-api', pattern: 'navigator\\.getGamepads|gamepadconnected|gamepaddisconnected' }
    ]
  },
  
  // 通信API安全规则
  {
    id: 'websocket-advanced-security',
    name: 'WebSocket Advanced Security',
    severity: 'High',
    description: 'Advanced WebSocket security configuration issues',
    recommendation: 'Secure WebSocket subprotocols and extensions. Validate origin and implement proper authentication.',
    patterns: [
      { key: 'websocket-subprotocol', pattern: 'new\\s+WebSocket\\s*\\([^,]*,[^\\]]*\\]' },  // WebSocket with subprotocols
      { key: 'websocket-extensions', pattern: 'Sec-WebSocket-Extensions|extensions\\s*:' }
    ]
  },
  {
    id: 'server-sent-events-security',
    name: 'Server-Sent Events Security',
    severity: 'Medium',
    description: 'Potential security issues with Server-Sent Events',
    recommendation: 'Secure SSE endpoints. Validate and sanitize event data. Implement proper authentication.',
    patterns: [
      { key: 'server-sent-events', pattern: 'new\\s+EventSource\\s*\\(' },
      { key: 'sse-listener', pattern: 'eventSource\\.addEventListener|onmessage\\s*=' }
    ]
  },
  {
    id: 'postmessage-advanced-security',
    name: 'Advanced PostMessage Security',
    severity: 'High',
    description: 'Advanced postMessage security issues beyond basic validation',
    recommendation: 'Validate origin, implement proper message validation, and use secure messaging patterns.',
    patterns: [
      { key: 'postmessage-wildcard', pattern: 'postMessage\\s*\\([^,]*,\\s*["\']*["\']' },  // postMessage with wildcard origin
      { key: 'postmessage-no-origin', pattern: 'postMessage\\s*\\([^)]*\\)' }  // Basic postMessage usage to check for validation
    ]
  },
  
  // 用户交互API安全规则
  {
    id: 'clipboard-api-security',
    name: 'Clipboard API Security',
    severity: 'Medium',
    description: 'Potential security issues with Clipboard API',
    recommendation: 'Request clipboard permissions appropriately. Sanitize clipboard content to prevent XSS.',
    patterns: [
      { key: 'clipboard-read', pattern: 'navigator\\.clipboard\\.read' },
      { key: 'clipboard-write', pattern: 'navigator\\.clipboard\\.write' },
      { key: 'clipboard-readtext', pattern: 'navigator\\.clipboard\\.readText' },
      { key: 'clipboard-writetext', pattern: 'navigator\\.clipboard\\.writeText' }
    ]
  },
  {
    id: 'fullscreen-api-phishing',
    name: 'Fullscreen API Phishing Risk',
    severity: 'Medium',
    description: 'Potential fullscreen API abuse for phishing attacks',
    recommendation: 'Provide clear UI indicators when in fullscreen. Warn users about fullscreen applications.',
    patterns: [
      { key: 'fullscreen-api', pattern: 'requestFullscreen|webkitRequestFullscreen|mozRequestFullScreen|msRequestFullscreen' },
      { key: 'fullscreen-element', pattern: 'element\\.requestFullscreen' }
    ]
  },
  
  // 多媒体API安全规则
  {
    id: 'mediadevices-security',
    name: 'MediaDevices Security',
    severity: 'High',
    description: 'Potential security issues with MediaDevices API',
    recommendation: 'Request media permissions appropriately. Protect against unauthorized camera/microphone access.',
    patterns: [
      { key: 'mediadevices-getusermedia', pattern: 'navigator\\.mediaDevices\\.getUserMedia' },
      { key: 'mediadevices-enumerate', pattern: 'navigator\\.mediaDevices\\.enumerateDevices' }
    ]
  },
  {
    id: 'canvas-todataurl-security',
    name: 'Canvas toDataURL Security',
    severity: 'Medium',
    description: 'Potential security issues with canvas.toDataURL',
    recommendation: 'Be cautious when using toDataURL with cross-origin images to prevent data extraction.',
    patterns: [
      { key: 'canvas-todataurl', pattern: 'canvas\\.toDataURL|toBlob' },
      { key: 'canvas-crossorigin', pattern: 'crossOrigin\\s*=|toDataURL.*tainted' }
    ]
  },
  {
    id: 'web-audio-security',
    name: 'Web Audio API Security',
    severity: 'Low',
    description: 'Potential security issues with Web Audio API',
    recommendation: 'Be aware of potential fingerprinting through audio context parameters.',
    patterns: [
      { key: 'web-audio-context', pattern: 'AudioContext|webkitAudioContext|OfflineAudioContext' }
    ]
  }
];

module.exports = otherModernApisSecurityRules;