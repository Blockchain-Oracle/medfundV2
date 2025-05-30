import { Buffer } from 'buffer';
import process from 'process';

// Make sure global is defined
window.global = window.global || window;
window.Buffer = window.Buffer || Buffer;
window.process = window.process || process;

// Set common globals used by crypto libraries
const globals = {
  Buffer,
  process,
};

export default globals; 