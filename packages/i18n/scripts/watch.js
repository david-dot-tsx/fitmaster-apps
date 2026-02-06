import { watch } from 'node:fs';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execPromise = promisify(exec);

console.log('👀 Watching locales for changes...');

watch('./src/locales/en', { recursive: true }, async (event, filename) => {
  if (filename && filename.endsWith('.json')) {
    console.log(`\n📄 File ${filename} changed. Regenerating types...`);
    
    try {
      const { stdout } = await execPromise('pnpm generate-types');
      console.log('✅ Types updated successfully!');
      if (stdout) console.log(stdout);
    } catch (error) {
      console.error('❌ Error regenerating types:', error.message);
    }
  }
});