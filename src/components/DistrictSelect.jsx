import { districts } from '../features/commerce/rules.js';

export default function DistrictSelect({ value, onChange, required = false }) {
  return (
    <label className="field">
      <span>Distrito</span>
      <select value={value} onChange={event => onChange(event.target.value)} required={required}>
        <option value="">Seleccionar distrito</option>
        {Object.keys(districts).map(district => <option key={district}>{district}</option>)}
      </select>
    </label>
  );
}
