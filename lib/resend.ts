import { Resend } from 'resend';

// Use a function to get the client only when needed
export const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // During build, we return a mock or throw a soft error that doesn't kill the worker
    console.warn("RESEND_API_KEY is missing. If this is a build step, it's expected.");
    return null; 
  }
  return new Resend(apiKey);
};

// Keep this for backward compatibility but add a check
export const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");