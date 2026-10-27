"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { CalendarPlus } from "lucide-react";
import { publishEvent } from "@/app/admin/actions";
import { initialAdminFormState } from "@/lib/admin-forms";
import { accountInput, accountLabel } from "@/lib/account-forms";
import { FieldError, FormFeedback } from "./ProfileForm";

type Props = { today: string; eventTypes: readonly string[] };

export default function AdminEventForm({ today, eventTypes }: Props) {
  const [state, submit, pending] = useActionState(publishEvent, initialAdminFormState);
  const errors = state.errors ?? {};
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }
  const inputProps = (name: string) => ({
    id: `event-${name}`, name, "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `event-${name}-error` : undefined,
    className: `${accountInput(errors[name])} min-w-0`,
  });
  const error = (name: string) => <FieldError id={`event-${name}-error`} text={errors[name]} />;

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <CalendarPlus className="h-5 w-5 text-brand" aria-hidden="true" />
        <h2 className="text-xl font-bold text-ink">Nytt arrangement</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">Publiser en søknadskveld, workshop eller sosial samling. Alle felt merket * må fylles ut.</p>
      <FormFeedback state={state} />
      <fieldset disabled={pending} className="mt-6 min-w-0 space-y-5">
        <div>
          <label htmlFor="event-title" className={accountLabel}>Tittel *</label>
          <input {...inputProps("title")} required maxLength={160} placeholder="Søknadskveld på Gløshaugen" />
          {error("title")}
        </div>
        <div className="grid min-w-0 gap-5 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor="event-type" className={accountLabel}>Type *</label>
            <select {...inputProps("type")} required defaultValue={eventTypes[0]}>
              {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            {error("type")}
          </div>
          <div className="min-w-0">
            <label htmlFor="event-date" className={accountLabel}>Dato *</label>
            <input {...inputProps("date")} type="date" required min={today} max="9999-12-31" />
            {error("date")}
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-5">
          <div className="min-w-0">
            <label htmlFor="event-startTime" className={accountLabel}>Fra klokken *</label>
            <input {...inputProps("startTime")} type="time" required />
            {error("startTime")}
          </div>
          <div className="min-w-0">
            <label htmlFor="event-endTime" className={accountLabel}>Til klokken *</label>
            <input {...inputProps("endTime")} type="time" required />
            {error("endTime")}
          </div>
        </div>
        <p className="text-xs text-ink-soft">Tidene gjelder norsk tid. Arrangementet starter og slutter samme dag.</p>
        <div>
          <label htmlFor="event-location" className={accountLabel}>Sted *</label>
          <input {...inputProps("location")} required maxLength={200} placeholder="Bygg og rom" />
          {error("location")}
        </div>
        <div>
          <label htmlFor="event-spots" className={accountLabel}>Antall plasser *</label>
          <input {...inputProps("spots")} type="number" required min={1} max={10000} step={1} defaultValue={50} />
          {error("spots")}
        </div>
        <div>
          <label htmlFor="event-description" className={accountLabel}>Beskrivelse <span className="font-normal text-ink-soft">(valgfritt)</span></label>
          <textarea {...inputProps("description")} maxLength={5000} rows={4} placeholder="Hva skjer, og hva bør deltakerne ta med?" />
          {error("description")}
        </div>
      </fieldset>
      <p className="mt-6 text-sm text-ink-soft">Arrangementet blir synlig på nettsiden og åpent for påmelding med en gang.</p>
      <button type="submit" disabled={pending} className="btn-primary mt-4 w-full disabled:opacity-60 sm:w-auto">{pending ? "Publiserer …" : "Publiser arrangement"}</button>
    </form>
  );
}
