import { useState } from 'react';

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);
  const reset = () => setInputs(initial);

  const blankState = {};
  for (const key of Object.keys(inputs)) {
    blankState[key] = '';
  }
  const clear = () => setInputs(blankState);

  function handleChange(event) {
    let { value, name, type } = event.target;
    if (type === 'number') value = parseInt(value);
    if (type === 'file') [value] = event.target.files;
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  return { inputs, handleChange, reset, clear };
}
