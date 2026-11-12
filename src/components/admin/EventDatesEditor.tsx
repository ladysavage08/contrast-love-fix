import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatEventDateLabel, isOccurrenceOver, type OccurrenceRow } from "@/lib/eventOccurrences";

type Row = OccurrenceRow & { _key: string; _dirty?: boolean };

const blank = (): Row => ({
  _key: crypto.randomUUID(),
  event_date: "",
  end_date: null,
  start_time: null,
  end_time: null,
  location: null,
  details: null,
  link_url: null,
  link_label: null,
  cancelled: false,
  cancellation_note: null,
  _dirty: true,
});

const nz = (v: string | null | undefined) => (v && v.trim() ? v.trim() : null);

/**
 * Admin list of an event's confirmed dates. Each date can be added, edited,
 * canceled or removed on its own. After every change the post's main
 * event_date/event_end_date are kept in step (next date / last date).
 */
export default function EventDatesEditor({
  postId,
  onSynced,
}: {
  postId: string;
  onSynced?: (eventDate: string, eventEndDate: string) => void;
}) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data, error } = await supabase
      .from("post_event_dates")
      .select("*")
      .eq("post_id", postId)
      .order("event_date");
    if (error) toast({ title: "Couldn't load event dates", description: error.message, variant: "destructive" });
    setRows(((data ?? []) as OccurrenceRow[]).map((r) => ({ ...r, _key: r.id! })));
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function syncPost(list: OccurrenceRow[]) {
    const confirmed = list.filter((r) => !r.cancelled && r.event_date).sort((a, b) => a.event_date.localeCompare(b.event_date));
    if (!confirmed.length) return;
    const next = confirmed.find((r) => !isOccurrenceOver(r)) ?? confirmed[confirmed.length - 1];
    const last = confirmed[confirmed.length - 1];
    const lastEnd = last.end_date || last.event_date;
    await supabase.from("posts").update({ event_date: next.event_date, event_end_date: lastEnd }).eq("id", postId);
    onSynced?.(next.event_date, lastEnd);
  }

  const update = (key: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r._key === key ? { ...r, ...patch, _dirty: true } : r)));

  async function save(r: Row) {
    if (!r.event_date) {
      toast({ title: "Pick a date first", variant: "destructive" });
      return;
    }
    const payload = {
      post_id: postId,
      event_date: r.event_date,
      end_date: nz(r.end_date) && r.end_date! > r.event_date ? r.end_date : null,
      start_time: nz(r.start_time),
      end_time: nz(r.end_time),
      location: nz(r.location),
      details: nz(r.details),
      link_url: nz(r.link_url),
      link_label: nz(r.link_label),
      cancelled: !!r.cancelled,
      cancellation_note: r.cancelled ? nz(r.cancellation_note) : null,
    };
    const { error } = r.id
      ? await supabase.from("post_event_dates").update(payload).eq("id", r.id)
      : await supabase.from("post_event_dates").insert(payload);
    if (error) {
      toast({ title: "Couldn't save date", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Event date saved" });
    await load();
    const { data } = await supabase.from("post_event_dates").select("*").eq("post_id", postId);
    await syncPost((data ?? []) as OccurrenceRow[]);
  }

  async function remove(r: Row) {
    if (!r.id) {
      setRows((rs) => rs.filter((x) => x._key !== r._key));
      return;
    }
    if (!window.confirm(`Remove ${formatEventDateLabel(r.event_date, r.end_date)}? To keep it in the event's history, mark it Canceled instead.`)) return;
    const { error } = await supabase.from("post_event_dates").delete().eq("id", r.id);
    if (error) {
      toast({ title: "Couldn't remove date", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Event date removed" });
    const remaining = rows.filter((x) => x.id && x.id !== r.id);
    setRows((rs) => rs.filter((x) => x._key !== r._key));
    await syncPost(remaining);
  }

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-4">
      <legend className="px-1 text-base font-semibold">Event dates</legend>
      <p className="text-sm text-muted-foreground">
        List every confirmed date. The website shows the next upcoming date and moves to the following one
        automatically after each date ends (Eastern Time). When this list has dates, it replaces the single
        "Event date" above. Dates are never generated automatically.
      </p>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading dates…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No extra dates yet — the single event date above is used.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) => {
            const id = `occ-${r._key}`;
            const over = r.event_date && !r._dirty ? isOccurrenceOver(r) : false;
            return (
              <li key={r._key} className="rounded border border-border bg-muted/30 p-3">
                <p className="mb-2 text-sm font-medium">
                  {r.event_date ? formatEventDateLabel(r.event_date, r.end_date) : `New date ${i + 1}`}
                  {r.cancelled ? " · Canceled" : over ? " · Past" : ""}
                </p>
                <div className="grid gap-2 sm:grid-cols-4">
                  <div>
                    <Label htmlFor={`${id}-d`}>Date</Label>
                    <Input id={`${id}-d`} type="date" value={r.event_date} onChange={(e) => update(r._key, { event_date: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor={`${id}-ed`}>End date (multi-day)</Label>
                    <Input id={`${id}-ed`} type="date" min={r.event_date || undefined} value={r.end_date ?? ""} onChange={(e) => update(r._key, { end_date: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor={`${id}-st`}>Start time</Label>
                    <Input id={`${id}-st`} type="time" value={(r.start_time ?? "").slice(0, 5)} onChange={(e) => update(r._key, { start_time: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor={`${id}-et`}>End time</Label>
                    <Input id={`${id}-et`} type="time" value={(r.end_time ?? "").slice(0, 5)} onChange={(e) => update(r._key, { end_time: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={`${id}-loc`}>Location for this date (optional)</Label>
                    <Input id={`${id}-loc`} maxLength={200} value={r.location ?? ""} onChange={(e) => update(r._key, { location: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={`${id}-det`}>Note for this date (optional)</Label>
                    <Input id={`${id}-det`} maxLength={500} value={r.details ?? ""} onChange={(e) => update(r._key, { details: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={`${id}-url`}>Registration link for this date (optional)</Label>
                    <Input id={`${id}-url`} type="url" maxLength={500} placeholder="https://…" value={r.link_url ?? ""} onChange={(e) => update(r._key, { link_url: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor={`${id}-ll`}>Link label (optional)</Label>
                    <Input id={`${id}-ll`} maxLength={80} placeholder="Register" value={r.link_label ?? ""} onChange={(e) => update(r._key, { link_label: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-4">
                    <input
                      id={`${id}-c`}
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!r.cancelled}
                      onChange={(e) => update(r._key, { cancelled: e.target.checked })}
                    />
                    <Label htmlFor={`${id}-c`}>Canceled (kept in history, hidden from upcoming)</Label>
                  </div>
                  {r.cancelled && (
                    <div className="sm:col-span-4">
                      <Label htmlFor={`${id}-cn`}>Cancellation note (optional)</Label>
                      <Input id={`${id}-cn`} maxLength={300} value={r.cancellation_note ?? ""} onChange={(e) => update(r._key, { cancellation_note: e.target.value })} />
                    </div>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button type="button" size="sm" onClick={() => save(r)} disabled={!r._dirty}>
                    Save date
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => remove(r)}>
                    Remove
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Button type="button" variant="outline" size="sm" onClick={() => setRows((rs) => [...rs, blank()])}>
        Add a date
      </Button>
    </fieldset>
  );
}
