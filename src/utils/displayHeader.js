import colors from 'colors/safe.js';

function displayHeader() {
  process.stdout.write('\x1Bc'); 

  console.log(`
            ${colors.rainbow('██╗    ██╗ ██╗ ███╗   ██╗ ███████╗ ███╗   ██╗ ██╗ ██████╗')}  
            ${colors.cyan('██║    ██║ ██║ ████╗  ██║ ██╔════╝ ████╗  ██║ ██║ ██╔══██╗')} 
            ${colors.green('██║ █╗ ██║ ██║ ██╔██╗ ██║ ███████╗ ██╔██╗ ██║ ██║ ██████╔╝')} 
            ${colors.yellow('██║███╗██║ ██║ ██║╚██╗██║ ╚════██║ ██║╚██╗██║ ██║ ██╔═══╝')}  
            ${colors.blue('╚███╔███╔╝ ██║ ██║ ╚████║ ███████║ ██║ ╚████║ ██║ ██║')}      
            ${colors.red(' ╚══╝╚══╝  ╚═╝ ╚═╝  ╚═══╝ ╚══════╝ ╚═╝  ╚═══╝ ╚═╝ ╚═╝')}  

            ${colors.bold('🔥 Join grup TG:')} ${colors.cyan.underline('@winsnip')}
            ${colors.bold('🔥 Auto Deploy and transfer Token')}
  `.split('\n').map(line => line.padStart(50)).join('\n'));
}

export default displayHeader;