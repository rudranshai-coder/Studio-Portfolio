// Direct Gmail Integration using Google Workspace Gmail API (OAuth 2.0 via Google Identity Services)
// No EmailJS, No third-party email intermediaries.

export interface GmailSendParams {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
  fromName?: string;
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; expires_in?: number }) => void;
            error_callback?: (error: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

/**
 * Constructs an RFC 2822 base64url-encoded email string for the Gmail API.
 */
function createRfc822Message(params: GmailSendParams): string {
  const { to, subject, body, replyTo, fromName } = params;

  // Use utf-8 safe base64 encoding for subject
  const encodedSubject = btoa(unescape(encodeURIComponent(subject)));

  const headers = [
    `To: ${to}`,
    fromName ? `From: =?utf-8?B?${btoa(unescape(encodeURIComponent(fromName)))}?=` : '',
    replyTo ? `Reply-To: ${replyTo}` : '',
    `Subject: =?utf-8?B?${encodedSubject}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    body,
  ].filter(Boolean);

  const rawString = headers.join('\r\n');
  return btoa(unescape(encodeURIComponent(rawString)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates direct Gmail web composer link for 1-click fallback.
 */
export function getDirectGmailComposeUrl(to: string, subject: string, body: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Opens Gmail compose in a new browser tab.
 */
export function openGmailComposeWindow(to: string, subject: string, body: string): void {
  const url = getDirectGmailComposeUrl(to, subject, body);
  window.open(url, '_blank', 'noopener,noreferrer');
}

const DEFAULT_CLIENT_ID = '466398987517-oouqv2aas7sgfl9n9cfmnsj27abadgca.apps.googleusercontent.com';

/**
 * Requests an OAuth access token using Google Identity Services (GSI).
 */
export async function getGmailAccessToken(): Promise<string> {
  // Check cached token
  const now = Date.now();
  if (cachedAccessToken && tokenExpiresAt > now + 60000) {
    return cachedAccessToken;
  }

  const clientId =
    (import.meta as any).env?.VITE_GCP_OAUTH_CLIENT_ID ||
    (window as any).__VITE_GCP_OAUTH_CLIENT_ID ||
    DEFAULT_CLIENT_ID;

  // Ensure GSI script is loaded
  if (!window.google?.accounts?.oauth2) {
    await new Promise<void>((resolve, reject) => {
      let attempts = 0;
      const check = setInterval(() => {
        attempts++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(check);
          resolve();
        } else if (attempts > 30) {
          clearInterval(check);
          reject(new Error('Google Identity Services library failed to load.'));
        }
      }, 100);
    });
  }

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google!.accounts!.oauth2!.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/gmail.send',
        callback: (resp) => {
          if (resp.error) {
            reject(new Error(resp.error));
            return;
          }
          if (resp.access_token) {
            cachedAccessToken = resp.access_token;
            const expiresInSec = resp.expires_in || 3600;
            tokenExpiresAt = Date.now() + expiresInSec * 1000;
            resolve(resp.access_token);
          } else {
            reject(new Error('No access token received from Google.'));
          }
        },
        error_callback: (err) => {
          reject(err);
        },
      });

      tokenClient.requestAccessToken({ prompt: '' });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Sends an email directly via the official Gmail API (POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send).
 * If direct API OAuth is not completed or blocked, it seamlessly opens the official prefilled Gmail composer.
 */
export async function sendEmailViaGmailApi(params: GmailSendParams): Promise<{ success: boolean; id?: string }> {
  try {
    const token = await getGmailAccessToken();
    const raw = createRfc822Message(params);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error?.message || `Gmail API responded with status ${response.status}`;
      throw new Error(message);
    }

    const result = await response.json();
    return { success: true, id: result.id };
  } catch (err) {
    console.warn('Direct Gmail token not available or blocked in current frame; opening prefilled Gmail compose:', err);
    openGmailComposeWindow(params.to, params.subject, params.body);
    return { success: true };
  }
}
