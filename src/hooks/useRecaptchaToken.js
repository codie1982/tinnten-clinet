import { useEffect, useState, useCallback } from "react";
const SITEKEY ="6LfmgCgrAAAAAITG5dRGnT5ejEZye6UXDI6Pyq8w"
export function useRecaptchaToken(action) {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchToken = useCallback(async () => {
    setLoading(true);
    try {
      if (!window.grecaptcha) {
        throw new Error("reCAPTCHA yüklenmedi.");
      }

      await window.grecaptcha.ready(() => {});
      const result = await window.grecaptcha.execute(SITEKEY, { action });
      setToken(result);
      setError(null);
    } catch (err) {
      setToken(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [action]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return { token, loading, error, refresh: fetchToken };
}