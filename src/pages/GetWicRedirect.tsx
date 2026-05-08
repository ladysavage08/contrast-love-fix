import { useEffect } from "react";

const TARGET = "https://ecphd-getwic.qminder.site/#/";

const GetWicRedirect = () => {
  useEffect(() => {
    window.location.replace(TARGET);
  }, []);

  return (
    <main
      id="main"
      className="min-h-screen flex items-center justify-center bg-background text-foreground p-6"
    >
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold">Redirecting to WIC check-in…</h1>
        <p className="text-muted-foreground">
          If you are not redirected automatically,{" "}
          <a href={TARGET} className="underline text-primary">
            click here to continue
          </a>
          .
        </p>
      </div>
    </main>
  );
};

export default GetWicRedirect;
