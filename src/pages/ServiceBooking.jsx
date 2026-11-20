import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuBath, LuClock3, LuScissors, LuSparkles } from 'react-icons/lu';
import { PageIntro, Price, Status } from '../components/StoreUI.jsx';
import { bookingDate, bookingTimes, bookedAt, services } from '../features/commerce/rules.js';
import { shop, useShop } from '../features/commerce/store.js';

const icons = { bath: LuBath, grooming: LuScissors, nails: LuSparkles };

export default function ServiceBooking() {
  const state = useShop();
  const [service, setService] = useState('bath');
  const [date, setDate] = useState(bookingDate);
  const [time, setTime] = useState('');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState({ text: '', error: false });
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 30);
  const timeSlots = bookingTimes.filter(slot => new Date(date + 'T' + slot) > now && !bookedAt(state, date, slot));

  async function submit(event) {
    event.preventDefault();
    const petName = String(new FormData(event.currentTarget).get('petName') ?? '');
    setPending(true);
    try {
      const booking = await shop.book({ service, date, time, petName });
      setResult({ text: 'Reserva de prueba guardada: ' + booking.id, error: false });
      setTime('');
    } catch (error) {
      setResult({ text: error.message, error: true });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container page-space">
      <PageIntro title="Servicios para tu mascota" description="Compara servicios y reserva un turno de prueba." />
      <div className="service-layout">
        <fieldset className="service-list options-field">
          <legend>Elige un servicio</legend>
          {services.map(item => {
            const Icon = icons[item.id];
            return <label className={'service-card' + (service === item.id ? ' chosen' : '')} key={item.id}>
              <input type="radio" name="service" value={item.id} checked={service === item.id} onChange={() => setService(item.id)} />
              <span className="service-icon"><Icon aria-hidden="true" /></span>
              <span className="service-text"><strong>{item.name}</strong><small>{item.description}</small><small><LuClock3 aria-hidden="true" />{item.duration}</small></span>
              <Price cents={item.price} />
            </label>;
          })}
        </fieldset>
        <form className="panel booking-form" onSubmit={submit}>
          <h2>Elige tu turno</h2>
          <label className="field"><span>Nombre de la mascota</span><input name="petName" minLength={2} maxLength={40}
            defaultValue={state.profile?.petName ?? ''} placeholder="Ej. Luna" required /></label>
          <label className="field"><span>Fecha</span><input type="date" value={date} min={bookingDate(now)} max={bookingDate(end)}
            onChange={event => { setDate(event.target.value); setTime(''); }} required /></label>
          <label className="field"><span>Horario</span><select value={time} onChange={event => setTime(event.target.value)} required>
            <option value="">{timeSlots.length ? 'Selecciona una hora' : 'Sin turnos para esta fecha'}</option>
            {timeSlots.map(slot => <option key={slot}>{slot}</option>)}
          </select></label>
          <button className="button button-primary button-wide" type="submit" disabled={!timeSlots.includes(time) || pending}>
            {pending ? 'Guardando…' : 'Guardar reserva de prueba'}
          </button>
          <Status error={result.error}>{result.text}</Status>
          {result.text && !result.error && <Link className="text-link" to="/profile?panel=bookings">Ver mis reservas</Link>}
        </form>
      </div>
    </div>
  );
}
