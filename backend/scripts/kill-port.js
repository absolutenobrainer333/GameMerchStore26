const { execSync } = require("child_process");

const PORT = process.env.PORT || 3001;

try {
  if (process.platform === "win32") {
    const out = execSync(`netstat -ano | findstr :${PORT}`).toString();
    const pids = new Set();
    out.split("\n").forEach((line) => {
      if (line.includes("LISTENING")) {
        const pid = line.trim().split(/\s+/).pop();
        if (pid && !isNaN(pid)) pids.add(pid);
      }
    });
    pids.forEach((pid) => {
      try {
        execSync(`taskkill /F /PID ${pid}`);
        console.log(`Killed PID ${pid} (was holding port ${PORT})`);
      } catch (_) {}
    });
  } else {
    execSync(`fuser -k ${PORT}/tcp`);
    console.log(`Cleared port ${PORT}`);
  }
} catch (_) {
  // nothing was on the port — that's fine
}
