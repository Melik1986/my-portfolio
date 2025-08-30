'use client';

import React from 'react';
import { Avatar } from '@/modules/AboutSection/components/3DAvatar/3DAvatar';
import styles from './debug.module.scss';

export default function Test3DDebugPage() {
  const [logs, setLogs] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState('initializing');
  
  React.useEffect(() => {
    // Intercept console logs
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    
    console.log = (...args) => {
      originalLog(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      if (message.includes('useAvatar') || 
          message.includes('handleModelLoaded') || 
          message.includes('Avatar') ||
          message.includes('model')) {
        setLogs(prev => [...prev, `[LOG] ${new Date().toISOString()}: ${message}`]);
      }
    };
    
    console.warn = (...args) => {
      originalWarn(...args);
      const message = args.join(' ');
      setLogs(prev => [...prev, `[WARN] ${new Date().toISOString()}: ${message}`]);
    };
    
    console.error = (...args) => {
      originalError(...args);
      const message = args.join(' ');
      setLogs(prev => [...prev, `[ERROR] ${new Date().toISOString()}: ${message}`]);
      setStatus('error');
    };
    
    // Check WebGL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    if (!gl) {
      setLogs(prev => [...prev, '[ERROR] WebGL not supported!']);
      setStatus('webgl-error');
    } else {
      setLogs(prev => [...prev, '[OK] WebGL supported']);
    }
    
    // Listen for model loaded event
    const handleModelLoaded = () => {
      setLogs(prev => [...prev, '[EVENT] Model loaded event received']);
      setStatus('loaded');
    };
    
    window.addEventListener('modelLoaded', handleModelLoaded);
    
    // Check for avatar container after mount
    setTimeout(() => {
      const container = document.getElementById('avaturn-container');
      if (container) {
        setLogs(prev => [...prev, `[CHECK] Avatar container found. Size: ${container.clientWidth}x${container.clientHeight}`]);
        
        const canvas = container.querySelector('canvas');
        if (canvas) {
          setLogs(prev => [...prev, `[CHECK] Canvas found. Size: ${canvas.width}x${canvas.height}`]);
          
          // Check if canvas has content
          const ctx = canvas.getContext('webgl') || canvas.getContext('webgl2');
          if (ctx) {
            const pixels = new Uint8Array(4);
            (ctx as WebGLRenderingContext).readPixels(
              canvas.width / 2, 
              canvas.height / 2, 
              1, 1, 
              (ctx as WebGLRenderingContext).RGBA, 
              (ctx as WebGLRenderingContext).UNSIGNED_BYTE, 
              pixels
            );
            const hasContent = pixels.some(p => p > 0);
            setLogs(prev => [...prev, `[CHECK] Canvas has content: ${hasContent} (center pixel: ${Array.from(pixels).join(',')})`]);
          }
        } else {
          setLogs(prev => [...prev, '[CHECK] No canvas found in container']);
        }
      } else {
        setLogs(prev => [...prev, '[CHECK] Avatar container not found']);
      }
    }, 3000);
    
    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      window.removeEventListener('modelLoaded', handleModelLoaded);
    };
  }, []);
  
  return (
    <div className={styles.page}>
      <h1>3D Avatar Debug Mode</h1>
      
      <div className={styles.status}>
        Status: <span className={styles[status]}>{status}</span>
      </div>
      
      <div className={styles.container}>
        <div className={styles.avatarWrapper}>
          <h2>Avatar Component:</h2>
          <Avatar />
        </div>
        
        <div className={styles.logs}>
          <h2>Debug Logs:</h2>
          <div className={styles.logContent}>
            {logs.map((log, i) => (
              <div 
                key={i} 
                className={
                  log.includes('[ERROR]') ? styles.error : 
                  log.includes('[WARN]') ? styles.warn : 
                  styles.log
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.instructions}>
        <h3>Instructions:</h3>
        <ol>
          <li>Open Developer Console for full logs</li>
          <li>Look for [useAvatar] and [handleModelLoaded] messages</li>
          <li>Check Network tab for /model/avatar.glb request</li>
          <li>The debug logs above show avatar-related messages</li>
        </ol>
      </div>
    </div>
  );
}