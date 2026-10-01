import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Loader2, MessageCircleQuestion, RotateCcw, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * Flu-page question helper. One conversation, not saved anywhere — it clears
 * when the visitor leaves the page. Answers come from the `flu-assistant`
 * function, which is limited to approved ECHD flu content.
 */
const T = {
  en: {
    heading: "Have a question about flu shots?",
    intro:
      "Ask our AI-powered helper. It answers only from East Central Health District flu information and can point you to scheduling. It does not give medical advice.",
    label: "Your question",
    placeholder: "For example: How long does it take for the flu shot to work?",
    send: "Ask",
    stop: "Stop",
    clear: "Start over",
    you: "You",
    helper: "ECHD helper",
    thinking: "The helper is writing an answer…",
    error: "Sorry, the helper is unavailable right now. Please call 706-721-5800.",
    privacy: "Do not enter personal or medical details. Questions are not saved.",
    suggestions: ["Who should get a flu shot?", "How do I schedule my flu shot?", "Are there flu clinics near me?"],
  },
  es: {
    heading: "¿Tiene preguntas sobre la vacuna contra la influenza?",
    intro:
      "Pregunte a nuestro asistente con inteligencia artificial. Solo responde con información del Distrito de Salud del Centro Este sobre la influenza y puede indicarle cómo programar una cita. No ofrece consejos médicos.",
    label: "Su pregunta",
    placeholder: "Por ejemplo: ¿Cuánto tarda la vacuna en hacer efecto?",
    send: "Preguntar",
    stop: "Detener",
    clear: "Empezar de nuevo",
    you: "Usted",
    helper: "Asistente de ECHD",
    thinking: "El asistente está escribiendo una respuesta…",
    error: "Lo sentimos, el asistente no está disponible. Llame al 706-721-5800.",
    privacy: "No escriba datos personales ni médicos. Las preguntas no se guardan.",
    suggestions: ["¿Quién debe vacunarse?", "¿Cómo programo mi cita?", "¿Hay clínicas cerca de mí?"],
  },
};

const FluAssistant = ({ lang = "en" }: { lang?: "en" | "es" }) => {
  const t = T[lang];
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, error, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/flu-assistant`,
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: { lang },
    }),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (status === "ready") inputRef.current?.focus({ preventScroll: true });
  }, [status]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    sendMessage({ text: q.slice(0, 1000) });
    setInput("");
  };

  return (
    <section aria-labelledby="ask-heading" className="border-y border-border bg-secondary/40">
      <div className="container max-w-4xl py-12">
        <h2 id="ask-heading" className="mb-3 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <MessageCircleQuestion aria-hidden="true" className="h-7 w-7 shrink-0 text-primary" />
          {t.heading}
        </h2>
        <p className="mb-5 text-lg">{t.intro}</p>

        <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
          {messages.length > 0 && (
            <ol aria-live="polite" aria-label={t.heading} className="mb-4 max-h-[28rem] space-y-4 overflow-y-auto">
              {messages.map((m) => (
                <li key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div className={m.role === "user" ? "max-w-[85%] rounded-lg bg-primary px-4 py-2 text-primary-foreground" : "max-w-full"}>
                    <p className="sr-only">{m.role === "user" ? t.you : t.helper}:</p>
                    {m.parts.map((p, i) =>
                      p.type === "text" ? (
                        m.role === "user" ? (
                          <p key={i} className="whitespace-pre-wrap">{p.text}</p>
                        ) : (
                          <div key={i} className="prose max-w-none text-foreground">
                            <ReactMarkdown>{p.text}</ReactMarkdown>
                          </div>
                        )
                      ) : null,
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}

          {status === "submitted" && (
            <p role="status" className="mb-3 flex items-center gap-2 text-muted-foreground">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> {t.thinking}
            </p>
          )}
          {error && <p role="alert" className="mb-3 rounded border border-destructive p-3 font-medium text-destructive">{t.error}</p>}

          {messages.length === 0 && (
            <ul className="mb-4 flex flex-wrap gap-2" aria-label={lang === "es" ? "Preguntas sugeridas" : "Suggested questions"}>
              {t.suggestions.map((s) => (
                <li key={s}>
                  <Button type="button" variant="outline" size="sm" className="min-h-10" onClick={() => ask(s)}>{s}</Button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={(e) => { e.preventDefault(); ask(input); }}>
            <label htmlFor={`flu-q-${lang}`} className="mb-1 block font-semibold">{t.label}</label>
            <Textarea
              id={`flu-q-${lang}`}
              ref={inputRef}
              value={input}
              maxLength={1000}
              rows={2}
              placeholder={t.placeholder}
              aria-describedby={`flu-q-note-${lang}`}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input); }
              }}
            />
            <p id={`flu-q-note-${lang}`} className="mt-1 text-sm text-muted-foreground">{t.privacy}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {busy ? (
                <Button type="button" variant="outline" onClick={() => stop()} className="min-h-11">
                  <Square aria-hidden="true" className="mr-2 h-4 w-4" />{t.stop}
                </Button>
              ) : (
                <Button type="submit" disabled={!input.trim()} className="min-h-11">
                  <Send aria-hidden="true" className="mr-2 h-4 w-4" />{t.send}
                </Button>
              )}
              {messages.length > 0 && !busy && (
                <Button type="button" variant="ghost" className="min-h-11" onClick={() => setMessages([])}>
                  <RotateCcw aria-hidden="true" className="mr-2 h-4 w-4" />{t.clear}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FluAssistant;
