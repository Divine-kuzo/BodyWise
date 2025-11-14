'use client';

import { useEffect, useRef, useState } from 'react';

interface JitsiMeetingProps {
  roomId: string;
  userName: string;
  onMeetingEnd?: () => void;
  onParticipantJoined?: (participant: any) => void;
  onParticipantLeft?: (participant: any) => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function JitsiMeeting({ 
  roomId, 
  userName, 
  onMeetingEnd,
  onParticipantJoined,
  onParticipantLeft 
}: JitsiMeetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get Jitsi domain from environment or use default
    const jitsiDomain = process.env.NEXT_PUBLIC_JITSI_DOMAIN || 'meet.jit.si';

    // Load Jitsi Meet External API script
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(window.JitsiMeetExternalAPI);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://${jitsiDomain}/external_api.js`;
        script.async = true;
        script.onload = () => resolve(window.JitsiMeetExternalAPI);
        script.onerror = () => reject(new Error('Failed to load Jitsi Meet API'));
        document.body.appendChild(script);
      });
    };

    const initJitsi = async () => {
      try {
        setIsLoading(true);
        await loadJitsiScript();

        if (!containerRef.current) return;

        // Initialize Jitsi Meet
        const options = {
          roomName: roomId,
          width: '100%',
          height: '100%',
          parentNode: containerRef.current,
          domain: jitsiDomain,
          userInfo: {
            displayName: userName,
          },
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            disableInviteFunctions: true,
            // Better video quality
            resolution: 720,
            constraints: {
              video: {
                height: { ideal: 720, max: 1080, min: 360 }
              }
            },
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'chat',
              'raisehand',
              'videoquality',
              'tileview',
              'shortcuts',
              'stats',
              'settings',
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            SHOW_POWERED_BY: false,
            DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
            DEFAULT_LOCAL_DISPLAY_NAME: userName,
          },
        };

        jitsiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', options);

        // Event listeners
        jitsiRef.current.addListener('videoConferenceJoined', () => {
          console.log('Joined the meeting');
          setIsLoading(false);
        });

        jitsiRef.current.addListener('videoConferenceLeft', () => {
          console.log('Left the meeting');
          onMeetingEnd?.();
        });

        jitsiRef.current.addListener('participantJoined', (participant: any) => {
          console.log('Participant joined:', participant);
          onParticipantJoined?.(participant);
        });

        jitsiRef.current.addListener('participantLeft', (participant: any) => {
          console.log('Participant left:', participant);
          onParticipantLeft?.(participant);
        });

        jitsiRef.current.addListener('readyToClose', () => {
          onMeetingEnd?.();
        });

      } catch (err) {
        console.error('Failed to initialize Jitsi:', err);
        setError('Failed to load video meeting. Please refresh the page.');
        setIsLoading(false);
      }
    };

    initJitsi();

    // Cleanup
    return () => {
      if (jitsiRef.current) {
        jitsiRef.current.dispose();
        jitsiRef.current = null;
      }
    };
  }, [roomId, userName, onMeetingEnd, onParticipantJoined, onParticipantLeft]);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading video meeting...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-center p-6">
            <div className="text-red-600 text-xl mb-2">⚠️</div>
            <p className="text-red-800 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
