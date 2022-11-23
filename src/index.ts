import { Value, ValueArray, ValueLimited } from "@sampilib/value"

enum DefaultThemes {
    light = 'Light',
    dark = 'Dark'
}

//Link to change theme
export let theme = new ValueLimited(DefaultThemes.light, (val) => {
    if (val in themeStorage) {
        return val;
    }
});

//List of available themes
export let themes = new ValueArray([DefaultThemes.light, DefaultThemes.dark]);

//Toggle for automatic theme change based on operating system
export let autoTheme = new Value(true);

/**This lets one add an variable to the theme engine
 * variable are added to the document root CSS ass --variables
 * @param name name of variable
 * @param light default value in day mode
 * @param dark defult value in night mode*/
export let registerVariable = async (name: string, light: ThemeValue, dark: ThemeValue) => {
    if (name in themeStorage[DefaultThemes.light]) {
        console.warn('Theme variable already registered ' + name);
    } else {
        themeStorage[DefaultThemes.light][name] = light;
        themeStorage[DefaultThemes.dark][name] = dark;
        for (let i = 0; i < documents.length; i++) {
            documents[i].documentElement.style.setProperty('--' + name, themeStorage[await theme.get][name]);
        }
    }
}

//List of registered documents
let documents: Document[] = []
//Registers a document with the theme engine, which 
export let registerDocument = async (doc: Document) => {
    if (documents.includes(doc)) {
        console.log('');
    } else {
        documents.push(doc);
        let style = doc.documentElement.style;
        let them = themeStorage[await theme.get];
        for (let key in them) {
            style.setProperty('--' + key, them[key]);
        }
    }
}

//This applies the current theme to a document
let applyTheme = (docu: Document, theme: string) => {
    let style = docu.documentElement.style;
    let them = themeStorage[theme];
    for (let key in them) {
        style.setProperty('--' + key, them[key]);
    }
}

type ThemeValue = string;

interface Theme {
    [k: string]: ThemeValue
}

interface Themes {
    [k: string]: Theme
}

//Storage of themes
let themeStorage: Themes = {
    [DefaultThemes.light]: {},
    [DefaultThemes.dark]: {},
};

//Listener for theme change
theme.addListener((value) => {
    localStorage.theme = value;
    for (let i = 0; i < documents.length; i++) {
        applyTheme(documents[i], value);
    }
});

//Loading saved theme from local storage
let storedTheme = <DefaultThemes | undefined>localStorage.theme;
if (storedTheme && storedTheme in themeStorage) {
    theme.set = storedTheme;
}

//Custom themes are retrieved from localstorage
let storedThemes = <string | undefined>localStorage.customThemes
if (storedThemes) {
    let storThemes = JSON.parse(storedThemes);
    let customKeys = Object.keys(storThemes);
    for (let i = 0, m = customKeys.length; i < m; i++) {
        if (!(customKeys[i] in themeStorage)) {
            themeStorage[customKeys[i]] = {}
        };
        let cusTheKeys = Object.keys(storThemes[customKeys[i]]);
        for (let y = 0, m = cusTheKeys.length; y < m; y++) {
            if (cusTheKeys[y] in themeStorage[DefaultThemes.light]) {
                themeStorage[customKeys[i]][cusTheKeys[y]] = storThemes[customKeys[i]][cusTheKeys[y]];
            }
        }
    }
}

//Custom themes are retrieved from localstorage
let storedAutoTheme = <string | undefined>localStorage.themeAuto
if (storedAutoTheme) {
    autoTheme.set = Boolean(JSON.parse(storedAutoTheme));
}

//Sets up automatic theme change based on operating system
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async (e) => {
    if (autoTheme.get) {
        theme.set = (e.matches ? DefaultThemes.dark : DefaultThemes.light);
    }
});
autoTheme.addListener((val) => {
    localStorage.themeAuto = val;
})

//Loading saved theme from local storage
if (!storedTheme) {
    (async () => {
        await new Promise<void>((a) => a());
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme.set = DefaultThemes.dark;
        } else {
            theme.set = DefaultThemes.light;
        }
    })();
}

//Registers the main document
registerDocument(document);
