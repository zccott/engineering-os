import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import type { ProblemExample } from "../../types/problem";
import { buildAutoRunHarness } from "./autoRunHarness";
import { withImplicitLog } from "./implicitLog";

interface CodePlaygroundProps {
  code: string;
  testCases?: ProblemExample[];
}

const CODE_FONT_STACK =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';

interface OutputLine {
  type: "log" | "warn" | "error" | "info";
  text: string;
}

// A sandboxed (allow-scripts + allow-modals, no allow-same-origin) iframe
// that runs whatever code it's sent via postMessage, and reports console
// output and errors back the same way. Because the iframe has no
// same-origin access, it can't touch this app's localStorage, cookies, or
// DOM — it's just a scratch JS environment. allow-modals is granted so
// example code that calls alert()/confirm()/prompt() actually shows a
// dialog instead of being silently ignored. The body includes a single
// stub <button>, and any button on the page is auto-clicked once the code
// has run, so "find a button, then react to a click on it" examples have
// something real to query and actually fire.
const SANDBOX_HTML = `<!doctype html><html><body><button>Sample button</button><script>
(function () {
  function send(type, args) {
    parent.postMessage({ source: "engineeringwiki-playground", type: type, args: args.map(String) }, "*");
  }
  ["log", "warn", "error", "info"].forEach(function (method) {
    console[method] = function () {
      send(method, Array.prototype.slice.call(arguments));
    };
  });
  window.onerror = function (message) {
    send("error", [String(message)]);
    return true;
  };
  window.addEventListener("message", function (event) {
    if (!event.data || event.data.type !== "run") return;
    try {
      new Function(event.data.code)();
      // Give click-handler demos something to react to, since there's no
      // real user to click the (hidden) stub button.
      document.querySelectorAll("button").forEach(function (btn) {
        btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
    } catch (error) {
      send("error", [error && error.message ? error.message : String(error)]);
    }
  });
})();
</script></body></html>`;

/**
 * An editable, runnable JavaScript playground attached to a code example.
 * Executes entirely inside a sandboxed iframe with no same-origin access,
 * so it can't reach this app's data — it's just a scratch environment.
 */
export default function CodePlayground({ code, testCases }: CodePlaygroundProps) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(code);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [running, setRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.data?.source !== "engineeringwiki-playground" ||
        event.source !== iframeRef.current?.contentWindow
      ) {
        return;
      }
      setOutput((prev) => [
        ...prev,
        { type: event.data.type, text: (event.data.args as string[]).join(" ") },
      ]);
      setRunning(false);
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const run = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    setOutput([]);
    setRunning(true);
    const harness = buildAutoRunHarness(source, testCases);
    // If there's a problem to check answers against, run the source plus
    // that harness unchanged. Otherwise, fall back to logging the last bare
    // expression so a plain example still shows something on Run even when
    // it never calls console.log itself.
    const codeToRun = harness ? source + harness : withImplicitLog(source);
    iframe.contentWindow.postMessage({ type: "run", code: codeToRun }, "*");
    // Nothing else logs "finished" — if the code never calls console.*,
    // just clear the running indicator shortly after.
    setTimeout(() => setRunning(false), 500);
  }, [source, testCases]);

  const reset = useCallback(() => {
    setSource(code);
    setOutput([]);
  }, [code]);

  return (
    <Box sx={{ mt: 1 }}>
      <Button
        size="small"
        variant="text"
        startIcon={<PlayArrowIcon fontSize="small" />}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Hide playground" : "Run this code"}
      </Button>

      <Collapse in={open} unmountOnExit={false}>
        <Box sx={{ mt: 1 }}>
          <Box
            component="textarea"
            value={source}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSource(e.target.value)}
            spellCheck={false}
            sx={[
              {
                width: "100%",
                minHeight: 140,
                boxSizing: "border-box",
                p: 1.5,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "grey.50",
                fontFamily: CODE_FONT_STACK,
                fontSize: "0.85rem",
                lineHeight: 1.6,
                color: "inherit",
                resize: "vertical",
              },
              (theme) => theme.applyStyles("dark", { bgcolor: "grey.900" }),
            ]}
          />

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<PlayArrowIcon fontSize="small" />}
              onClick={run}
              disabled={running}
            >
              Run
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ReplayIcon fontSize="small" />}
              onClick={reset}
            >
              Reset
            </Button>
          </Box>

          <Box
            sx={[
              {
                mt: 1,
                p: 1.5,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "grey.50",
                minHeight: 48,
                fontFamily: CODE_FONT_STACK,
                fontSize: "0.8rem",
                whiteSpace: "pre-wrap",
                overflowX: "auto",
              },
              (theme) => theme.applyStyles("dark", { bgcolor: "grey.900" }),
            ]}
          >
            {output.length === 0 ? (
              <Typography component="span" variant="body2" sx={{ color: "text.disabled", fontStyle: "italic" }}>
                {testCases && testCases.length > 0
                  ? "Click Run to see this solution's output for the examples above."
                  : "Output will appear here — try adding a console.log(...)."}
              </Typography>
            ) : (
              output.map((line, i) => (
                <Box
                  key={i}
                  component="div"
                  sx={{ color: line.type === "error" ? "error.main" : line.type === "warn" ? "warning.main" : "text.primary" }}
                >
                  {line.text}
                </Box>
              ))
            )}
          </Box>

          {/* Sandboxed, isolated execution environment — no allow-same-origin, so it
              cannot read this app's cookies, localStorage, or DOM. allow-modals
              lets alert()/confirm()/prompt() calls in example code display. */}
          <Box
            component="iframe"
            ref={iframeRef}
            title="Code playground sandbox"
            sandbox="allow-scripts allow-modals"
            srcDoc={SANDBOX_HTML}
            sx={{ display: "none" }}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
