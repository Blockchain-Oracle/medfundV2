// Custom ESM loader for handling path aliases in Node.js
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { pathToFileURL } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Handle resolving the @ alias to the src directory
export function resolve(specifier, context, nextResolve) {
  // Check if the import specifier starts with @/
  if (specifier.startsWith('@/')) {
    // Replace @/ with the path to src directory
    const resolvedSpecifier = pathToFileURL(
      resolve(__dirname, 'src', specifier.substring(2))
    ).href;
    
    return nextResolve(resolvedSpecifier, context);
  }
  
  // For all other imports, use the default resolver
  return nextResolve(specifier, context);
} 