import { useCallback, useEffect, useState } from 'react';
import { errMsg } from './utils';

// Charge des données au montage et expose reload()
export function useLoad(fn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await fn());
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, reload: load };
}

// État de formulaire 
export function useForm(initial) {
  const [values, setValues] = useState(initial);
  const bind = (name) => ({
    value: values[name] ?? '',
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
  });
  const reset = () => setValues(initial);
  return [values, bind, reset, setValues];
}
