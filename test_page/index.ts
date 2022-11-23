import { autoTheme, registerVariable, theme, themes } from "../src"

registerVariable('test', 'blue', 'black');
registerVariable('test2', 'test', 'asdf');

document.body.style.backgroundColor = 'var(--test)';

let autoOff = document.body.appendChild(document.createElement('button'));
autoOff.innerHTML = 'Turn Auto Theme Off';
autoOff.addEventListener('click', () => { autoTheme.set = false; });
let autoON = document.body.appendChild(document.createElement('button'));
autoON.innerHTML = 'Turn Auto Theme On';
autoON.addEventListener('click', () => { autoTheme.set = true; });

(async () => {
    let themesArray = await themes.get;
    for (let i = 0; i < themesArray.length; i++) {
        let test = document.body.appendChild(document.createElement('button'));
        test.innerHTML = themesArray[i];
        test.addEventListener('click', () => {
            theme.set = themesArray[i];
        })
    }
})()

